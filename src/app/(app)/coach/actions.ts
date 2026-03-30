'use server'

import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

// ─── LLM Provider Registry ───────────────────────────────────────────────────

export type LLMProvider = 'claude-haiku' | 'deepseek' | 'glm-flash' | 'gemini-flash'

export const LLM_OPTIONS: Record<LLMProvider, { label: string; labelZh: string; flag: string; note: string; noteZh: string }> = {
  'claude-haiku':  { label: 'Claude Haiku',   labelZh: 'Claude Haiku',  flag: '🤖', note: 'Fast & smart',    noteZh: '快速智能' },
  'deepseek':      { label: 'DeepSeek V3',    labelZh: 'DeepSeek V3',   flag: '🔍', note: 'Deep reasoning',  noteZh: '深度推理' },
  'glm-flash':     { label: 'GLM Flash',      labelZh: 'GLM 极速',       flag: '⚡', note: 'Ultra fast',      noteZh: '极速响应' },
  'gemini-flash':  { label: 'Gemini Flash',   labelZh: 'Gemini Flash',  flag: '✨', note: 'Google AI',       noteZh: '谷歌AI' },
}

// ─── Personality Prompts ──────────────────────────────────────────────────────

const PERSONALITY_PROMPTS = {
  mentor: {
    en: `You are a wise and supportive mentor coach in a gamified productivity app called Flow / 流动.
Speak with calm authority, ask thoughtful questions, give structured advice. Be encouraging but honest.
Keep responses concise: 2-4 sentences max. No bullet lists — flowing prose only.`,
    zh: `你是Flow/流动游戏化效率应用中一位智慧的导师教练。沉稳权威，提问深思，建议有条理。鼓励但诚实。
回复简洁（2-4句话），用流畅的散文，不用列表。`
  },
  cheerleader: {
    en: `You are an enthusiastic cheerleader coach in Flow / 流动 app! Celebrate every win, use emojis, pump them up!
Keep it punchy and exciting — 2-4 sentences. You believe they can achieve anything!`,
    zh: `你是Flow/流动中充满热情的啦啦队教练！庆祝每个胜利，用表情符号，激励他们！
回复简洁有力（2-4句话）。你相信他们能实现一切！`
  },
  analyst: {
    en: `You are a data-driven analytical coach in Flow / 流动 app. Analyze patterns, give metrics-based feedback, suggest optimizations.
Speak precisely and reference their actual stats. 2-4 sentences, actionable.`,
    zh: `你是Flow/流动中数据驱动的分析型教练。分析规律，基于指标反馈，建议优化。
精准表达，引用实际数据。2-4句话，可操作。`
  }
}

// ─── Context Builder ──────────────────────────────────────────────────────────

export interface CoachContext {
  name: string
  level: number
  xpCurrent: number
  streakCurrent: number
  streakBest: number
  personality: 'mentor' | 'cheerleader' | 'analyst'
  lang: 'en' | 'zh'
  llm: LLMProvider
  recentTasks: Array<{ title: string; difficulty: string; is_completed: boolean }>
  userMessage: string
}

function buildSystemPrompt(ctx: CoachContext): string {
  return PERSONALITY_PROMPTS[ctx.personality][ctx.lang]
}

function buildUserMessage(ctx: CoachContext): string {
  const completed = ctx.recentTasks.filter(t => t.is_completed).length
  const pending = ctx.recentTasks.filter(t => !t.is_completed).length
  const stats = ctx.lang === 'zh'
    ? `用户：${ctx.name}，等级${ctx.level}，连续${ctx.streakCurrent}天（最佳${ctx.streakBest}天），近期完成${completed}个任务，待完成${pending}个。`
    : `User: ${ctx.name}, Level ${ctx.level}, ${ctx.streakCurrent}-day streak (best: ${ctx.streakBest}), ${completed} tasks done recently, ${pending} pending.`
  return `${stats}\n\n${ctx.userMessage}`
}

// ─── LLM Callers ─────────────────────────────────────────────────────────────

async function callClaude(system: string, message: string): Promise<string> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const res = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 200,
    system,
    messages: [{ role: 'user', content: message }]
  })
  return res.content[0].type === 'text' ? res.content[0].text : ''
}

async function callOpenAICompat(system: string, message: string, baseUrl: string, apiKey: string, model: string): Promise<string> {
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      max_tokens: 200,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: message }
      ]
    })
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`${model} error ${res.status}: ${err.slice(0, 200)}`)
  }
  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}

async function callGemini(system: string, message: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY
  const model = 'gemini-1.5-flash'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: system }] },
      contents: [{ parts: [{ text: message }] }],
      generationConfig: { maxOutputTokens: 200 }
    })
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini error ${res.status}: ${err.slice(0, 200)}`)
  }
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

// ─── Main Action ──────────────────────────────────────────────────────────────

export async function askCoach(ctx: CoachContext): Promise<{ reply: string; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { reply: '', error: 'Not authenticated' }

    const system = buildSystemPrompt(ctx)
    const userMsg = buildUserMessage(ctx)
    let reply = ''

    switch (ctx.llm) {
      case 'claude-haiku':
        if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not set in Vercel env vars')
        reply = await callClaude(system, userMsg)
        break

      case 'deepseek':
        if (!process.env.DEEPSEEK_API_KEY) throw new Error('DEEPSEEK_API_KEY not set')
        reply = await callOpenAICompat(system, userMsg, 'https://api.deepseek.com', process.env.DEEPSEEK_API_KEY, 'deepseek-chat')
        break

      case 'glm-flash':
        if (!process.env.ZAI_API_KEY) throw new Error('ZAI_API_KEY not set')
        reply = await callOpenAICompat(system, userMsg, 'https://open.bigmodel.cn/api/paas/v4', process.env.ZAI_API_KEY, 'glm-4v-flash')
        break

      case 'gemini-flash':
        if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not set')
        reply = await callGemini(system, userMsg)
        break

      default:
        throw new Error('Unknown LLM provider')
    }

    return { reply }
  } catch (err: unknown) {
    console.error('Coach error:', err)
    const message = err instanceof Error ? err.message : 'Coach unavailable right now'
    return { reply: '', error: message }
  }
}

export async function updatePersonality(personality: 'mentor' | 'cheerleader' | 'analyst') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('users').update({ coach_personality: personality }).eq('id', user.id)
}
