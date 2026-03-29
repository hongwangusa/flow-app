'use client'

import { useState, useRef, useEffect } from 'react'
import { askCoach, updatePersonality } from './actions'

interface Task { title: string; difficulty: string; is_completed: boolean }
interface Profile {
  name: string; level: number; xp_current: number; xp_total: number;
  streak_current: number; streak_best: number;
  coach_personality: string | null; lang_preference: string | null
}

interface Message { role: 'user' | 'coach'; text: string; ts: number }

const t = {
  en: {
    title: 'AI Coach', subtitle: 'Your personal guide in Flow',
    personalities: { mentor: '🧙 Mentor', cheerleader: '🎉 Cheerleader', analyst: '📊 Analyst' },
    personalityDesc: {
      mentor: 'Wise guidance & reflection',
      cheerleader: 'Energy & celebration!',
      analyst: 'Data-driven insights'
    },
    placeholder: 'Ask your coach anything...',
    send: 'Send', thinking: 'Thinking...',
    prompts: ['How am I doing?', 'Help me focus today', 'What should I work on?', 'Motivate me! 🔥'],
    stats: 'Your Stats', level: 'Level', streak: 'Day Streak', tasks: 'Recent Tasks',
    noApiKey: '⚠️ Add ANTHROPIC_API_KEY to Vercel env vars to activate the coach.',
    welcome: "Hi! I'm your AI coach. Ask me anything about your progress, goals, or how to level up! 🎮"
  },
  zh: {
    title: 'AI教练', subtitle: '你在Flow中的个人向导',
    personalities: { mentor: '🧙 导师', cheerleader: '🎉 啦啦队', analyst: '📊 分析师' },
    personalityDesc: {
      mentor: '智慧引导与反思',
      cheerleader: '能量与庆祝！',
      analyst: '数据驱动洞察'
    },
    placeholder: '问你的教练任何问题...',
    send: '发送', thinking: '思考中...',
    prompts: ['我进展如何？', '帮我今天集中注意力', '我应该做什么？', '激励我！🔥'],
    stats: '你的数据', level: '等级', streak: '天连续', tasks: '最近任务',
    noApiKey: '⚠️ 在Vercel环境变量中添加ANTHROPIC_API_KEY以激活教练。',
    welcome: '嗨！我是你的AI教练。问我任何关于你的进度、目标或如何升级的问题！🎮'
  }
}

