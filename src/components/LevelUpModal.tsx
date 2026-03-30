'use client'

import { useEffect, useState } from 'react'

interface Props {
  level: number
  onClose: () => void
  lang?: 'en' | 'zh'
}

const LEVEL_TITLES = [
  { min:1,  max:5,  en:'Initiate Disciple',     zh:'入门弟子' },
  { min:6,  max:15, en:'Foundation Builder',    zh:'筑基期' },
  { min:16, max:30, en:'Golden Core',            zh:'金丹期' },
  { min:31, max:50, en:'Nascent Soul',           zh:'元婴期' },
  { min:51, max:75, en:'Spirit Transformation',  zh:'化神期' },
  { min:76, max:99, en:'Tribulation Crossing',   zh:'渡劫期' },
]

const PARTICLES = ['⭐','✨','🌟','💫','🎉','🏆','⚡','🔥']

export default function LevelUpModal({ level, onClose, lang = 'en' }: Props) {
  const [visible, setVisible] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; emoji: string; delay: number }>>([])

  const title = LEVEL_TITLES.find(t => level >= t.min && level <= t.max) || LEVEL_TITLES[0]

  useEffect(() => {
    // Trigger entrance
    requestAnimationFrame(() => setVisible(true))
    // Generate particles
    setParticles(Array.from({ length: 16 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      emoji: PARTICLES[Math.floor(Math.random() * PARTICLES.length)],
      delay: Math.random() * 0.8,
    })))
    // Auto-close after 4s
    const t = setTimeout(() => { setVisible(false); setTimeout(onClose, 400) }, 4000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div
      onClick={() => { setVisible(false); setTimeout(onClose, 400) }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
        backdropFilter: 'blur(4px)',
      }}
    >
      {/* Floating particles */}
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`, top: `${p.y}%`,
          fontSize: 20 + Math.random() * 16,
          animation: `floatUp 2s ${p.delay}s ease-out forwards`,
          opacity: 0,
          pointerEvents: 'none',
        }}>
          {p.emoji}
        </div>
      ))}

      {/* Modal */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #0D1B2A, #1B3A5C)',
          borderRadius: 24, padding: '40px 32px', textAlign: 'center',
          maxWidth: 320, width: '90%', color: 'white',
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(20px)',
          transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Glow */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 24,
          background: 'radial-gradient(circle at 50% 0%, rgba(42,191,191,0.3) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ fontSize: 64, marginBottom: 8, lineHeight: 1 }}>⭐</div>

        <div style={{
          fontSize: 12, fontWeight: 700, letterSpacing: 3,
          textTransform: 'uppercase', color: '#2ABFBF', marginBottom: 8,
        }}>
          {lang === 'zh' ? '升级！' : 'LEVEL UP!'}
        </div>

        <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 1, marginBottom: 4 }}>
          {level}
        </div>

        <div style={{ fontSize: 18, fontWeight: 700, color: '#2ABFBF', marginBottom: 20 }}>
          {lang === 'zh' ? title.zh : title.en}
        </div>

        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 28 }}>
          {lang === 'zh'
            ? `你已成长为第 ${level} 级冒险者！继续前进！`
            : `You've grown into a Level ${level} adventurer! Keep going!`}
        </div>

        {/* XP bar teaser */}
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, height: 6, marginBottom: 24 }}>
          <div style={{
            width: '5%', height: '100%', borderRadius: 8,
            background: 'linear-gradient(90deg,#1B8A8F,#2ABFBF)',
            transition: 'width 0.8s 0.5s ease',
          }} />
        </div>

        <button onClick={() => { setVisible(false); setTimeout(onClose, 400) }} style={{
          background: 'linear-gradient(135deg,#1B8A8F,#2ABFBF)',
          border: 'none', borderRadius: 14, padding: '14px 32px',
          color: 'white', fontSize: 15, fontWeight: 800, cursor: 'pointer',
          width: '100%', letterSpacing: 0.5,
        }}>
          {lang === 'zh' ? '继续冒险 →' : 'Continue Adventure →'}
        </button>
      </div>

      <style>{`
        @keyframes floatUp {
          0%  { opacity:0; transform: translateY(0) scale(0.5); }
          20% { opacity:1; }
          100%{ opacity:0; transform: translateY(-120px) scale(1.2) rotate(20deg); }
        }
      `}</style>
    </div>
  )
}
