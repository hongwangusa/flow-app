import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CoachClient from './CoachClient'

export default async function CoachPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('name, level, xp_current, xp_total, streak_current, streak_best, coach_personality, lang_preference')
    .eq('id', user.id)
    .single()

  const { data: recentTasks } = await supabase
    .from('tasks')
    .select('title, difficulty, is_completed, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <CoachClient
      profile={profile}
      recentTasks={recentTasks || []}
    />
  )
}
