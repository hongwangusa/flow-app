'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { XP_BY_DIFFICULTY, applyXP, calcStreak } from '@/lib/xp'

export async function addTask(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const title = (formData.get('title') as string)?.trim()
  const difficulty = (formData.get('difficulty') as string) || 'medium'
  const category = (formData.get('category') as string) || 'general'
  if (!title) return

  const xp_reward = XP_BY_DIFFICULTY[difficulty] ?? 25

  await supabase.from('tasks').insert({
    user_id: user.id,
    title,
    difficulty,
    xp_reward,
    category,
  })

  revalidatePath('/tasks')
  revalidatePath('/dashboard')
}

export async function completeTask(taskId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: task } = await supabase
    .from('tasks')
    .select('xp_reward, is_completed')
    .eq('id', taskId)
    .eq('user_id', user.id)
    .single()

  if (!task || task.is_completed) return

  await supabase.from('tasks')
    .update({ is_completed: true, completed_at: new Date().toISOString() })
    .eq('id', taskId)
    .eq('user_id', user.id)

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
      task.xp_reward ?? 25
    )
    const today = new Date().toISOString().slice(0, 10)
    const newStreak = calcStreak(profile.streak_current ?? 0, profile.last_active_date)
    const newStreakBest = Math.max(newStreak, profile.streak_best ?? 0)

    await supabase.from('users').update({
      xp_current: xpCurrent,
      xp_total: xpTotal,
      level,
      streak_current: newStreak,
      streak_best: newStreakBest,
      last_active_date: today,
      updated_at: new Date().toISOString(),
    }).eq('id', user.id)

    await supabase.from('xp_log').insert({
      user_id: user.id,
      amount: task.xp_reward,
      source: 'task',
      source_id: taskId,
    })
  }

  revalidatePath('/tasks')
  revalidatePath('/dashboard')
}

export async function deleteTask(taskId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('tasks')
    .delete()
    .eq('id', taskId)
    .eq('user_id', user.id)

  revalidatePath('/tasks')
}
