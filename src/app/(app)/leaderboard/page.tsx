import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LeaderboardClient from './LeaderboardClient'

export default async function LeaderboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch real top users from DB
  const { data: topUsers } = await supabase
    .from('users')
    .select('id, name, level, xp_total, streak_current')
    .order('xp_total', { ascending: false })
    .limit(20)

  return <LeaderboardClient currentUserId={user.id} topUsers={topUsers || []} />
}
