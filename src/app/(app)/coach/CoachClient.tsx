'use client'

import { useState, useRef, useEffect } from 'react'
import { askCoach, updatePersonality, LLMProvider } from './actions'
import { LLM_OPTIONS } from '@/lib/llm-options'

interface Task { title: string; difficulty: string; is_completed: boolean }
interface Profile {
  name: string; level: number; xp_current: number; xp_total: number;
  streak_current: number; streak_best: number;
  coach_personality: string | null; lang_preference: string | null
}
interface Message { role: 'user' | 'coach'; text: string; ts: number; llm?: LLMProvider }

const PERSONALITIES = ['mentor', 'cheerleader', 'analyst'] as const
type Personality = typeof PERSONALITIES[number]

const tx = {
  en: {
    title: 'AI Coach', subtitle: 'Choose your intelligence',
    personalityLabel: 'Coach Style',
    llmLabel: 'AI Brain',
    personalities: { mentor: '🧙 Mentor', cheerleader: '🎉 Cheerleader', analyst: '📊 Analyst' },
    personalityDesc: { mentor: 'Wise guidance', cheerleader: 'Pure hype!', analyst: 'Data-driven' },
    placeholder: 'Ask your coach anything...',
    thinking: 'Thinking...', level: 'Level', streak: 'Streak', done: 'Done',
    prompts: ['How am I doing?', 'Help me focus', 'What to work on?', 'Motivate me! 🔥'],
    welcome: "Hi! I'm your AI coach — pick your AI brain above, then ask me anything! 🎮"
  },
  zh: {
    title: 'AI教练', subtitle: '选择你的智能大脑',
    personalityLabel: '教练风格',
    llmLabel: 'AI大脑',
    personalities: { mentor: '🧙 导师', cheerleader: '🎉 啦啦队', analyst: '📊 分析师' },
    personalityDesc: { mentor: '智慧引导', cheerleader: '纯粹热情！', analyst: '数据驱动' },
    placeholder: '问你的教练任何问题...',
    thinking: '思考中...', level: '等级', streak: '连续', done: '完成',
    prompts: ['我进展如何？', '帮我专注', '该做什么？', '激励我！🔥'],
    welcome: '嗨！我是你的AI教练——选择上方的AI大脑，然后问我任何问题！🎮'
  }
}

const PERSONALITY_COLORS: Record<Personality, { bg: string; accent: string }> = {
  mentor:      { bg: '#1B3A5C', accent: '#2196F3' },
  cheerleader: { bg: '#7B2D8B', accent: '#E91E63' },
  analyst:     { bg: '#1B5C3A', accent: '#4CAF50' },
}

const LLM_COLORS: Record<LLMProvider, string> = {
  'claude-haiku': '#B45309',
  'deepseek':     '#1E40AF',
  'glm-flash':    '#065F46',
  'gemini-flash': '#7C3AED',
}

