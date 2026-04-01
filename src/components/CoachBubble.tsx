'use client'
import { useState } from 'react'

export default function CoachBubble() {
  const [open, setOpen] = useState(false)
  const [chat, setChat] = useState('')
  const [pending, setPending] = useState(false)

  const [coachReply, setCoachReply] = useState('"Keep pushing, Trainer! You only need a few more XP to evolve! ⚡"')

  const handleAsk = async () => {
    if (!chat) return
    setPending(true)
    
    try {
      const provider = localStorage.getItem('llmProvider') || 'deepseek'
      const apiKey = localStorage.getItem('llmKey_' + provider) || ''

      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: chat, provider, apiKey })
      })
      
      const data = await res.json()
      setCoachReply(data.response || '⚠️ Oops, something went wrong!')
    } catch (err) {
      setCoachReply('⚠️ Network Error')
    } finally {
      setChat('')
      setPending(false)
    }
  }
  
  return (
    <div style={{position: 'fixed', bottom: 100, right: 20, zIndex: 1000}}>
       {open && (
         <div style={{background: 'rgba(255,255,255,0.95)', border: '2px solid #1B8A8F', borderRadius: 16, padding: 16, width: 280, marginBottom: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.22)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)'}}>
            <p style={{fontSize: 14, color: '#0D1B2A', margin: '0 0 12px 0', fontWeight: 600}}>
              {coachReply}
            </p>
            <div style={{display: 'flex', gap: 8}}>
                <input value={chat} onChange={e => setChat(e.target.value)} placeholder="Ask coach anything..." style={{flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, minWidth: 0, outline: 'none', background: '#F8FAFC'}} />
                <button disabled={pending} onClick={handleAsk} style={{background: '#1B8A8F', color: 'white', border: 'none', borderRadius: 8, padding: '0 12px', fontWeight: 'bold'}}>{pending ? '...' : '→'}</button>
            </div>
         </div>
       )}
       <button onClick={() => setOpen(!open)} style={{width: 56, height: 56, borderRadius: 28, background: 'linear-gradient(135deg, #1B8A8F, #E8A020)', color: 'white', border: 'none', boxShadow: '0 8px 24px rgba(27,138,143,0.4)', fontSize: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', transform: open ? 'scale(0.95)' : 'scale(1)'}}>
         🤖
       </button>
    </div>
  )
}
