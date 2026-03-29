'use client'
import { useState } from 'react'
import Link from 'next/link'
import GameBackground from '@/components/GameBackground'

// Placeholder data — wired to Supabase in Day 9
const MOCK_FRIENDS = [
  { id:1, name:'Alex',   avatar:'A', level:6,  streak:8,  xp:1520, status:'online',  lastActive:'Just now',      isFollowing:true  },
  { id:2, name:'Luna',   avatar:'L', level:5,  streak:5,  xp:1210, status:'online',  lastActive:'2 min ago',     isFollowing:true  },
  { id:3, name:'Jordan', avatar:'J', level:4,  streak:3,  xp:980,  status:'offline', lastActive:'1 hour ago',    isFollowing:true  },
  { id:4, name:'Sam',    avatar:'S', level:4,  streak:7,  xp:870,  status:'offline', lastActive:'3 hours ago',   isFollowing:false },
  { id:5, name:'Taylor', avatar:'T', level:3,  streak:2,  xp:640,  status:'offline', lastActive:'Yesterday',     isFollowing:false },
]

const MOCK_FEED = [
  { id:1, user:'Alex',   avatar:'A', action:'completed',  item:'Math homework',      xp:25,  time:'5 min ago',   emoji:'⚔️' },
  { id:2, user:'Luna',   avatar:'L', action:'streak',     item:'7-day streak!',      xp:0,   time:'1 hour ago',  emoji:'🔥' },
  { id:3, user:'Alex',   avatar:'A', action:'leveled up', item:'Level 6 achieved',   xp:0,   time:'2 hours ago', emoji:'⭐' },
  { id:4, user:'Jordan', avatar:'J', action:'completed',  item:'English reading',    xp:10,  time:'3 hours ago', emoji:'📚' },
  { id:5, user:'Luna',   avatar:'L', action:'completed',  item:'Morning meditation', xp:15,  time:'4 hours ago', emoji:'🧘' },
  { id:6, user:'Taylor', avatar:'T', action:'joined',     item:'Flow / 流动',        xp:0,   time:'Yesterday',   emoji:'🎉' },
]

type Tab = 'feed' | 'friends' | 'discover'

