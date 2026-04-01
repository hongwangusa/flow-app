'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function followUser(targetId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authorized' }
  if (user.id === targetId) return { error: 'You cannot follow yourself' }

  const { error } = await supabase
    .from('follows')
    .insert({
      follower_id: user.id,
      following_id: targetId
    })

  if (error) {
    console.error('Follow error:', error)
    return { error: error.message }
  }

  revalidatePath('/social')
  return { success: true }
}

export async function unfollowUser(targetId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authorized' }

  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', user.id)
    .eq('following_id', targetId)

  if (error) {
    console.error('Unfollow error:', error)
    return { error: error.message }
  }

  revalidatePath('/social')
  return { success: true }
}

export async function getSocialData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // 1. Get following IDs
  const { data: following } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', user.id)

  const followingIds = following?.map(f => f.following_id) || []

  // 2. Get Activity Feed (XP Logs from followed users + self)
  // Fetch from xp_log joined with users
  const { data: feed } = await supabase
    .from('xp_log')
    .select(`
      id,
      amount,
      source,
      created_at,
      users ( id, name, avatar_url )
    `)
    .in('user_id', [...followingIds, user.id])
    .order('created_at', { ascending: false })
    .limit(20)

  // 3. Get Friends List (Users you follow)
  const { data: friends } = await supabase
    .from('users')
    .select('id, name, level, streak_current, xp_total')
    .in('id', followingIds)

  // 4. Discover (Users you don't follow, excluding self)
  const { data: discover } = await supabase
    .from('users')
    .select('id, name, level, streak_current')
    .not('id', 'in', `(${[...followingIds, user.id].join(',')})`)
    .limit(10)

  return {
    feed: feed || [],
    friends: friends || [],
    discover: discover || [],
    followingIds
  }
}
