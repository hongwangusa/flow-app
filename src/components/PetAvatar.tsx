'use client'

// Evolving Pet Avatar based on Level
const evolutionTiers = [
  { min: 1, max: 4, emoji: '🥚', name: 'Egg / 蛋' },
  { min: 5, max: 9, emoji: '🐣', name: 'Chick / 小鸡' },
  { min: 10, max: 19, emoji: '🐥', name: 'Fledgling / 雏鸟' },
  { min: 20, max: 34, emoji: '🐦', name: 'Bird / 小鸟' },
  { min: 35, max: 49, emoji: '🦅', name: 'Eagle / 雄鹰' },
  { min: 50, max: 74, emoji: '🕊️', name: 'Phoenix / 凤凰' },
  { min: 75, max: 99, emoji: '🐉', name: 'Dragon / 巨龙' },
  { min: 100, max: 999, emoji: '👑', name: 'Immortal / 仙' },
]

export default function PetAvatar({ level }: { level: number }) {
  const tier = evolutionTiers.find(t => level >= t.min && level <= t.max) || evolutionTiers[0]

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      background: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.4)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)', minWidth: 80
    }}>
      <div style={{ fontSize: 36, animation: 'float 3s ease-in-out infinite' }}>{tier.emoji}</div>
      <div style={{ fontSize: 10, fontWeight: 800, color: '#1B8A8F', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {tier.name}
      </div>
      <style>{`@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }`}</style>
    </div>
  )
}