export default function CoachClient({ profile, recentTasks }: { profile: Profile | null; recentTasks: Task[] }) {
  const lang = (profile?.lang_preference === 'zh' ? 'zh' : 'en') as 'en' | 'zh'
  const tx = t[lang]
  const [personality, setPersonalityState] = useState<'mentor' | 'cheerleader' | 'analyst'>(
    (profile?.coach_personality as 'mentor' | 'cheerleader' | 'analyst') || 'mentor'
  )
  const [messages, setMessages] = useState<Message[]>([
    { role: 'coach', text: tx.welcome, ts: Date.now() }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const handlePersonality = async (p: 'mentor' | 'cheerleader' | 'analyst') => {
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
      recentTasks,
      userMessage: msg
    })
    setLoading(false)
    if (error) {
      setMessages(prev => [...prev, { role: 'coach', text: `❌ ${error}`, ts: Date.now() }])
    } else {
      setMessages(prev => [...prev, { role: 'coach', text: reply, ts: Date.now() }])
    }
  }

  const PERSONALITY_COLORS = {
    mentor: { bg: '#1B3A5C', accent: '#2196F3' },
    cheerleader: { bg: '#7B2D8B', accent: '#E91E63' },
    analyst: { bg: '#1B5C3A', accent: '#4CAF50' }
  }
  const colors = PERSONALITY_COLORS[personality]

  return (
    <div style={{ minHeight:'100vh', background:'#F0F4F8', fontFamily:'system-ui,sans-serif' }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${colors.bg},${colors.accent})`, padding:'20px 20px 16px', color:'white' }}>
        <div style={{ maxWidth:600, margin:'0 auto' }}>
          <div style={{ fontSize:11, opacity:0.7, letterSpacing:2, textTransform:'uppercase', marginBottom:4 }}>
            FLOW / 流动
          </div>
          <div style={{ fontSize:22, fontWeight:800 }}>{tx.title}</div>
          <div style={{ fontSize:13, opacity:0.8 }}>{tx.subtitle}</div>

          {/* Personality selector */}
          <div style={{ display:'flex', gap:8, marginTop:14 }}>
            {(['mentor','cheerleader','analyst'] as const).map(p => (
              <button key={p} onClick={() => handlePersonality(p)}
                style={{
                  padding:'6px 12px', borderRadius:20, border:'none', cursor:'pointer',
                  fontSize:12, fontWeight:700, transition:'all 0.2s',
                  background: personality === p ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
                  color: personality === p ? colors.bg : 'white'
                }}>
                {tx.personalities[p]}
              </button>
            ))}
          </div>
          <div style={{ fontSize:11, opacity:0.7, marginTop:6 }}>{tx.personalityDesc[personality]}</div>
        </div>
      </div>

      <div style={{ maxWidth:600, margin:'0 auto', padding:'16px 16px 100px' }}>
        {/* Stats bar */}
        <div style={{ display:'flex', gap:10, marginBottom:16 }}>
          {[
            { label: tx.level, value: profile?.level || 1, emoji: '⭐' },
            { label: tx.streak, value: profile?.streak_current || 0, emoji: '🔥' },
            { label: tx.tasks, value: recentTasks.filter(t => t.is_completed).length, emoji: '✅' }
          ].map(s => (
            <div key={s.label} style={{
              flex:1, background:'white', borderRadius:12, padding:'10px 8px',
              textAlign:'center', boxShadow:'0 1px 4px rgba(0,0,0,0.06)'
            }}>
              <div style={{ fontSize:18 }}>{s.emoji}</div>
              <div style={{ fontSize:18, fontWeight:800, color:'#0D1B2A' }}>{s.value}</div>
              <div style={{ fontSize:10, color:'#9CA3AF', textTransform:'uppercase', letterSpacing:1 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Chat messages */}
        <div style={{
          background:'white', borderRadius:16, padding:'16px', marginBottom:12,
          boxShadow:'0 2px 8px rgba(0,0,0,0.06)', minHeight:300, maxHeight:400, overflowY:'auto'
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display:'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom:12
            }}>
              {msg.role === 'coach' && (
                <div style={{
                  width:32, height:32, borderRadius:'50%', flexShrink:0,
                  background:`linear-gradient(135deg,${colors.bg},${colors.accent})`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:16, marginRight:8, marginTop:2
                }}>
                  {personality === 'mentor' ? '🧙' : personality === 'cheerleader' ? '🎉' : '📊'}
                </div>
              )}
              <div style={{
                maxWidth:'75%', padding:'10px 14px', borderRadius:
                  msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.role === 'user'
                  ? `linear-gradient(135deg,${colors.bg},${colors.accent})`
                  : '#F8FAFC',
                color: msg.role === 'user' ? 'white' : '#0D1B2A',
                fontSize: 14, lineHeight: 1.5,
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{
                width:32, height:32, borderRadius:'50%',
                background:`linear-gradient(135deg,${colors.bg},${colors.accent})`,
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:16
              }}>
                {personality === 'mentor' ? '🧙' : personality === 'cheerleader' ? '🎉' : '📊'}
              </div>
              <div style={{ background:'#F8FAFC', padding:'10px 14px', borderRadius:'18px 18px 18px 4px', fontSize:13, color:'#9CA3AF' }}>
                {tx.thinking}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts */}
        <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:12 }}>
          {tx.prompts.map(p => (
            <button key={p} onClick={() => sendMessage(p)}
              style={{
                padding:'6px 12px', borderRadius:20, border:`1px solid ${colors.accent}`,
                background:'white', color: colors.accent, fontSize:12, fontWeight:600,
                cursor:'pointer'
              }}>
              {p}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{ position:'fixed', bottom:0, left:0, right:0, background:'white', padding:'12px 16px', boxShadow:'0 -2px 10px rgba(0,0,0,0.08)' }}>
          <div style={{ maxWidth:600, margin:'0 auto', display:'flex', gap:8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder={tx.placeholder}
              style={{
                flex:1, padding:'12px 16px', borderRadius:24,
                border:'1.5px solid #E5E7EB', fontSize:14, outline:'none',
                fontFamily:'inherit'
              }}
            />
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
              style={{
                width:48, height:48, borderRadius:'50%', border:'none',
                background: loading || !input.trim() ? '#E5E7EB' : `linear-gradient(135deg,${colors.bg},${colors.accent})`,
                color:'white', fontSize:18, cursor: loading ? 'not-allowed' : 'pointer',
                display:'flex', alignItems:'center', justifyContent:'center'
              }}>
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
