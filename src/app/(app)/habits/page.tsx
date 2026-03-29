import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import HabitsClient from './HabitsClient'

export default async function HabitsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const today = new Date().toISOString().slice(0, 10)

  const [{ data: habits }, { data: profile }] = await Promise.all([
    supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: true }),
    supabase
      .from('users')
      .select('level, xp_current, streak_current')
      .eq('id', user.id)
      .single(),
  ])

  const habitsWithDoneFlag = (habits ?? []).map(h => ({
    ...h,
    done_today: h.last_completed_date === today,
  }))

  return (
    <HabitsClient
      habits={habitsWithDoneFlag}
      level={profile?.level ?? 1}
      xpCurrent={profile?.xp_current ?? 0}
      streakCurrent={profile?.streak_current ?? 0}
    />
  )
}
