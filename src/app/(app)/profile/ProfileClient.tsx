'use client'

import { useState } from 'react'
import Link from 'next/link'
import GameBackground from '@/components/GameBackground'
import HabitHeatmap from '@/components/HabitHeatmap'
import { totalXpForDisplay, xpForLevel } from '@/lib/xp'

const LEVEL_TITLES = [
  { min: 1, max: 5, en: 'Pichu', zh: '皮丘', emoji: '🐣' },
  { min: 6, max: 15, en: 'Pikachu', zh: '皮卡丘', emoji: '⚡' },
  { min: 16, max: 30, en: 'Raichu', zh: '雷丘', emoji: '🦊' },
  { min: 31, max: 50, en: 'Suicune', zh: '水君', emoji: '🐉' },
  { min: 51, max: 75, en: 'Lugia', zh: '洛奇亚', emoji: '🪽' },
  { min: 76, max: 99, en: 'Arceus', zh: '阿尔宙斯', emoji: '✨' },
]

function getLevelTitle(level: number) {
  return LEVEL_TITLES.find((title) => level >= title.min && level <= title.max) || LEVEL_TITLES[0]
}

interface ProfileClientProps {
  name: string
  level: number
  xpCurrent: number
  xpTotal: number
  streak: number
  tasksCompleted: number
  langPref: 'en' | 'zh'
  coachPersonality: 'mentor' | 'cheerleader' | 'analyst'
  heatmapData: Array<{ date: string; count: number }>
}

export default function ProfileClient({ name, level, xpCurrent, xpTotal, streak, tasksCompleted, langPref, coachPersonality, heatmapData }: ProfileClientProps) {
  const [isZh, setLang] = useState(langPref === 'zh')
  const [personality, setPersonality] = useState<'mentor' | 'cheerleader' | 'analyst'>(coachPersonality || 'mentor')
  const [isSaving, setIsSaving] = useState(false)

  const title = getLevelTitle(level)
  const xpNeeded = xpForLevel(level)
  const totalXp = Math.max(xpTotal, totalXpForDisplay(level, xpCurrent))

  const handleSavePersonality = async (nextPersonality: 'mentor' | 'cheerleader' | 'analyst') => {
    setPersonality(nextPersonality)
    setIsSaving(true)
    try {
      const { updateProfileAction } = await import('./actions')
      await updateProfileAction({ coach_personality: nextPersonality })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <GameBackground />
      <button onClick={() => setLang(!isZh)} style={{ position: 'fixed', top: 18, right: 18, zIndex: 20, background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: 20, padding: '5px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', color: '#0D1B2A' }}>
        {isZh ? 'EN' : '中文'}
      </button>

      <div style={{ background: 'rgba(255,255,255,0.97)', borderRadius: 24, padding: '36px 32px 28px', maxWidth: 420, width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.22)', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: 40, background: '#1B8A8F', border: '3px solid #C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, marginBottom: 16, boxShadow: '0 8px 24px rgba(27,138,143,0.3)' }}>
          {title.emoji}
        </div>

        <h1 style={{ margin: 0, fontSize: 28, color: '#0D1B2A', fontWeight: 800 }}>{name}</h1>

        <div style={{ background: '#F8FAFC', border: '1.5px solid #1B8A8F', color: '#1B8A8F', padding: '4px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700, margin: '12px 0 24px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, background: '#1B8A8F', borderRadius: 4 }} />
          {isZh ? title.zh : title.en} (Lv.{level})
        </div>

        <div style={{ width: '100%', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#64748B', marginBottom: 8, fontWeight: 600 }}>
            <span>{isZh ? '升级进度' : 'XP to next level'}</span>
            <span>{xpCurrent} / {xpNeeded}</span>
          </div>
          <div style={{ height: 12, background: '#F8FAFC', borderRadius: 6, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
            <div style={{ height: '100%', width: `${Math.min(100, (xpCurrent / Math.max(1, xpNeeded)) * 100)}%`, background: 'linear-gradient(90deg, #1B8A8F, #2ABFBF)', borderRadius: 6 }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%', marginBottom: 32 }}>
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#1B8A8F' }}>{level}</span>
            <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600, marginTop: 4 }}>{isZh ? '等级' : 'Level'}</span>
          </div>
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#1B8A8F' }}>{totalXp}</span>
            <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600, marginTop: 4 }}>{isZh ? '总经验' : 'Total XP'}</span>
          </div>
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#E8644B' }}>{streak}</span>
            <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600, marginTop: 4 }}>{isZh ? '连续天数' : 'Streak'}</span>
          </div>
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#C9A84C' }}>{tasksCompleted}</span>
            <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600, marginTop: 4 }}>{isZh ? '完成任务' : 'Tasks Done'}</span>
          </div>
        </div>

        <div style={{ width: '100%', marginBottom: 32 }}>
          <h3 style={{ fontSize: 14, color: '#64748B', fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{isZh ? '教练性格' : 'Coach Personality'}</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { id: 'mentor' as const, emoji: '🧭', label: isZh ? '导师' : 'Mentor' },
              { id: 'cheerleader' as const, emoji: '📣', label: isZh ? '打气王' : 'Hypeman' },
              { id: 'analyst' as const, emoji: '📊', label: isZh ? '分析师' : 'Analyst' },
            ].map((option) => (
              <button key={option.id} onClick={() => handleSavePersonality(option.id)} disabled={isSaving} style={{ flex: 1, padding: '12px 8px', borderRadius: 12, border: personality === option.id ? '2px solid #1B8A8F' : '1px solid #E2E8F0', background: personality === option.id ? 'rgba(27,138,143,0.05)' : 'white', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 20 }}>{option.emoji}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: personality === option.id ? '#1B8A8F' : '#64748B' }}>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ width: '100%', marginBottom: 32 }}>
          <HabitHeatmap data={heatmapData || []} />
        </div>

        <button style={{ width: '100%', background: 'transparent', border: '2px solid #1B8A8F', color: '#1B8A8F', borderRadius: 14, padding: 14, fontSize: 16, fontWeight: 700, cursor: 'pointer', marginBottom: 16 }}>
          {isZh ? '编辑资料' : 'Edit Profile'}
        </button>

        <Link href="/dashboard" style={{ color: '#94A3B8', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
          {isZh ? '返回仪表盘' : 'Back to Dashboard'}
        </Link>
      </div>
    </div>
  )
}
