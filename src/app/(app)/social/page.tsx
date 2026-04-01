import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SocialClient from './SocialClient'
import { getSocialData } from './actions'

export default async function SocialPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch initial data on server
  const socialData = await getSocialData()
  
  if (!socialData) {
    return <div>Error loading social data.</div>
  }

  const { data: profile } = await supabase
    .from('users')
    .select('lang_preference')
    .eq('id', user.id)
    .single()

  // Supabase returns users as array or object depending on join cardinality — normalise to object
  const normalizedFeed = socialData.feed.map((item: any) => ({
    ...item,
    users: Array.isArray(item.users)
      ? (item.users[0] ?? { id: '', name: 'Unknown', avatar_url: null })
      : (item.users ?? { id: '', name: 'Unknown', avatar_url: null }),
  }))

  return (
    <SocialClient
      initialFeed={normalizedFeed}
      initialFriends={socialData.friends}
      initialDiscover={socialData.discover}
      followingIds={socialData.followingIds}
      currentUserId={user.id}
      lang={profile?.lang_preference || 'en'}
    />
  )
}
