import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [{ data: profile }, { data: tasks }] = await Promise.all([
    supabase
      .from('users')
      .select('name, level, xp_current, xp_total, streak_current')
      .eq('id', user.id)
      .single(),
    supabase
      .from('tasks')
      .select('id, is_completed')
      .eq('user_id', user.id),
  ])

  const tasksDone  = tasks?.filter(t => t.is_completed).length ?? 0
  const tasksPending = tasks?.filter(t => !t.is_completed).length ?? 0

  return (
    <DashboardClient
      email={user.email ?? ''}
      userName={profile?.name ?? user.user_metadata?.full_name ?? ''}
      level={profile?.level ?? 1}
      xpCurrent={profile?.xp_current ?? 0}
      streakCurrent={profile?.streak_current ?? 0}
      tasksDone={tasksDone}
      tasksPending={tasksPending}
    />
  )
}
