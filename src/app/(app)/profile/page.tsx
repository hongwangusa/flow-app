import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProfileClient from './ProfileClient'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: taskStats }] = await Promise.all([
    supabase
      .from('users')
      .select('name, level, xp_current, xp_total, streak_current, streak_best, created_at')
      .eq('id', user.id)
      .single(),
    supabase
      .from('tasks')
      .select('id, is_completed')
      .eq('user_id', user.id),
  ])

  const tasksCompleted = taskStats?.filter(t => t.is_completed).length ?? 0
  const tasksTotal = taskStats?.length ?? 0

  return (
    <ProfileClient
      name={profile?.name ?? user.user_metadata?.full_name ?? 'Explorer'}
      level={profile?.level ?? 1}
      xpCurrent={profile?.xp_current ?? 0}
      xpTotal={profile?.xp_total ?? 0}
      streakCurrent={profile?.streak_current ?? 0}
      streakBest={profile?.streak_best ?? 0}
      tasksCompleted={tasksCompleted}
      tasksTotal={tasksTotal}
    />
  )
}
