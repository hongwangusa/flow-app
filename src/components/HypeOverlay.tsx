'use client'
import { useState, useEffect } from 'react'

interface HypeProps {
  message: string
  subtext?: string
  type?: 'level-up' | 'epic' | 'pledge'
  onComplete: () => void
}

export default function HypeOverlay({ message, subtext, type = 'epic', onComplete }: HypeProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onComplete, 500) // Delay to let fade-out finish
    }, 3500)
    return () => clearTimeout(timer)
  }, [onComplete])

  if (!visible) return null

  const colors = {
    'level-up': 'linear-gradient(135deg, #FFD700, #FFA500)',
    'epic': 'linear-gradient(135deg, #E8644B, #FF8A75)',
    'pledge': 'linear-gradient(135deg, #1B8A8F, #2ABFBF)'
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(13, 27, 42, 0.8)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
      animation: 'fadeIn 0.5s ease-out forwards'
    }}>
      <div style={{
        background: colors[type], color: 'white', padding: '40px 60px', borderRadius: 32,
        textAlign: 'center', boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        animation: 'zoomIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
      }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>
          {type === 'level-up' ? '🎖️' : (type === 'epic' ? '⚔️' : '🛡️')}
        </div>
        <h1 style={{ fontSize: 42, fontWeight: 900, margin: 0, textTransform: 'uppercase', letterSpacing: 2 }}>
          {message}
        </h1>
        {subtext && <p style={{ fontSize: 20, opacity: 0.9, marginTop: 12, fontWeight: 600 }}>{subtext}</p>}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes zoomIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  )
}
