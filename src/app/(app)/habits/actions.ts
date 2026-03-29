'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { applyXP, calcStreak } from '@/lib/xp'

export async function addHabit(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const title = (formData.get('title') as string)?.trim()
  if (!title) return

  await supabase.from('habits').insert({
    user_id: user.id,
    title,
    xp_reward: 15,
    streak_count: 0,
  })

  revalidatePath('/habits')
}

export async function completeHabit(habitId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const today = new Date().toISOString().slice(0, 10)

  const { data: habit } = await supabase
    .from('habits')
    .select('xp_reward, streak_count, last_completed_date')
    .eq('id', habitId)
    .eq('user_id', user.id)
    .single()

  if (!habit) return
  if (habit.last_completed_date === today) return // already done today

  // Calc new streak
  const newStreak = calcStreak(habit.streak_count ?? 0, habit.last_completed_date)

  await supabase.from('habits')
    .update({ streak_count: newStreak, last_completed_date: today })
    .eq('id', habitId)
    .eq('user_id', user.id)

  // Award XP to user
  const { data: profile } = await supabase
    .from('users')
    .select('level, xp_current, xp_total, streak_current, streak_best, last_active_date')
    .eq('id', user.id)
    .single()

  if (profile) {
    const { xpCurrent, xpTotal, level } = applyXP(
      profile.xp_current ?? 0,
      profile.xp_total ?? 0,
      profile.level ?? 1,
      habit.xp_reward ?? 15
    )
    const userStreak = calcStreak(profile.streak_current ?? 0, profile.last_active_date)
    const streakBest = Math.max(userStreak, profile.streak_best ?? 0)

    await supabase.from('users').update({
      xp_current: xpCurrent,
      xp_total: xpTotal,
      level,
      streak_current: userStreak,
      streak_best: streakBest,
      last_active_date: today,
      updated_at: new Date().toISOString(),
    }).eq('id', user.id)

    await supabase.from('xp_log').insert({
      user_id: user.id,
      amount: habit.xp_reward,
      source: 'habit',
      source_id: habitId,
    })
  }

  revalidatePath('/habits')
  revalidatePath('/dashboard')
}

export async function deleteHabit(habitId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('habits')
    .update({ is_active: false })
    .eq('id', habitId)
    .eq('user_id', user.id)

  revalidatePath('/habits')
}
