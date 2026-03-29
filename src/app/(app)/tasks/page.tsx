import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import TasksClient from './TasksClient'

export default async function TasksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: tasks }, { data: profile }] = await Promise.all([
    supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('users')
      .select('level, xp_current, streak_current')
      .eq('id', user.id)
      .single(),
  ])

  return (
    <TasksClient
      tasks={tasks ?? []}
      level={profile?.level ?? 1}
      xpCurrent={profile?.xp_current ?? 0}
      streakCurrent={profile?.streak_current ?? 0}
    />
  )
}
