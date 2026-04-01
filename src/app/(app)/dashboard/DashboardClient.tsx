'use client'

import { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import GameBackground from '@/components/GameBackground'
import ModelSelector from './ModelSelector'
import StreakBadge from '@/components/StreakBadge'
import PetAvatar from '@/components/PetAvatar'
import { signOut } from './actions'
import { launchConfetti } from '@/lib/confetti'
import { totalXpForDisplay, xpForLevel } from '@/lib/xp'

interface PendingTask {
  id: string
  title: string
  difficulty: string
}

interface Props {
  email?: string
  userName: string
  level: number
  xpCurrent: number
  xpTotal?: number
  streakCurrent: number
  tasksDone?: number
  tasksPending?: number
  lang?: 'en' | 'zh'
  inventoryGold?: number
  recentPendingTasks?: PendingTask[]
}

const difficultyLabel: Record<string, { en: string; zh: string; color: string; bg: string }> = {
  easy: { en: 'Easy', zh: '简单', color: '#1B8A8F', bg: '#F0FAFB' },
  medium: { en: 'Medium', zh: '中等', color: '#C9A84C', bg: '#FFFBF0' },
  hard: { en: 'Hard', zh: '困难', color: '#E8644B', bg: '#FFF5F3' },
}

export default function DashboardClient({
  userName,
  level,
  xpCurrent,
  xpTotal = 0,
  streakCurrent,
  tasksDone = 0,
  tasksPending = 0,
  lang = 'en',
  inventoryGold = 0,
  recentPendingTasks = [],
}: Props) {
  const [isZh, setLang] = useState(lang === 'zh')
  const [isPending, startTransition] = useTransition()
  const xpNeeded = xpForLevel(level)
  const totalXp = Math.max(xpTotal, totalXpForDisplay(level, xpCurrent))

  useEffect(() => {
    if (xpCurrent > 0 && xpCurrent >= xpNeeded) {
      launchConfetti()
    }
  }, [xpCurrent, xpNeeded])

  const getPokemonEmoji = (currentLevel: number) => {
    if (currentLevel <= 5) return '🐣'
    if (currentLevel <= 15) return '⚡'
    if (currentLevel <= 30) return '🦊'
    if (currentLevel <= 50) return '🐉'
    if (currentLevel <= 75) return '🪽'
    return '✨'
  }

  const handleSignOut = () => {
    startTransition(async () => await signOut())
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <GameBackground />

      <button
        onClick={() => setLang(!isZh)}
        style={{
          position: 'fixed',
          top: 18,
          right: 18,
          zIndex: 20,
          background: 'rgba(255,255,255,0.85)',
          border: '1px solid rgba(255,255,255,0.6)',
          borderRadius: 20,
          padding: '5px 14px',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          color: '#0D1B2A',
        }}
      >
        {isZh ? 'EN' : '中文'}
      </button>

      <div style={{ maxWidth: 440, width: '100%', zIndex: 10 }}>
        <ModelSelector />
      </div>

      <div
        style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 24,
          padding: '36px 32px 28px',
          maxWidth: 440,
          width: '100%',
          boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
          <Link
            href="/profile"
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              background: '#1B8A8F',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              fontWeight: 'bold',
              marginRight: 16,
              textDecoration: 'none',
            }}
          >
            {getPokemonEmoji(level)}
          </Link>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, color: '#0D1B2A' }}>
              {isZh ? `早上好，${userName}！` : `Good morning, ${userName}!`}
            </h1>
            <div style={{ background: '#F8FAFC', padding: '2px 8px', borderRadius: 12, display: 'inline-block', fontSize: 13, color: '#1B8A8F', marginTop: 4, fontWeight: 600 }}>
              {isZh ? '等级' : 'Level'} {level}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#64748B', marginBottom: 8, fontWeight: 600 }}>
              <span>{isZh ? '经验进度' : 'XP Progress'}</span>
              <span>{xpCurrent} / {xpNeeded} XP</span>
            </div>
            <div style={{ height: 12, background: '#F8FAFC', borderRadius: 6, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
              <div style={{ height: '100%', width: `${Math.min(100, (xpCurrent / Math.max(1, xpNeeded)) * 100)}%`, background: 'linear-gradient(90deg, #1B8A8F, #2ABFBF)', borderRadius: 6 }} />
            </div>
          </div>
          <PetAvatar level={level} />
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: '12px 0', textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#1B8A8F' }}>{tasksDone}</div>
            <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>{isZh ? '已完成' : 'Done'}</div>
          </div>
          <StreakBadge streak={streakCurrent} />
          <div style={{ flex: 1, background: '#FFFDF5', border: '1px solid #F5E6B3', borderRadius: 12, padding: '12px 0', textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#C9A84C' }}>{inventoryGold}g</div>
            <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>{isZh ? '金币' : 'Gold'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>
            {isZh ? `待办 ${tasksPending}` : `${tasksPending} pending`}
          </div>
          <div style={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>
            {isZh ? `累计 XP ${totalXp}` : `${totalXp} total XP`}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <Link href="/dashboard/plan" style={{ flex: 1, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: '10px 0', textAlign: 'center', textDecoration: 'none', color: '#1B8A8F', fontWeight: 700 }}>
            {isZh ? '路线图' : 'Plan'}
          </Link>
          <Link href="/leaderboard" style={{ flex: 1, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: '10px 0', textAlign: 'center', textDecoration: 'none', color: '#C9A84C', fontWeight: 700 }}>
            {isZh ? '排行榜' : 'Hall'}
          </Link>
          <Link href="/habits" style={{ flex: 1, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: '10px 0', textAlign: 'center', textDecoration: 'none', color: '#E8644B', fontWeight: 700 }}>
            {isZh ? '习惯' : 'Habits'}
          </Link>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, color: '#0D1B2A', margin: 0 }}>
            {isZh ? '我的任务' : 'My Quests'}
          </h3>
          <Link href="/tasks" style={{ color: '#1B8A8F', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            {isZh ? '查看全部 >' : 'View All >'}
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
          {recentPendingTasks.length === 0 ? (
            <div style={{ border: '2px dashed #E2E8F0', borderRadius: 12, padding: 16, textAlign: 'center', color: '#94A3B8', fontSize: 14, fontWeight: 500 }}>
              {isZh ? '暂时没有待办任务。' : 'No pending quests right now.'}
            </div>
          ) : (
            recentPendingTasks.map((task) => {
              const difficulty = difficultyLabel[task.difficulty] ?? difficultyLabel.medium
              return (
                <Link
                  key={task.id}
                  href="/tasks"
                  style={{ border: '1px solid #E2E8F0', borderRadius: 12, padding: 16, textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0D1B2A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {task.title}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
                      {isZh ? '继续推进' : 'Keep the streak alive'}
                    </div>
                  </div>
                  <span style={{ padding: '4px 8px', borderRadius: 999, background: difficulty.bg, color: difficulty.color, fontSize: 12, fontWeight: 700 }}>
                    {isZh ? difficulty.zh : difficulty.en}
                  </span>
                </Link>
              )
            })
          )}
        </div>

        <button
          onClick={handleSignOut}
          disabled={isPending}
          style={{ width: '100%', background: 'white', border: '1.5px solid #1B8A8F', color: '#1B8A8F', borderRadius: 14, padding: 14, fontSize: 16, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
        >
          {isZh ? '退出登录' : 'Sign Out'}
        </button>
      </div>
    </div>
  )
}
