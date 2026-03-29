'use server'

import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

interface CoachContext {
  name: string
  level: number
  xpCurrent: number
  streakCurrent: number
  streakBest: number
  personality: 'mentor' | 'cheerleader' | 'analyst'
  lang: 'en' | 'zh'
  recentTasks: Array<{ title: string; difficulty: string; is_completed: boolean }>
  userMessage: string
}

const PERSONALITY_PROMPTS = {
  mentor: {
    en: `You are a wise and supportive mentor coach in a gamified productivity app called Flow / 流动.
You speak with calm authority, ask thoughtful questions, and give structured advice.
You believe in the user's potential and help them reflect on their journey.
Keep responses concise (2-4 sentences max). Be encouraging but honest.`,
    zh: `你是Flow/流动游戏化效率应用中一位智慧且支持性的导师教练。
你说话沉稳权威，提问深思熟虑，给出有条理的建议。
你相信用户的潜力，帮助他们反思自己的旅程。
回复简洁（最多2-4句话）。鼓励但诚实。`
  },
  cheerleader: {
    en: `You are an enthusiastic, high-energy cheerleader coach in Flow / 流动 app!
You celebrate EVERY win, use emojis freely, and pump the user up with positive energy!
You're like their biggest fan who believes they can achieve anything!
Keep responses punchy and exciting (2-4 sentences). LOTS of encouragement!`,
    zh: `你是Flow/流动应用中一位充满热情、活力四射的啦啦队教练！
你庆祝每一个胜利，自由使用表情符号，用正能量激励用户！
你就像他们最大的粉丝，相信他们能实现一切！
回复简洁有力（2-4句话）。大量鼓励！`
  },
  analyst: {
    en: `You are a data-driven analytical coach in Flow / 流动 app.
You analyze patterns, give specific metrics-based feedback, and suggest optimizations.
You speak precisely and focus on what the data shows about the user's performance.
Keep responses focused and actionable (2-4 sentences). Reference their actual stats.`,
    zh: `你是Flow/流动应用中一位数据驱动的分析型教练。
你分析规律，提供基于具体指标的反馈，并建议优化方案。
你说话精准，专注于数据显示的用户表现。
回复专注且可操作（2-4句话）。引用他们的实际数据。`
  }
}

export async function askCoach(ctx: CoachContext): Promise<{ reply: string; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { reply: '', error: 'Not authenticated' }

    const personality = ctx.personality || 'mentor'
    const lang = ctx.lang || 'en'
    const systemPrompt = PERSONALITY_PROMPTS[personality][lang]

    const completedCount = ctx.recentTasks.filter(t => t.is_completed).length
    const pendingCount = ctx.recentTasks.filter(t => !t.is_completed).length

    const contextBlock = lang === 'zh'
      ? `用户数据：姓名${ctx.name}，等级${ctx.level}，当前连续${ctx.streakCurrent}天，最佳连续${ctx.streakBest}天，最近完成${completedCount}个任务，待完成${pendingCount}个。`
      : `User stats: ${ctx.name}, Level ${ctx.level}, ${ctx.streakCurrent}-day streak (best: ${ctx.streakBest}), recently completed ${completedCount} tasks, ${pendingCount} pending.`

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 200,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `${contextBlock}\n\n${ctx.userMessage}`
        }
      ]
    })

    const reply = message.content[0].type === 'text' ? message.content[0].text : ''
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

  await supabase
    .from('users')
    .update({ coach_personality: personality })
    .eq('id', user.id)
}
