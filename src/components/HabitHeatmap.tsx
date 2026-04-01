'use client'

interface DayData {
  date: string
  count: number
}

export default function HabitHeatmap({ data }: { data: DayData[] }) {
  // Generate last 30 days
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    const dateStr = d.toISOString().split('T')[0]
    const found = data.find(x => x.date === dateStr)
    return { date: dateStr, count: found?.count || 0 }
  })

  const getColor = (count: number) => {
    if (count === 0) return '#F1F5F9'
    if (count <= 10) return '#99F6E4'
    if (count <= 30) return '#2DD4BF'
    if (count <= 60) return '#14B8A6'
    return '#0D9488'
  }

  return (
    <div style={{ width: '100%', padding: '16px', background: 'white', borderRadius: 16, border: '1px solid #E2E8F0' }}>
      <h3 style={{ fontSize: 12, fontWeight: 700, color: '#64748B', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        Flow Intensity (Last 30 Days)
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 4 }}>
        {days.map(d => (
          <div 
            key={d.date} 
            title={`${d.date}: ${d.count} XP`}
            style={{ 
              aspectRatio: '1', borderRadius: 2, 
              background: getColor(d.count), 
              transition: 'all 0.2s' 
            }} 
          />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>
        <span>30 Days Ago</span>
        <span>Today</span>
      </div>
    </div>
  )
}
