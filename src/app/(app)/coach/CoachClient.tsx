'use client'

import { useEffect, useRef, useState } from 'react'
import { askCoach, updatePersonality, type LLMProvider } from './actions'
import { LLM_OPTIONS } from '@/lib/llm-options'

interface Task {
  title: string
  difficulty: string
  is_completed: boolean
}

interface Profile {
  name: string
  level: number
  xp_current: number
  xp_total: number
  streak_current: number
  streak_best: number
  coach_personality: string | null
  lang_preference: string | null
}

interface Message {
  role: 'user' | 'coach'
  text: string
  ts: number
  llm?: LLMProvider
}

const PERSONALITIES = ['mentor', 'cheerleader', 'analyst'] as const
type Personality = (typeof PERSONALITIES)[number]

const text = {
  en: {
    title: 'AI Coach',
    subtitle: 'Pick a style and talk through your next move.',
    personality: 'Coach Style',
    brain: 'Model',
    placeholder: 'Ask your coach anything...',
    thinking: 'Thinking...',
    level: 'Level',
    streak: 'Streak',
    done: 'Done',
    welcome: "I'm here. Tell me what you're stuck on and we'll work it out.",
    prompts: ['How am I doing?', 'What should I focus on?', 'Help me recover momentum', 'Give me a short pep talk'],
    personalities: { mentor: 'Mentor', cheerleader: 'Cheerleader', analyst: 'Analyst' },
  },
  zh: {
    title: 'AI 教练',
    subtitle: '选一个风格，一起拆解下一步。',
    personality: '教练风格',
    brain: '模型',
    placeholder: '随便问你的教练一个问题...',
    thinking: '思考中...',
    level: '等级',
    streak: '连续天数',
    done: '已完成',
    welcome: '我在这里。告诉我你卡在哪里，我们一起拆开看。',
    prompts: ['我现在进展如何？', '我应该先做什么？', '帮我恢复节奏', '给我一句鼓励'],
    personalities: { mentor: '导师', cheerleader: '打气王', analyst: '分析师' },
  },
}

const personalityColors: Record<Personality, { bg: string; accent: string; emoji: string }> = {
  mentor: { bg: '#1B3A5C', accent: '#2196F3', emoji: '🧭' },
  cheerleader: { bg: '#7B2D8B', accent: '#E91E63', emoji: '📣' },
  analyst: { bg: '#1B5C3A', accent: '#4CAF50', emoji: '📊' },
}

export default function CoachClient({ profile, recentTasks }: { profile: Profile | null; recentTasks: Task[] }) {
  const lang = profile?.lang_preference === 'zh' ? 'zh' : 'en'
  const copy = text[lang]
  const [personality, setPersonality] = useState<Personality>((profile?.coach_personality as Personality) || 'mentor')
  const [llm, setLlm] = useState<LLMProvider>('glm-flash')
  const [messages, setMessages] = useState<Message[]>([{ role: 'coach', text: copy.welcome, ts: Date.now() }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const colors = personalityColors[personality]

  const sendMessage = async (preset?: string) => {
    const outgoing = (preset || input).trim()
    if (!outgoing || loading) return

    setMessages((prev) => [...prev, { role: 'user', text: outgoing, ts: Date.now() }])
    setInput('')
    setLoading(true)

    const { reply, error } = await askCoach({
      name: profile?.name || 'Explorer',
      level: profile?.level || 1,
      xpCurrent: profile?.xp_current || 0,
      streakCurrent: profile?.streak_current || 0,
      streakBest: profile?.streak_best || 0,
      personality,
      lang,
      llm,
      recentTasks,
      userMessage: outgoing,
    })

    setLoading(false)
    setMessages((prev) => [
      ...prev,
      {
        role: 'coach',
        text: error ? `Error: ${error}` : reply,
        ts: Date.now(),
        llm,
      },
    ])
  }

  const completed = recentTasks.filter((task) => task.is_completed).length

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4F8', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ background: `linear-gradient(135deg,${colors.bg},${colors.accent})`, padding: '18px 20px 14px', color: 'white' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{copy.title}</div>
          <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 12 }}>{copy.subtitle}</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 10 }}>
            <div>
              <div style={{ fontSize: 10, opacity: 0.65, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{copy.personality}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {PERSONALITIES.map((option) => (
                  <button
                    key={option}
                    onClick={async () => {
                      setPersonality(option)
                      await updatePersonality(option)
                    }}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 20,
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 700,
                      background: personality === option ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.18)',
                      color: personality === option ? colors.bg : 'white',
                    }}
                  >
                    {personalityColors[option].emoji} {copy.personalities[option]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 10, opacity: 0.65, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{copy.brain}</div>
              <select value={llm} onChange={(event) => setLlm(event.target.value as LLMProvider)} style={{ width: '100%', padding: '10px 12px', borderRadius: 12, border: 'none', fontWeight: 700 }}>
                {Object.entries(LLM_OPTIONS).map(([id, option]) => (
                  <option key={id} value={id}>
                    {option.flag} {lang === 'zh' ? option.labelZh : option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '14px 16px 110px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {[
            { label: copy.level, value: profile?.level || 1, emoji: '⭐' },
            { label: copy.streak, value: profile?.streak_current || 0, emoji: '🔥' },
            { label: copy.done, value: completed, emoji: '✓' },
          ].map((stat) => (
            <div key={stat.label} style={{ flex: 1, background: 'white', borderRadius: 12, padding: '10px 6px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 16 }}>{stat.emoji}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#0D1B2A' }}>{stat.value}</div>
              <div style={{ fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: 16, padding: 16, marginBottom: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', minHeight: 280, maxHeight: 420, overflowY: 'auto' }}>
          {messages.map((message, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
              {message.role === 'coach' && (
                <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, background: `linear-gradient(135deg,${colors.bg},${colors.accent})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, marginRight: 8, marginTop: 2 }}>
                  {message.llm ? LLM_OPTIONS[message.llm].flag : colors.emoji}
                </div>
              )}
              <div>
                <div style={{ maxWidth: 320, padding: '10px 13px', borderRadius: message.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: message.role === 'user' ? `linear-gradient(135deg,${colors.bg},${colors.accent})` : '#F8FAFC', color: message.role === 'user' ? 'white' : '#0D1B2A', fontSize: 13, lineHeight: 1.5 }}>
                  {message.text}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: `linear-gradient(135deg,${colors.bg},${colors.accent})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                {LLM_OPTIONS[llm].flag}
              </div>
              <div style={{ background: '#F8FAFC', padding: '9px 13px', borderRadius: '16px 16px 16px 4px', fontSize: 13, color: '#9CA3AF' }}>{copy.thinking}</div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          {copy.prompts.map((prompt) => (
            <button key={prompt} onClick={() => void sendMessage(prompt)} style={{ padding: '6px 11px', borderRadius: 20, border: `1.5px solid ${colors.accent}`, background: 'white', color: colors.accent, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', padding: '10px 16px 16px', boxShadow: '0 -2px 12px rgba(0,0,0,0.08)' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void sendMessage() } }} placeholder={copy.placeholder} style={{ flex: 1, padding: '12px 16px', borderRadius: 24, border: `1.5px solid ${input ? colors.accent : '#E5E7EB'}`, fontSize: 14, outline: 'none' }} />
            <button onClick={() => void sendMessage()} disabled={loading || !input.trim()} style={{ width: 46, height: 46, borderRadius: '50%', border: 'none', background: loading || !input.trim() ? '#E5E7EB' : `linear-gradient(135deg,${colors.bg},${colors.accent})`, color: 'white', fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer' }}>
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