export default function CoachClient({ profile, recentTasks }: { profile: Profile | null; recentTasks: Task[] }) {
  const lang = (profile?.lang_preference === 'zh' ? 'zh' : 'en') as 'en' | 'zh'
  const t = tx[lang]

  const [personality, setPersonalityState] = useState<Personality>(
    (profile?.coach_personality as Personality) || 'mentor'
  )
  const [llm, setLlm] = useState<LLMProvider>('glm-flash') // default: free & fast
  const [messages, setMessages] = useState<Message[]>([
    { role: 'coach', text: t.welcome, ts: Date.now() }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showLlmMenu, setShowLlmMenu] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const colors = PERSONALITY_COLORS[personality]
  const llmColor = LLM_COLORS[llm]
  const llmInfo = LLM_OPTIONS[llm]

  const handlePersonality = async (p: Personality) => {
    setPersonalityState(p)
    await updatePersonality(p)
  }

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: msg, ts: Date.now() }])
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
      userMessage: msg
    })
    setLoading(false)
    setMessages(prev => [...prev, {
      role: 'coach',
      text: error ? `❌ ${error}` : reply,
      ts: Date.now(),
      llm
    }])
  }

  const personalityEmoji = { mentor: '🧙', cheerleader: '🎉', analyst: '📊' }[personality]

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4F8', fontFamily: 'system-ui,sans-serif' }}>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg,${colors.bg},${colors.accent})`, padding: '18px 20px 14px', color: 'white' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: 11, opacity: 0.7, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2 }}>FLOW / 流动</div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{t.title}</div>
          <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 12 }}>{t.subtitle}</div>

          {/* Two-row controls */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-start' }}>

            {/* Personality pills */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 10, opacity: 0.6, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 5 }}>{t.personalityLabel}</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {PERSONALITIES.map(p => (
                  <button key={p} onClick={() => handlePersonality(p)} style={{
                    padding: '5px 10px', borderRadius: 20, border: 'none', cursor: 'pointer',
                    fontSize: 11, fontWeight: 700, transition: 'all 0.15s',
                    background: personality === p ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.2)',
                    color: personality === p ? colors.bg : 'white'
                  }}>
                    {t.personalities[p]}
                  </button>
                ))}
              </div>
            </div>

            {/* LLM dropdown */}
            <div style={{ position: 'relative', minWidth: 150 }}>
              <div style={{ fontSize: 10, opacity: 0.6, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 5 }}>{t.llmLabel}</div>
              <button onClick={() => setShowLlmMenu(v => !v)} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 20, border: '2px solid rgba(255,255,255,0.6)',
                background: 'rgba(255,255,255,0.15)', color: 'white',
                fontSize: 12, fontWeight: 700, cursor: 'pointer', width: '100%'
              }}>
                <span>{llmInfo.flag}</span>
                <span style={{ flex: 1, textAlign: 'left' }}>{lang === 'zh' ? llmInfo.labelZh : llmInfo.label}</span>
                <span style={{ fontSize: 10 }}>▾</span>
              </button>
              {showLlmMenu && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
                  background: 'white', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  overflow: 'hidden', marginTop: 4
                }}>
                  {(Object.entries(LLM_OPTIONS) as [LLMProvider, typeof LLM_OPTIONS[LLMProvider]][]).map(([id, info]) => (
                    <button key={id} onClick={() => { setLlm(id); setShowLlmMenu(false) }} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      width: '100%', padding: '10px 14px', border: 'none',
                      background: llm === id ? '#F0F4F8' : 'white',
                      cursor: 'pointer', textAlign: 'left',
                      borderLeft: llm === id ? `3px solid ${LLM_COLORS[id]}` : '3px solid transparent'
                    }}>
                      <span style={{ fontSize: 18 }}>{info.flag}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#0D1B2A' }}>{lang === 'zh' ? info.labelZh : info.label}</div>
                        <div style={{ fontSize: 11, color: '#9CA3AF' }}>{lang === 'zh' ? info.noteZh : info.note}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '14px 16px 110px' }} onClick={() => setShowLlmMenu(false)}>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {[
            { label: t.level, value: profile?.level || 1, emoji: '⭐' },
            { label: t.streak, value: profile?.streak_current || 0, emoji: '🔥' },
            { label: t.done, value: recentTasks.filter(t => t.is_completed).length, emoji: '✅' }
          ].map(s => (
            <div key={s.label} style={{
              flex: 1, background: 'white', borderRadius: 12, padding: '10px 6px',
              textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
            }}>
              <div style={{ fontSize: 16 }}>{s.emoji}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#0D1B2A' }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Chat */}
        <div style={{
          background: 'white', borderRadius: 16, padding: 16, marginBottom: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)', minHeight: 280, maxHeight: 380, overflowY: 'auto'
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
              {msg.role === 'coach' && (
                <div style={{
                  width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                  background: msg.llm ? `linear-gradient(135deg,${LLM_COLORS[msg.llm]},${LLM_COLORS[msg.llm]}99)` : `linear-gradient(135deg,${colors.bg},${colors.accent})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, marginRight: 8, marginTop: 2
                }}>
                  {msg.llm ? LLM_OPTIONS[msg.llm].flag : personalityEmoji}
                </div>
              )}
              <div>
                <div style={{
                  maxWidth: 260, padding: '9px 13px',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user'
                    ? `linear-gradient(135deg,${colors.bg},${colors.accent})`
                    : '#F8FAFC',
                  color: msg.role === 'user' ? 'white' : '#0D1B2A',
                  fontSize: 13, lineHeight: 1.5,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.07)'
                }}>
                  {msg.text}
                </div>
                {msg.role === 'coach' && msg.llm && (
                  <div style={{ fontSize: 9, color: '#C0CBDA', marginTop: 2, marginLeft: 2 }}>
                    via {LLM_OPTIONS[msg.llm].label}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: `linear-gradient(135deg,${llmColor},${llmColor}99)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14
              }}>
                {llmInfo.flag}
              </div>
              <div style={{
                background: '#F8FAFC', padding: '9px 13px',
                borderRadius: '16px 16px 16px 4px', fontSize: 13, color: '#9CA3AF'
              }}>
                {t.thinking}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          {t.prompts.map(p => (
            <button key={p} onClick={() => sendMessage(p)} style={{
              padding: '5px 11px', borderRadius: 20,
              border: `1.5px solid ${colors.accent}`,
              background: 'white', color: colors.accent,
              fontSize: 12, fontWeight: 600, cursor: 'pointer'
            }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Fixed input */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'white', padding: '10px 16px 16px',
        boxShadow: '0 -2px 12px rgba(0,0,0,0.08)'
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          {/* LLM badge above input */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '2px 8px', borderRadius: 10, marginBottom: 6,
            background: `${llmColor}18`, color: llmColor,
            fontSize: 10, fontWeight: 700, letterSpacing: 0.5
          }}>
            {llmInfo.flag} {lang === 'zh' ? llmInfo.labelZh : llmInfo.label}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder={t.placeholder}
              style={{
                flex: 1, padding: '12px 16px', borderRadius: 24,
                border: `1.5px solid ${input ? colors.accent : '#E5E7EB'}`,
                fontSize: 14, outline: 'none', fontFamily: 'inherit',
                transition: 'border-color 0.15s'
              }}
            />
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{
              width: 46, height: 46, borderRadius: '50%', border: 'none',
              background: loading || !input.trim()
                ? '#E5E7EB'
                : `linear-gradient(135deg,${colors.bg},${colors.accent})`,
              color: 'white', fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
