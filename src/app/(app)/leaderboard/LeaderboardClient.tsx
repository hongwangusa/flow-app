'use client'
import { useState } from 'react'
import Link from 'next/link'
import GameBackground from '@/components/GameBackground'

const LEVEL_TITLES = [
  { min:1,  max:5,  en:'Initiate',    zh:'入门弟子' },
  { min:6,  max:15, en:'Builder',     zh:'筑基期' },
  { min:16, max:30, en:'Golden Core', zh:'金丹期' },
  { min:31, max:50, en:'Nascent Soul',zh:'元婴期' },
]
function getTitle(level: number) {
  return LEVEL_TITLES.find(t => level >= t.min && level <= t.max) || LEVEL_TITLES[0]
}

type DBUser = { id: string; name: string; level: number; xp_total: number; streak_current: number }
type Tab = 'weekly' | 'alltime' | 'friends'

const RANK_COLORS: Record<number, string> = { 1:'#F5C842', 2:'#C0C8D0', 3:'#C97B3A' }
const RANK_ICONS:  Record<number, string> = { 1:'🏆', 2:'🥈', 3:'🥉' }

export default function LeaderboardClient({ currentUserId, topUsers }: { currentUserId: string; topUsers: DBUser[] }) {
  const [lang, setLang] = useState<'en'|'zh'>('en')
  const isZh = lang === 'zh'
  const [tab, setTab] = useState<Tab>('alltime')

  const tabs: { id: Tab; en: string; zh: string }[] = [
    { id:'alltime', en:'All Time',  zh:'总榜' },
    { id:'weekly',  en:'This Week', zh:'本周' },
    { id:'friends', en:'Friends',   zh:'好友' },
  ]

  const card: React.CSSProperties = {
    background:'rgba(255,255,255,0.97)', borderRadius:24,
    padding:'24px 20px 20px', width:'100%', maxWidth:480,
    boxShadow:'0 24px 64px rgba(0,0,0,0.22)',
    position:'relative', zIndex:10,
  }

  // Build ranked list — real DB users
  const ranked = topUsers.map((u, i) => ({
    rank: i + 1,
    id: u.id,
    name: u.name || 'Explorer',
    avatar: (u.name || 'E')[0].toUpperCase(),
    level: u.level,
    xp: u.xp_total,
    streak: u.streak_current,
    isYou: u.id === currentUserId,
  }))

  const youEntry = ranked.find(e => e.isYou)
  const top3 = ranked.slice(0, 3)
  const podiumOrder = top3.length >= 3
    ? [top3[1], top3[0], top3[2]]
    : top3.length === 2
      ? [top3[1], top3[0]]
      : top3

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
        <div style={{textAlign:'center',marginBottom:20}}>
          <div style={{fontSize:28,marginBottom:4}}>🏆</div>
          <h1 style={{fontSize:20,fontWeight:900,color:'#0D1B2A',marginBottom:4}}>
            {isZh?'排行榜':'Leaderboard'}
          </h1>
          <p style={{fontSize:12,color:'#9CA3AF'}}>
            {isZh?'与同学们比拼，争夺榜首！':'Compete with classmates for the top spot!'}
          </p>
        </div>

        {/* Tabs */}
        <div style={{display:'flex',gap:4,marginBottom:16,background:'#F8FAFC',borderRadius:12,padding:4}}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{flex:1,padding:'8px 4px',borderRadius:9,border:'none',
                fontSize:12,fontWeight:700,cursor:'pointer',transition:'all .15s',
                background: tab===t.id ? 'white' : 'transparent',
                color: tab===t.id ? '#0D1B2A' : '#9CA3AF',
                boxShadow: tab===t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'}}>
              {isZh ? t.zh : t.en}
            </button>
          ))}
        </div>

        {tab !== 'alltime' ? (
          <div style={{textAlign:'center',padding:'40px 20px',color:'#C0CBDA'}}>
            <div style={{fontSize:32,marginBottom:8}}>🚧</div>
            <div style={{fontSize:14,fontWeight:600,color:'#9CA3AF'}}>
              {isZh?'即将开放':'Coming soon'}
            </div>
            <div style={{fontSize:12,color:'#C0CBDA',marginTop:4}}>
              {tab==='friends' ? (isZh?'邀请朋友后解锁':'Unlock by inviting friends') : (isZh?'周榜功能建设中':'Weekly rankings coming soon')}
            </div>
          </div>
        ) : ranked.length === 0 ? (
          <div style={{textAlign:'center',padding:'40px 20px',color:'#C0CBDA'}}>
            <div style={{fontSize:32,marginBottom:8}}>🌱</div>
            <div style={{fontSize:14,fontWeight:600,color:'#9CA3AF'}}>
              {isZh?'还没有玩家数据':'No players yet'}
            </div>
          </div>
        ) : (
          <>
            {/* Podium */}
            {top3.length >= 2 && (
              <div style={{display:'flex',alignItems:'flex-end',justifyContent:'center',gap:8,marginBottom:20,padding:'0 10px'}}>
                {podiumOrder.map((entry, i) => {
                  const heights = ['80px','100px','70px']
                  const rank = entry.rank
                  const color = RANK_COLORS[rank] ?? '#E2E8F0'
                  return (
                    <div key={entry.id} style={{flex:1,textAlign:'center'}}>
                      <div style={{fontSize:11,fontWeight:700,color:'#9CA3AF',marginBottom:4}}>
                        {entry.isYou ? (isZh?'你':'You') : entry.name}
                      </div>
                      <div style={{width:44,height:44,borderRadius:'50%',margin:'0 auto 6px',
                        background: entry.isYou
                          ? 'linear-gradient(135deg,#1B8A8F,#2ABFBF)'
                          : 'linear-gradient(135deg,#E2E8F0,#CBD5E1)',
                        border:`2px solid ${color}`,
                        display:'flex',alignItems:'center',justifyContent:'center',
                        fontSize:16,fontWeight:800,color:'white'}}>
                        {entry.avatar}
                      </div>
                      <div style={{fontSize:16}}>{RANK_ICONS[rank] ?? rank}</div>
                      <div style={{height:heights[i] ?? '70px',
                        background:`linear-gradient(180deg,${color}33,${color}22)`,
                        border:`1.5px solid ${color}44`,borderRadius:'8px 8px 0 0',marginTop:4,
                        display:'flex',alignItems:'center',justifyContent:'center',
                        fontSize:11,fontWeight:700,color}}>
                        {entry.xp} XP
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Full list */}
            <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:16}}>
              {ranked.map(entry => {
                const title = getTitle(entry.level)
                const isTop3 = entry.rank <= 3
                return (
                  <div key={entry.id}
                    style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:12,
                      background: entry.isYou
                        ? 'linear-gradient(135deg,rgba(27,138,143,0.08),rgba(42,191,191,0.06))'
                        : '#F8FAFC',
                      border: entry.isYou ? '1.5px solid #A7D9DB' : '1px solid #E2E8F0'}}>
                    <div style={{width:28,textAlign:'center',fontSize:isTop3?16:13,
                      fontWeight:800,color: RANK_COLORS[entry.rank] ?? '#9CA3AF',flexShrink:0}}>
                      {isTop3 ? RANK_ICONS[entry.rank] : entry.rank}
                    </div>
                    <div style={{width:36,height:36,borderRadius:'50%',flexShrink:0,
                      background: entry.isYou
                        ? 'linear-gradient(135deg,#1B8A8F,#2ABFBF)'
                        : 'linear-gradient(135deg,#E2E8F0,#CBD5E1)',
                      display:'flex',alignItems:'center',justifyContent:'center',
                      fontSize:14,fontWeight:800,color: entry.isYou?'white':'#64748B'}}>
                      {entry.avatar}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:700,color:'#0D1B2A',display:'flex',alignItems:'center',gap:6}}>
                        {entry.name}
                        {entry.isYou && (
                          <span style={{fontSize:10,background:'#1B8A8F',color:'white',
                            padding:'1px 6px',borderRadius:99,fontWeight:700}}>
                            {isZh?'你':'YOU'}
                          </span>
                        )}
                      </div>
                      <div style={{fontSize:11,color:'#9CA3AF'}}>
                        Lv.{entry.level} · {isZh ? title.zh : title.en}
                      </div>
                    </div>
                    <div style={{textAlign:'right',flexShrink:0}}>
                      <div style={{fontSize:13,fontWeight:700,color:'#C9A84C'}}>{entry.xp} XP</div>
                      <div style={{fontSize:11,color:'#E8644B'}}>🔥 {entry.streak}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Your rank summary */}
            {youEntry && youEntry.rank > 1 && (
              <div style={{background:'linear-gradient(135deg,#F0FAFB,#E8F8F8)',
                border:'1.5px solid #A7D9DB',borderRadius:12,padding:'10px 14px',
                marginBottom:16,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:12,color:'#1B8A8F',fontWeight:700}}>
                  {isZh?`你的排名: #${youEntry.rank}`:`Your rank: #${youEntry.rank}`}
                </span>
                {ranked[youEntry.rank - 2] && (
                  <span style={{fontSize:12,color:'#9CA3AF'}}>
                    {ranked[youEntry.rank-2].xp - youEntry.xp} XP {isZh?`距#${youEntry.rank-1}`:`to #${youEntry.rank-1}`}
                  </span>
                )}
              </div>
            )}
            {youEntry?.rank === 1 && (
              <div style={{background:'linear-gradient(135deg,#FFF9E6,#FFF3CC)',
                border:'1.5px solid #F5C842',borderRadius:12,padding:'10px 14px',
                marginBottom:16,textAlign:'center',fontSize:13,fontWeight:700,color:'#92680A'}}>
                🏆 {isZh?'你是第一名！':'You\'re #1!'}
              </div>
            )}
          </>
        )}

        <div style={{display:'flex',gap:8}}>
          <Link href="/social"
            style={{flex:1,textAlign:'center',padding:'10px',
              background:'linear-gradient(135deg,#F5C842,#E8A020)',
              borderRadius:12,fontSize:13,fontWeight:700,color:'#1A1200',textDecoration:'none'}}>
            {isZh?'👥 社交':'👥 Social'}
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
