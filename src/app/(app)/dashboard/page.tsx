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
      .select('name, level, xp_current, xp_total, streak_current, inventory_gold')
      .eq('id', user.id)
      .single(),
    supabase
      .from('tasks')
      .select('id, title, difficulty, is_completed')
      .eq('user_id', user.id),
  ])

  const tasksDone  = tasks?.filter(t => t.is_completed).length ?? 0
  const tasksPending = tasks?.filter(t => !t.is_completed).length ?? 0
  const recentPendingTasks = tasks
    ?.filter((task) => !task.is_completed)
    .slice(0, 3)
    .map((task) => ({
      id: task.id,
      title: task.title,
      difficulty: task.difficulty ?? 'medium',
    })) ?? []

  return (
    <DashboardClient
      email={user.email ?? ''}
      userName={profile?.name ?? user.user_metadata?.full_name ?? ''}
      level={profile?.level ?? 1}
      xpCurrent={profile?.xp_current ?? 0}
      xpTotal={profile?.xp_total ?? 0}
      streakCurrent={profile?.streak_current ?? 0}
      tasksDone={tasksDone}
      tasksPending={tasksPending}
      inventoryGold={profile?.inventory_gold ?? 0}
      recentPendingTasks={recentPendingTasks}
    />
  )
}
