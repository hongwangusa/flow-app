'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { applyXP, calcStreak } from '@/lib/xp'

export async function completeHabitAction(habitId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authorized' }
  
  let isLevelUp = false
  const today = new Date().toISOString().split('T')[0]
  
  const { data: habit } = await supabase.from('habits').select('*, quest_type, pledge_amount, pledge_target_days').eq('id', habitId).eq('user_id', user.id).single()
  if (!habit) return { error: 'Habit not found' }
  if (habit.last_completed_date === today) return { error: 'Already completed today' }
  
  // 1. Update Habit streak and date
  await supabase.from('habits').update({ 
    last_completed_date: today,
    streak_count: (habit.streak_count || 0) + 1
  }).eq('id', habitId)
  
  // 2. Add XP Log
  const xpReward = habit.xp_reward || 10
  await supabase.from('xp_log').insert({
    user_id: user.id,
    amount: xpReward,
    source: 'habit_completion',
    source_id: habitId
  })
  
  // 3. Update User XP and Gold
  const { data: profile } = await supabase
    .from('users')
    .select('xp_current, xp_total, level, inventory_gold, streak_current, streak_best, last_active_date')
    .eq('id', user.id)
    .single()
  if (profile) {
    const progression = applyXP(
      profile.xp_current ?? 0,
      profile.xp_total ?? 0,
      profile.level ?? 1,
      xpReward
    )
    const newLevel = progression.level
    // Award gold: 5g for daily, 20g for epic
    let goldReward = habit.quest_type === 'epic' ? 20 : 5
    
    // Check for Pledge Success (2x stake back)
    const habitStreak = (habit.streak_count || 0) + 1
    if (habit.pledge_amount > 0 && habitStreak === habit.pledge_target_days) {
      goldReward += (habit.pledge_amount * 2) 
    }

    const newGold = (profile.inventory_gold || 0) + goldReward
    const newStreak = calcStreak(profile.streak_current ?? 0, profile.last_active_date)
    const bestStreak = Math.max(profile.streak_best ?? 0, newStreak)
    const todayIso = new Date().toISOString().slice(0, 10)
    isLevelUp = progression.leveledUp

    await supabase.from('users').update({ 
      xp_current: progression.xpCurrent,
      xp_total: progression.xpTotal,
      level: newLevel,
      inventory_gold: newGold,
      streak_current: newStreak,
      streak_best: bestStreak,
      last_active_date: todayIso,
    }).eq('id', user.id)
  }

  revalidatePath('/habits')
  revalidatePath('/dashboard')
  revalidatePath('/profile')
  return { 
    success: true, 
    xpGained: xpReward, 
    levelUp: isLevelUp, 
    isEpic: habit.quest_type === 'epic' 
  }
}

export async function addHabitAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authorized' }

  const title = formData.get('title') as string
  const questType = formData.get('quest_type') as string || 'daily'
  const pledgeAmount = parseInt(formData.get('pledge') as string || '0')
  const targetDays = parseInt(formData.get('target_days') as string || '0')
  
  if (!title) return { error: 'Title required' }

  // 1. Check & Deduct Pledge Stake
  if (pledgeAmount > 0) {
    const { data: profile } = await supabase.from('users').select('inventory_gold').eq('id', user.id).single()
    if (!profile || profile.inventory_gold < pledgeAmount) {
      return { error: 'Insufficient gold for this pledge!' }
    }
    await supabase.from('users').update({ 
      inventory_gold: profile.inventory_gold - pledgeAmount 
    }).eq('id', user.id)
  }

  await supabase.from('habits').insert({
    user_id: user.id,
    title: title,
    title_zh: title, // Simplified for now
    xp_reward: questType === 'epic' ? 50 : 10,
    quest_type: questType,
    pledge_amount: pledgeAmount,
    pledge_target_days: targetDays
  })

  revalidatePath('/habits')
  return { success: true }
}
