'use client'
import Image from 'next/image'

export default function GameBackground() {
  return (
    <div style={{position:'fixed', inset:0, zIndex:-1, overflow:'hidden', backgroundColor: '#0D1B2A'}}>
      {/* High-Res Zelda Background Image */}
      <Image 
        src="/zelda-bg.png"
        alt="Zelda Background"
        fill
        style={{ objectFit: 'cover', objectPosition: 'center', opacity: 0.85 }}
        priority
      />

      {/* Watermark Tag - Removable later */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        background: 'linear-gradient(135deg, #2A8C38, #1A5C2A)', // Zelda Green
        color: '#FFE566', // Zelda Gold
        padding: '6px 14px',
        borderRadius: '12px',
        fontSize: '13px',
        fontWeight: 'bold',
        letterSpacing: '0.5px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,229,102,0.4)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        ✨ Built by Antigravity (Gemini)
      </div>
    </div>
  )
}