export default function SocialPage() {
  const [lang, setLang] = useState<'en'|'zh'>('en')
  const isZh = lang === 'zh'
  const [tab, setTab] = useState<Tab>('feed')
  const [following, setFollowing] = useState<Set<number>>(
    new Set(MOCK_FRIENDS.filter(f => f.isFollowing).map(f => f.id))
  )

  const tabs: { id: Tab; en: string; zh: string; count?: number }[] = [
    { id:'feed',     en:'Activity',  zh:'动态',  count: MOCK_FEED.length },
    { id:'friends',  en:'Friends',   zh:'好友',  count: MOCK_FRIENDS.filter(f => f.isFollowing).length },
    { id:'discover', en:'Discover',  zh:'发现' },
  ]

  const card: React.CSSProperties = {
    background:'rgba(255,255,255,0.97)', borderRadius:24,
    padding:'24px 20px 20px', width:'100%', maxWidth:480,
    boxShadow:'0 24px 64px rgba(0,0,0,0.22)',
    position:'relative', zIndex:10,
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <GameBackground />
      <button onClick={() => setLang(isZh?'en':'zh')}
        style={{position:'fixed',top:18,right:18,zIndex:20,background:'rgba(255,255,255,0.85)',
          border:'1px solid rgba(255,255,255,0.6)',borderRadius:20,padding:'5px 14px',
          fontSize:13,fontWeight:600,cursor:'pointer',backdropFilter:'blur(8px)'}}>
        {isZh?'EN':'中文'}
      </button>

      <div style={card}>
        {/* Header */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
          <div>
            <h1 style={{fontSize:20,fontWeight:900,color:'#0D1B2A'}}>
              {isZh?'👥 社交圈':'👥 Social'}
            </h1>
            <p style={{fontSize:12,color:'#9CA3AF',marginTop:2}}>
              {isZh?'和朋友们一起成长':'Grow together with friends'}
            </p>
          </div>
          <button style={{background:'linear-gradient(135deg,#1B8A8F,#2ABFBF)',border:'none',
            borderRadius:12,padding:'8px 14px',fontSize:12,fontWeight:700,color:'white',cursor:'pointer'}}>
            {isZh?'邀请':'Invite +'}
          </button>
        </div>

        {/* Tabs */}
        <div style={{display:'flex',gap:4,marginBottom:16,background:'#F8FAFC',
          borderRadius:12,padding:4}}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{flex:1,padding:'8px 4px',borderRadius:9,border:'none',
                fontSize:12,fontWeight:700,cursor:'pointer',transition:'all .15s',
                background: tab===t.id ? 'white' : 'transparent',
                color: tab===t.id ? '#0D1B2A' : '#9CA3AF',
                boxShadow: tab===t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'}}>
              {isZh ? t.zh : t.en}
              {t.count !== undefined && (
                <span style={{marginLeft:4,background: tab===t.id?'#1B8A8F':'#E2E8F0',
                  color: tab===t.id?'white':'#9CA3AF',
                  borderRadius:99,padding:'0 5px',fontSize:10}}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Activity Feed */}
        {tab === 'feed' && (
          <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:16}}>
            {MOCK_FEED.map(item => (
              <div key={item.id} style={{display:'flex',alignItems:'flex-start',gap:10,
                padding:'10px 12px',background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:12}}>
                <div style={{width:36,height:36,borderRadius:'50%',flexShrink:0,
                  background:'linear-gradient(135deg,#E2E8F0,#CBD5E1)',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:14,fontWeight:800,color:'#64748B'}}>
                  {item.avatar}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,color:'#374151',lineHeight:1.4}}>
                    <span style={{fontWeight:700,color:'#0D1B2A'}}>{item.user}</span>
                    {' '}
                    <span style={{color:'#6B7280'}}>
                      {item.action === 'completed' ? (isZh?'完成了':'completed') :
                       item.action === 'streak'     ? (isZh?'达成连击':'achieved a') :
                       item.action === 'leveled up' ? (isZh?'升级到':'reached') :
                       (isZh?'加入了':'joined')}
                    </span>
                    {' '}
                    <span style={{fontWeight:600,color:'#0D1B2A'}}>{item.emoji} {item.item}</span>
                    {item.xp > 0 && (
                      <span style={{marginLeft:6,fontSize:11,fontWeight:700,color:'#C9A84C'}}>
                        +{item.xp} XP
                      </span>
                    )}
                  </div>
                  <div style={{fontSize:11,color:'#C0CBDA',marginTop:3}}>{item.time}</div>
                </div>
                <button style={{background:'none',border:'none',cursor:'pointer',
                  fontSize:16,color:'#E2E8F0',padding:'2px'}}
                  title={isZh?'点赞':'Like'}>
                  👏
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Friends List */}
        {tab === 'friends' && (
          <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:16}}>
            {MOCK_FRIENDS.filter(f => following.has(f.id)).map(friend => (
              <div key={friend.id} style={{display:'flex',alignItems:'center',gap:10,
                padding:'10px 12px',background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:12}}>
                <div style={{position:'relative',flexShrink:0}}>
                  <div style={{width:40,height:40,borderRadius:'50%',
                    background:'linear-gradient(135deg,#E2E8F0,#CBD5E1)',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:15,fontWeight:800,color:'#64748B'}}>
                    {friend.avatar}
                  </div>
                  <div style={{position:'absolute',bottom:1,right:1,width:10,height:10,
                    borderRadius:'50%',border:'2px solid white',
                    background: friend.status==='online' ? '#22C55E' : '#D1D5DB'}}/>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:'#0D1B2A'}}>{friend.name}</div>
                  <div style={{fontSize:11,color:'#9CA3AF'}}>
                    Lv.{friend.level} · 🔥{friend.streak} · {friend.xp} XP
                  </div>
                </div>
                <div style={{textAlign:'right',flexShrink:0}}>
                  <div style={{fontSize:10,color: friend.status==='online'?'#22C55E':'#C0CBDA',fontWeight:600}}>
                    {friend.status==='online' ? (isZh?'在线':'Online') : friend.lastActive}
                  </div>
                  <button style={{marginTop:4,background:'#F0FAFB',border:'1px solid #A7D9DB',
                    borderRadius:8,padding:'3px 10px',fontSize:11,fontWeight:700,
                    color:'#1B8A8F',cursor:'pointer'}}>
                    {isZh?'鼓励':'Cheer 👏'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Discover */}
        {tab === 'discover' && (
          <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:16}}>
            <p style={{fontSize:12,color:'#9CA3AF',marginBottom:4}}>
              {isZh?'你可能认识的人':'People you may know'}
            </p>
            {MOCK_FRIENDS.filter(f => !following.has(f.id)).map(person => (
              <div key={person.id} style={{display:'flex',alignItems:'center',gap:10,
                padding:'10px 12px',background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:12}}>
                <div style={{width:40,height:40,borderRadius:'50%',flexShrink:0,
                  background:'linear-gradient(135deg,#E2E8F0,#CBD5E1)',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:15,fontWeight:800,color:'#64748B'}}>
                  {person.avatar}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:'#0D1B2A'}}>{person.name}</div>
                  <div style={{fontSize:11,color:'#9CA3AF'}}>
                    Lv.{person.level} · 🔥{person.streak} streak
                  </div>
                </div>
                <button onClick={() => setFollowing(prev => new Set([...prev, person.id]))}
                  style={{background:'linear-gradient(135deg,#1B8A8F,#2ABFBF)',border:'none',
                    borderRadius:10,padding:'7px 14px',fontSize:12,fontWeight:700,
                    color:'white',cursor:'pointer',flexShrink:0}}>
                  {isZh?'关注':'Follow'}
                </button>
              </div>
            ))}
            {MOCK_FRIENDS.filter(f => !following.has(f.id)).length === 0 && (
              <div style={{textAlign:'center',padding:'32px 0',color:'#C0CBDA'}}>
                <div style={{fontSize:28,marginBottom:8}}>🎉</div>
                <div style={{fontSize:13}}>{isZh?'你已关注所有人！':'You\'re following everyone!'}</div>
              </div>
            )}
          </div>
        )}

        {/* Bottom nav */}
        <div style={{display:'flex',gap:8}}>
          <Link href="/leaderboard"
            style={{flex:1,textAlign:'center',padding:'10px',
              background:'linear-gradient(135deg,#F5C842,#E8A020)',
              borderRadius:12,fontSize:13,fontWeight:700,color:'#1A1200',textDecoration:'none'}}>
            {isZh?'🏆 排行榜':'🏆 Leaderboard'}
          </Link>
          <Link href="/dashboard"
            style={{flex:1,textAlign:'center',padding:'10px',background:'#F0FAFB',
              border:'1.5px solid #A7D9DB',borderRadius:12,fontSize:13,fontWeight:700,
              color:'#1B8A8F',textDecoration:'none'}}>
            {isZh?'← 主页':'← Home'}
          </Link>
        </div>
        <p style={{textAlign:'center',marginTop:10,fontSize:11,color:'#C0CBDA'}}>v0.1 Beta · Flow / 流动</p>
      </div>
    </div>
  )
}
