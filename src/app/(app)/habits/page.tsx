import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import HabitsClient from './HabitsClient'

export default async function HabitsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('lang_preference')
    .eq('id', user.id)
    .single()

  const { data: habits } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const today = new Date().toISOString().split('T')[0]

  const formattedHabits =
    habits?.map((habit) => ({
      id: habit.id,
      name: habit.title,
      zh: habit.title_zh || habit.title,
      streak: habit.streak_count || 0,
      done: habit.last_completed_date === today,
      emoji: habit.quest_type === 'epic' ? '⚔️' : '⭐',
      quest_type: habit.quest_type || 'daily',
      pledge_amount: habit.pledge_amount || 0,
      pledge_target_days: habit.pledge_target_days || 0,
    })) ?? []

  return <HabitsClient initialHabits={formattedHabits} lang={profile?.lang_preference || 'en'} />
}
