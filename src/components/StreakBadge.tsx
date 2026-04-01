'use client'
import { useEffect, useState } from 'react'

// Simple badge showing streak count, with pulse when updated
export default function StreakBadge({ streak }: { streak: number }) {
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    // Trigger a brief pulse animation whenever streak changes
    setPulse(true)
    const timer = setTimeout(() => setPulse(false), 800)
    return () => clearTimeout(timer)
  }, [streak])

  return (
    <div
      style={{
        background: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: 12,
        padding: '12px 0',
        textAlign: 'center',
        flex: 1,
        animation: pulse ? 'pulse 0.8s ease-out' : undefined,
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 800, color: '#E8644B' }}>{streak}</div>
      <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>🔥 {streak > 0 ? 'Streak' : 'No Streak'}</div>
    </div>
  )
}

// CSS keyframes (will be injected via a <style jsx>)
export const style = `
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.12); }
  100% { transform: scale(1); }
}
`
