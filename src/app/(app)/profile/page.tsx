import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileClient from './ProfileClient'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [{ data: profile }, { data: tasks }, { data: xpLogs }] = await Promise.all([
    supabase.from('users').select('*').eq('id', user.id).single(),
    supabase.from('tasks').select('id, is_completed').eq('user_id', user.id),
    supabase.from('xp_log')
      .select('amount, created_at')
      .eq('user_id', user.id)
      .gte('created_at', thirtyDaysAgo.toISOString())
  ])

  // Group XP by date
  const heatmapData = xpLogs?.reduce((acc: any, log: any) => {
    const date = log.created_at.split('T')[0]
    acc[date] = (acc[date] || 0) + log.amount
    return acc
  }, {}) || {}

  const heatmapArray = Object.entries(heatmapData).map(([date, count]) => ({ 
    date, 
    count: count as number 
  }))

  const tasksDone = tasks?.filter(t => t.is_completed).length ?? 0

  return (
    <ProfileClient 
      name={profile?.name || user.email?.split('@')[0] || 'Trainer'}
      level={profile?.level || 1}
      xpCurrent={profile?.xp_current || 0}
      xpTotal={profile?.xp_total || 0}
      streak={profile?.streak_current || 0}
      tasksCompleted={tasksDone}
      langPref={profile?.lang_preference || 'en'}
      coachPersonality={profile?.coach_personality || 'mentor'}
      heatmapData={heatmapArray}
    />
  )
}
