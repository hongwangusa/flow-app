'use client'

import { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import GameBackground from '@/components/GameBackground'
import HypeOverlay from '@/components/HypeOverlay'
import { launchConfetti } from '@/lib/confetti'
import { addHabitAction, completeHabitAction } from './actions'

interface Habit {
  id: string
  name: string
  zh: string
  streak: number
  done: boolean
  emoji: string
  quest_type?: 'daily' | 'epic'
  pledge_amount?: number
  pledge_target_days?: number
}

export default function HabitsClient({ initialHabits, lang = 'en' }: { initialHabits: Habit[]; lang?: string }) {
  const [isZh, setLang] = useState(lang === 'zh')
  const [habits, setHabits] = useState(initialHabits)
  const [toast, setToast] = useState<string | null>(null)
  const [hype, setHype] = useState<{ msg: string; sub?: string; type: 'level-up' | 'epic' | 'pledge' } | null>(null)
  const [activeTab, setActiveTab] = useState<'daily' | 'epic'>('daily')
  const [isPending, startTransition] = useTransition()

  const filteredHabits = useMemo(() => habits.filter((habit) => (habit.quest_type || 'daily') === activeTab), [habits, activeTab])

  const text = {
    title: isZh ? { daily: '每日习惯', epic: '史诗任务' } : { daily: 'Daily Habits', epic: 'Epic Quests' },
    empty: isZh ? '这个分类还没有任务，来加一个吧。' : `No ${activeTab} quests yet. Add one.`,
    input: isZh ? '输入新的任务...' : 'Add a new mission...',
    days: isZh ? '天' : 'days',
    add: isZh ? '创建' : 'Create',
    back: isZh ? '返回仪表盘' : 'Back to Dashboard',
  }

  const completeHabit = (habitId: string) => {
    const currentHabit = habits.find((habit) => habit.id === habitId)
    if (!currentHabit || currentHabit.done || isPending) return

    startTransition(async () => {
      const result = await completeHabitAction(habitId)
      if (!result?.success) return

      setHabits((prev) => prev.map((habit) => (habit.id === habitId ? { ...habit, done: true, streak: habit.streak + 1 } : habit)))

      if (result.levelUp) {
        launchConfetti()
        setHype({ msg: isZh ? '升级了！' : 'LEVEL UP!', sub: isZh ? '你的坚持开始滚雪球了。' : 'Your consistency is paying off.', type: 'level-up' })
        return
      }

      if (result.isEpic) {
        setHype({ msg: isZh ? '史诗胜利！' : 'EPIC VICTORY!', sub: isZh ? '这次完成拿到了额外金币。' : 'That completion paid out extra gold.', type: 'epic' })
        return
      }

      setToast(`+${result.xpGained} XP`)
      setTimeout(() => setToast(null), 1800)
    })
  }

  const handleAddSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    formData.append('quest_type', activeTab)

    const rawTitle = String(formData.get('title') || '').trim()
    const pledgeAmount = Number(formData.get('pledge') || 0)
    const targetDays = Number(formData.get('target_days') || 0)
    if (!rawTitle) return

    startTransition(async () => {
      const result = await addHabitAction(formData)
      if (!result?.success) return

      setHabits((prev) => [
        {
          id: `local-${Date.now()}`,
          name: rawTitle,
          zh: rawTitle,
          streak: 0,
          done: false,
          emoji: activeTab === 'epic' ? '⚔️' : '⭐',
          quest_type: activeTab,
          pledge_amount: pledgeAmount,
          pledge_target_days: targetDays,
        },
        ...prev,
      ])

      event.currentTarget.reset()

      if (pledgeAmount > 0) {
        setHype({ msg: isZh ? '押注已创建' : 'PLEDGE CREATED', sub: isZh ? `目标 ${targetDays} 天，押注 ${pledgeAmount}g` : `${pledgeAmount}g committed for ${targetDays} days`, type: 'pledge' })
      }
    })
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <GameBackground />

      <button onClick={() => setLang(!isZh)} style={{ position: 'fixed', top: 18, right: 18, zIndex: 20, background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: 20, padding: '5px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', color: '#0D1B2A' }}>
        {isZh ? 'EN' : '中文'}
      </button>

      {toast && <div style={{ position: 'fixed', top: 40, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#F5C842,#E8A020)', color: '#1A1200', padding: '12px 24px', borderRadius: 24, fontSize: 18, fontWeight: 800, boxShadow: '0 8px 32px rgba(232,160,32,0.4)', zIndex: 100 }}>{toast}</div>}
      {hype && <HypeOverlay message={hype.msg} subtext={hype.sub} type={hype.type} onComplete={() => setHype(null)} />}

      <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 24, padding: '28px 24px 24px', maxWidth: 560, width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.22)', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
          <h1 style={{ margin: 0, fontSize: 28, color: '#0D1B2A', fontWeight: 800 }}>{activeTab === 'daily' ? text.title.daily : text.title.epic}</h1>
          <div style={{ display: 'flex', gap: 8, background: '#F1F5F9', padding: 4, borderRadius: 12 }}>
            <button onClick={() => setActiveTab('daily')} style={{ flex: 1, padding: '8px 14px', borderRadius: 8, border: 'none', background: activeTab === 'daily' ? '#fff' : 'transparent', color: activeTab === 'daily' ? '#1B8A8F' : '#64748B', fontWeight: 700, cursor: 'pointer' }}>{isZh ? '每日' : 'Daily'}</button>
            <button onClick={() => setActiveTab('epic')} style={{ flex: 1, padding: '8px 14px', borderRadius: 8, border: 'none', background: activeTab === 'epic' ? '#fff' : 'transparent', color: activeTab === 'epic' ? '#E8644B' : '#64748B', fontWeight: 700, cursor: 'pointer' }}>{isZh ? '史诗' : 'Epic'}</button>
          </div>
        </div>

        <form onSubmit={handleAddSubmit} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) repeat(3, minmax(0, 1fr))', gap: 10, marginBottom: 28, background: 'rgba(27, 138, 143, 0.05)', padding: 16, borderRadius: 16, border: '1px solid #E2E8F0' }}>
          <input name="title" placeholder={text.input} style={{ minWidth: 0, padding: 12, borderRadius: 12, border: '1px solid #CBD5E1', fontSize: 14 }} required />
          <input name="pledge" type="number" defaultValue="0" step="5" min="0" style={{ minWidth: 0, padding: 12, borderRadius: 12, border: '1px solid #CBD5E1', fontSize: 14 }} />
          <select name="target_days" defaultValue="7" style={{ minWidth: 0, padding: 12, borderRadius: 12, border: '1px solid #CBD5E1', fontSize: 14 }}>
            <option value="7">7 {text.days}</option>
            <option value="14">14 {text.days}</option>
            <option value="30">30 {text.days}</option>
          </select>
          <button type="submit" disabled={isPending} style={{ border: 'none', borderRadius: 12, padding: '10px 16px', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', background: activeTab === 'daily' ? 'linear-gradient(135deg,#1B8A8F,#2ABFBF)' : 'linear-gradient(135deg,#E8644B,#F08E80)' }}>{text.add}</button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
          {filteredHabits.length === 0 && <div style={{ textAlign: 'center', padding: '24px 0', color: '#94A3B8', fontSize: 14, fontStyle: 'italic' }}>{text.empty}</div>}

          {filteredHabits.map((habit) => (
            <div key={habit.id} style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, transition: 'all 0.2s', opacity: habit.done ? 0.72 : 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
                <div style={{ fontSize: 28 }}>{habit.emoji}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: habit.done ? '#94A3B8' : '#0D1B2A', textDecoration: habit.done ? 'line-through' : 'none', marginBottom: 4 }}>{isZh ? habit.zh : habit.name}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ fontSize: 12, color: '#E8644B', fontWeight: 600 }}>🔥 {habit.streak} {text.days}</div>
                    {(habit.pledge_amount || 0) > 0 && <div style={{ fontSize: 10, background: '#F5C842', color: '#1A1200', padding: '2px 6px', borderRadius: 6, fontWeight: 800 }}>{isZh ? '押注' : 'PLEDGE'} {habit.pledge_amount}g / {habit.pledge_target_days}{isZh ? '天' : 'd'}</div>}
                  </div>
                </div>
              </div>

              <button onClick={() => completeHabit(habit.id)} disabled={habit.done || isPending} style={{ width: 52, height: 52, borderRadius: 26, border: habit.done ? 'none' : '2px solid #E2E8F0', background: habit.done ? '#F1F5F9' : '#fff', color: habit.done ? '#64748B' : '#1B8A8F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, cursor: habit.done ? 'default' : 'pointer', flexShrink: 0 }}>
                {habit.done ? '✓' : isZh ? '做' : 'Go'}
              </button>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/dashboard" style={{ color: '#94A3B8', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>{text.back}</Link>
        </div>
      </div>
    </div>
  )
}
