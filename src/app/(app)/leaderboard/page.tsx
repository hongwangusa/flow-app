import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LeaderboardClient from './LeaderboardClient'

export default async function LeaderboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // 1. Fetch top 50 users globally
  const { data: topUsers } = await supabase
    .from('users')
    .select('id, name, level, inventory_gold')
    .order('level', { ascending: false })
    .order('inventory_gold', { ascending: false })
    .limit(50)

  // 2. Fetch Following IDs for filtering
  const { data: following } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', user.id)
  
  const followingIds = following?.map(f => f.following_id) || []

  const { data: profile } = await supabase
    .from('users')
    .select('lang_preference')
    .eq('id', user.id)
    .single()

  return (
    <LeaderboardClient 
      users={topUsers || []} 
      followingIds={followingIds}
      currentUserId={user.id} 
      lang={profile?.lang_preference || 'en'} 
    />
  )
}
