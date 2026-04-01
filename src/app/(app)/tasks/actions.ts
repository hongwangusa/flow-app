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

import { autoTriggerCoachMessage } from '../coach/actions'

export async function completeTask(taskId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: task } = await supabase
    .from('tasks')
    .select('title, xp_reward, is_completed')
    .eq('id', taskId)
    .single()

  if (!task || task.is_completed) return

  await supabase.from('tasks')
    .update({ is_completed: true, completed_at: new Date().toISOString() })
    .eq('id', taskId)

  const { data: profile } = await supabase
    .from('users')
    .select('level, xp_current, xp_total, streak_current, streak_best, last_active_date')
    .eq('id', user.id)
    .single()

  if (profile) {
    const { xpCurrent, xpTotal, level, leveledUp } = applyXP(
      profile.xp_current ?? 0,
      profile.xp_total ?? 0,
      profile.level ?? 1,
      task.xp_reward ?? 25
    )
    const today = new Date().toISOString().slice(0, 10)
    const newStreak = calcStreak(profile.streak_current ?? 0, profile.last_active_date)
    
    await supabase.from('users').update({
      xp_current: xpCurrent, xp_total: xpTotal, level,
      streak_current: newStreak, last_active_date: today
    }).eq('id', user.id)

    // Log XP
    await supabase.from('xp_log').insert({
      user_id: user.id, amount: task.xp_reward, source: 'task', source_id: taskId
    })

    // Get Coach Feedback
    const coachMsg = await autoTriggerCoachMessage(user.id, 'task_complete', { title: task.title })

    revalidatePath('/tasks')
    revalidatePath('/dashboard')
    return { leveledUp, newLevel: level, coachMsg }
  }

  revalidatePath('/tasks')
  return { success: true }
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
