'use client'
import { useState } from 'react'
import Link from 'next/link'
import GameBackground from '@/components/GameBackground'

interface LeaderboardUser {
  id: string
  name: string
  level: number
  inventory_gold: number
  avatar?: string
}

export default function LeaderboardClient({ 
  users, 
  followingIds, 
  currentUserId, 
  lang = 'en' 
}: { 
  users: LeaderboardUser[], 
  followingIds: string[],
  currentUserId: string, 
  lang?: string 
}) {
  const [isZh] = useState(lang === 'zh')
  const [filterFriends, setFilterFriends] = useState(false)

  const cardStyle = {
    background: 'rgba(255,255,255,0.9)',
    borderRadius: 24, padding: '32px',
    maxWidth: 600, width: '100%',
    boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
    position: 'relative' as const, zIndex: 10,
    display: 'flex', flexDirection: 'column' as const
  }

  // Filter users if "Friends Only" is active
  const displayedUsers = filterFriends 
    ? users.filter(u => followingIds.includes(u.id) || u.id === currentUserId)
    : users

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:40}}>
      <GameBackground />
      
      <div style={cardStyle}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
          <h1 style={{margin: 0, fontSize: 32, color: '#0D1B2A', fontWeight: 800}}>
            {isZh ? (filterFriends ? '好友排名' : '全球排名') : (filterFriends ? 'Friend Circle' : 'Hall of Fame')} 🏆
          </h1>
          <Link href="/dashboard" style={{color: '#94A3B8', fontSize: 14, fontWeight: 600, textDecoration: 'none'}}>
            {isZh ? '← 返回' : '← Back'}
          </Link>
        </div>

        {/* Filter Toggle */}
        <div style={{display: 'flex', gap: 8, marginBottom: 32, background: '#F1F5F9', padding: 4, borderRadius: 12, width: 'fit-content'}}>
          <button 
            onClick={() => setFilterFriends(false)}
            style={{padding: '6px 16px', borderRadius: 8, border: 'none', background: !filterFriends ? '#fff' : 'transparent', color: !filterFriends ? '#1B8A8F' : '#64748B', fontWeight: 700, cursor: 'pointer', boxShadow: !filterFriends ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: '0.2s', fontSize: 13}}>
            {isZh ? '全球' : 'Global'}
          </button>
          <button 
            onClick={() => setFilterFriends(true)}
            style={{padding: '6px 16px', borderRadius: 8, border: 'none', background: filterFriends ? '#fff' : 'transparent', color: filterFriends ? '#1B8A8F' : '#64748B', fontWeight: 700, cursor: 'pointer', boxShadow: filterFriends ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: '0.2s', fontSize: 13}}>
            {isZh ? '好友' : 'Friends'}
          </button>
        </div>

        {/* Podium Top 3 */}
        <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 20, marginBottom: 40}}>
          {displayedUsers.slice(0, 3).map((u, i) => {
            const order = [1, 0, 2]; // 2nd, 1st, 3rd visually
            const user = displayedUsers[order[i]];
            if (!user) return null;
            const isFirst = order[i] === 0;
            const height = isFirst ? 140 : (order[i] === 1 ? 110 : 90);
            
            return (
              <div key={user.id} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1}}>
                <div style={{fontSize: isFirst ? 40 : 28}}>{isFirst ? '👑' : (order[i] === 1 ? '🥈' : '🥉')}</div>
                <div style={{
                  width: '100%', height: height, background: isFirst ? 'linear-gradient(135deg, #FFD700, #FFA500)' : '#F1F5F9',
                  borderRadius: '16px 16px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  <div style={{fontSize: 16, fontWeight: 800, color: isFirst ? 'white' : '#1B8A8F'}}>Lv.{user.level}</div>
                  <div style={{fontSize: 12, fontWeight: 600, color: isFirst ? 'white' : '#64748B', maxWidth: '80%', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                    {user.name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* List for rest */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 400, overflowY: 'auto', paddingRight: 8}}>
          {displayedUsers.length === 0 && (
            <div style={{textAlign: 'center', padding: '40px 0', color: '#94A3B8', fontSize: 14}}>
              {isZh ? '暂无好友排名。' : 'No friends in ranking yet.'}
            </div>
          )}
          {displayedUsers.map((user, index) => (
            <div key={user.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px',
              background: user.id === currentUserId ? 'rgba(27, 138, 143, 0.1)' : 'white',
              borderRadius: 16, border: user.id === currentUserId ? '2px solid #1B8A8F' : '1px solid #E2E8F0'
            }}>
              <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                <div style={{fontSize: 14, fontWeight: 800, color: '#94A3B8', width: 24}}>{index + 1}</div>
                <div style={{fontSize: 16, fontWeight: 700, color: '#0D1B2A'}}>{user.name}</div>
                {user.id === currentUserId && <div style={{fontSize: 10, background: '#1B8A8F', color: 'white', padding: '2px 6px', borderRadius: 4}}>YOU</div>}
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                <div style={{fontSize: 14, fontWeight: 700, color: '#1B8A8F'}}>Lv.{user.level}</div>
                <div style={{fontSize: 14, fontWeight: 700, color: '#C9A84C'}}>{user.inventory_gold}g</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
