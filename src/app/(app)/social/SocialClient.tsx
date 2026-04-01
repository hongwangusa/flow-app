'use client'

import { useState, useTransition } from 'react'
import GameBackground from '@/components/GameBackground'
import { followUser, unfollowUser } from './actions'

interface FeedItem {
  id: string
  amount: number
  source: string
  created_at: string
  users: { id: string; name: string; avatar_url: string | null }
}

interface UserSummary {
  id: string
  name: string
  level: number
  streak_current: number
  xp_total?: number
}

type Tab = 'feed' | 'friends' | 'discover'

export default function SocialClient({
  initialFeed,
  initialFriends,
  initialDiscover,
  followingIds,
  currentUserId,
  lang = 'en',
}: {
  initialFeed: FeedItem[]
  initialFriends: UserSummary[]
  initialDiscover: UserSummary[]
  followingIds: string[]
  currentUserId: string
  lang?: string
}) {
  const isZh = lang === 'zh'
  const [tab, setTab] = useState<Tab>('feed')
  const [isPending, startTransition] = useTransition()

  const tabs: { id: Tab; en: string; zh: string; count?: number }[] = [
    { id: 'feed', en: 'Activity', zh: '动态', count: initialFeed.length },
    { id: 'friends', en: 'Friends', zh: '好友', count: initialFriends.length },
    { id: 'discover', en: 'Discover', zh: '发现', count: initialDiscover.length },
  ]

  const getTimeAgo = (dateStr: string) => {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
    if (seconds < 60) return isZh ? '刚刚' : 'Just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return isZh ? `${minutes} 分钟前` : `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return isZh ? `${hours} 小时前` : `${hours}h ago`
    return isZh ? '昨天' : 'Yesterday'
  }

  const getSourceText = (source: string) => {
    if (source.includes('task')) return isZh ? '完成了任务' : 'completed a task'
    if (source.includes('habit')) return isZh ? '坚持了习惯' : 'kept a habit'
    if (source.includes('level')) return isZh ? '升到了新等级' : 'reached a new level'
    return isZh ? '获得了经验' : 'gained XP'
  }

  const getEmoji = (source: string) => {
    if (source.includes('task')) return '🗂️'
    if (source.includes('habit')) return '⭐'
    if (source.includes('level')) return '✨'
    return '✓'
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <GameBackground />

      <div
        style={{
          background: 'rgba(255,255,255,0.97)',
          borderRadius: 24,
          padding: '24px 20px 20px',
          width: '100%',
          maxWidth: 520,
          boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
          position: 'relative',
          zIndex: 10,
          minHeight: 520,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: '#0D1B2A', margin: 0 }}>
              {isZh ? '社交' : 'Social'}
            </h1>
            <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>
              {isZh ? '和朋友一起推进任务。' : 'Build momentum with friends.'}
            </p>
          </div>
          <div style={{ background: 'linear-gradient(135deg,#1B8A8F,#2ABFBF)', borderRadius: 12, padding: '8px 14px', fontSize: 12, fontWeight: 700, color: 'white' }}>
            {isZh ? '伙伴模式' : 'Crew Mode'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: '#F8FAFC', borderRadius: 12, padding: 4 }}>
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              style={{
                flex: 1,
                padding: '8px 4px',
                borderRadius: 9,
                border: 'none',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                background: tab === item.id ? 'white' : 'transparent',
                color: tab === item.id ? '#0D1B2A' : '#9CA3AF',
                boxShadow: tab === item.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {isZh ? item.zh : item.en}
              <span
                style={{
                  marginLeft: 4,
                  background: tab === item.id ? '#1B8A8F' : '#E2E8F0',
                  color: tab === item.id ? 'white' : '#9CA3AF',
                  borderRadius: 99,
                  padding: '0 5px',
                  fontSize: 10,
                }}
              >
                {item.count}
              </span>
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4 }}>
          {tab === 'feed' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {initialFeed.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#9CA3AF', fontSize: 13 }}>
                  {isZh ? '关注一些朋友后，这里会出现他们的动态。' : 'Follow a few people and their updates will show here.'}
                </div>
              )}
              {initialFeed.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg,#E2E8F0,#CBD5E1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#64748B' }}>
                    {item.users.name?.[0] || '?'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.4 }}>
                      <span style={{ fontWeight: 700, color: '#0D1B2A' }}>
                        {item.users.id === currentUserId ? (isZh ? '我' : 'Me') : item.users.name}
                      </span>{' '}
                      <span style={{ color: '#6B7280' }}>{getSourceText(item.source)}</span>{' '}
                      <span style={{ fontWeight: 600, color: '#0D1B2A' }}>{getEmoji(item.source)}</span>
                      {item.amount > 0 && (
                        <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 700, color: '#C9A84C' }}>+{item.amount} XP</span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: '#C0CBDA', marginTop: 3 }} suppressHydrationWarning>{getTimeAgo(item.created_at)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'friends' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {initialFriends.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#9CA3AF', fontSize: 13 }}>
                  {isZh ? '你还没有关注任何朋友。' : "You aren't following anyone yet."}
                </div>
              )}
              {initialFriends.map((friend) => (
                <div key={friend.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg,#E2E8F0,#CBD5E1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color: '#64748B' }}>
                    {friend.name?.[0] || '?'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0D1B2A' }}>{friend.name}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>
                      Lv.{friend.level} • 🔥 {friend.streak_current}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      startTransition(async () => {
                        await unfollowUser(friend.id)
                      })
                    }
                    disabled={isPending}
                    style={{ background: 'none', border: '1px solid #E2E8F0', borderRadius: 8, padding: '6px 10px', fontSize: 11, fontWeight: 600, color: '#9CA3AF', cursor: 'pointer' }}
                  >
                    {isZh ? '已关注' : 'Following'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === 'discover' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {initialDiscover.map((person) => {
                const alreadyFollowing = followingIds.includes(person.id)
                return (
                  <div key={person.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg,#E2E8F0,#CBD5E1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color: '#64748B' }}>
                      {person.name?.[0] || '?'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0D1B2A' }}>{person.name}</div>
                      <div style={{ fontSize: 11, color: '#9CA3AF' }}>
                        Lv.{person.level} • 🔥 {person.streak_current}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        startTransition(async () => {
                          if (alreadyFollowing) {
                            await unfollowUser(person.id)
                          } else {
                            await followUser(person.id)
                          }
                        })
                      }
                      disabled={isPending}
                      style={{ background: alreadyFollowing ? 'white' : 'linear-gradient(135deg,#1B8A8F,#2ABFBF)', border: alreadyFollowing ? '1px solid #E2E8F0' : 'none', borderRadius: 8, padding: '6px 10px', fontSize: 11, fontWeight: 700, color: alreadyFollowing ? '#9CA3AF' : 'white', cursor: 'pointer' }}
                    >
                      {alreadyFollowing ? (isZh ? '已关注' : 'Following') : isZh ? '关注' : 'Follow'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
