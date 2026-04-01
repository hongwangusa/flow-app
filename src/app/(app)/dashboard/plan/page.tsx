'use client'
import { useState } from 'react'
import Link from 'next/link'

type Step = {
  day: number
  title: string
  completed: boolean
}

const steps: Step[] = [
  { day: 1, title: 'Auth UI & Next.js Scaffold', completed: true },
  { day: 5, title: 'Supabase DB Migration', completed: true },
  { day: 7, title: 'Core Loop MVP & XP Logic', completed: true },
  { day: 8, title: 'AI Coach Integration (DeepSeek/GLM)', completed: true },
  { day: 9, title: 'Streak Animations & Confetti', completed: true },
  { day: 10, title: 'Mobile Polish & Plan Dashboard', completed: true },
  { day: 11, title: 'Quests System 2.0 (Epic vs Daily)', completed: false },
  { day: 12, title: 'Loot & Virtual Economy (Gold)', completed: false },
  { day: 13, title: 'Pet / Avatar Evolution', completed: false },
  { day: 14, title: 'Global Leaderboard', completed: false },
]

export default function PlanOverview() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', background: '#0D1B2A', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ color: '#C9A84C', textAlign: 'center', fontWeight: 800, fontSize: 32, marginBottom: '2rem' }}>Flow App 🌊<br/><span style={{fontSize: 20, color: '#94A3B8'}}>Phase 1 & 2 Roadmap</span></h1>
      
      <div style={{ maxWidth: 600, margin: '0 auto', background: 'rgba(255,255,255,0.05)', borderRadius: 24, padding: '32px 24px', border: '1px solid rgba(255,255,255,0.1)' }}>
        {steps.map(step => (
          <div
            key={step.day}
            style={{ display: 'flex', alignItems: 'center', marginBottom: '1.2rem', cursor: 'pointer', padding: '12px', borderRadius: 12, background: open === step.day ? 'rgba(255,255,255,0.1)' : 'transparent', transition: 'all 0.2s' }}
            onClick={() => setOpen(open === step.day ? null : step.day)}
          >
            <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: step.completed ? '#1B8A8F' : 'rgba(255,255,255,0.1)',
                border: step.completed ? 'none' : '1px solid #94A3B8',
                color: step.completed ? 'white' : '#94A3B8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginRight: 16, fontWeight: 700, fontSize: 14
              }}>
              {step.day}
            </div>
            
            <div style={{ flex: 1, color: step.completed ? 'white' : '#94A3B8', fontSize: 16, fontWeight: 500, textDecoration: step.completed ? 'line-through' : 'none', opacity: step.completed ? 0.7 : 1 }}>
              {step.title}
            </div>
            
            <div style={{ color: step.completed ? '#1B8A8F' : '#E8644B', fontSize: 18 }}>
              {step.completed ? '✅' : '🚧'}
            </div>
          </div>
        ))}

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <Link href="/dashboard" style={{ color: '#1B8A8F', fontSize: '1.1rem', fontWeight: 600, textDecoration: 'none', background: 'white', padding: '12px 24px', borderRadius: 12 }}>
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
