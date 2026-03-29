'use client'
import { useState } from 'react'
import Link from 'next/link'
import GameBackground from '@/components/GameBackground'

const LEVEL_TITLES = [
  { min:1,  max:5,  en:'Initiate',      zh:'入门弟子' },
  { min:6,  max:15, en:'Builder',       zh:'筑基期' },
  { min:16, max:30, en:'Golden Core',   zh:'金丹期' },
  { min:31, max:50, en:'Nascent Soul',  zh:'元婴期' },
]
function getTitle(level: number) {
  return LEVEL_TITLES.find(t => level >= t.min && level <= t.max) || LEVEL_TITLES[0]
}

// Placeholder data — will be replaced with real Supabase query in Day 9
const MOCK_WEEKLY = [
  { rank:1, name:'Kitty',    avatar:'K', level:7,  xp:1840, streak:12, isYou:true  },
  { rank:2, name:'Alex',     avatar:'A', level:6,  xp:1520, streak:8,  isYou:false },
  { rank:3, name:'Luna',     avatar:'L', level:5,  xp:1210, streak:5,  isYou:false },
  { rank:4, name:'Jordan',   avatar:'J', level:4,  xp:980,  streak:3,  isYou:false },
  { rank:5, name:'Sam',      avatar:'S', level:4,  xp:870,  streak:7,  isYou:false },
  { rank:6, name:'Taylor',   avatar:'T', level:3,  xp:640,  streak:2,  isYou:false },
  { rank:7, name:'Morgan',   avatar:'M', level:3,  xp:580,  streak:4,  isYou:false },
  { rank:8, name:'Casey',    avatar:'C', level:2,  xp:320,  streak:1,  isYou:false },
]

const RANK_COLORS: Record<number,string> = { 1:'#F5C842', 2:'#C0C8D0', 3:'#C97B3A' }
const RANK_ICONS:  Record<number,string> = { 1:'🏆', 2:'🥈', 3:'🥉' }

type Tab = 'weekly' | 'alltime' | 'friends'

export default function LeaderboardPage() {
  const [lang, setLang] = useState<'en'|'zh'>('en')
  const isZh = lang === 'zh'
  const [tab, setTab] = useState<Tab>('weekly')

  const tabs: { id: Tab; en: string; zh: string }[] = [
    { id:'weekly',  en:'This Week', zh:'本周' },
    { id:'alltime', en:'All Time',  zh:'总榜' },
    { id:'friends', en:'Friends',   zh:'好友' },
  ]

  const card: React.CSSProperties = {
    background:'rgba(255,255,255,0.97)', borderRadius:24,
    padding:'24px 20px 20px', width:'100%', maxWidth:480,
    boxShadow:'0 24px 64px rgba(0,0,0,0.22)',
    position:'relative', zIndex:10,
  }

  const youEntry = MOCK_WEEKLY.find(e => e.isYou)

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
            </button>
          ))}
        </div>

        {/* Coming soon overlay for non-weekly tabs */}
        {tab !== 'weekly' ? (
          <div style={{textAlign:'center',padding:'40px 20px',color:'#C0CBDA'}}>
            <div style={{fontSize:32,marginBottom:8}}>🚧</div>
            <div style={{fontSize:14,fontWeight:600,color:'#9CA3AF'}}>
              {isZh?'即将开放':'Coming soon'}
            </div>
            <div style={{fontSize:12,color:'#C0CBDA',marginTop:4}}>
              {isZh?'邀请朋友后解锁':'Unlock by inviting friends'}
            </div>
          </div>
        ) : (
          <>
            {/* Top 3 podium */}
            <div style={{display:'flex',alignItems:'flex-end',justifyContent:'center',
              gap:8,marginBottom:20,padding:'0 10px'}}>
              {[MOCK_WEEKLY[1], MOCK_WEEKLY[0], MOCK_WEEKLY[2]].map((entry, i) => {
                const heights = ['80px','100px','70px']
                const podiumRanks = [2, 1, 3]
                const rank = podiumRanks[i]
                const color = RANK_COLORS[rank]
                return (
                  <div key={entry.name} style={{flex:1,textAlign:'center'}}>
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
                    <div style={{fontSize:16}}>{RANK_ICONS[rank]}</div>
                    <div style={{height:heights[i],background:`linear-gradient(180deg,${color}33,${color}22)`,
                      border:`1.5px solid ${color}44`,borderRadius:'8px 8px 0 0',marginTop:4,
                      display:'flex',alignItems:'center',justifyContent:'center',
                      fontSize:11,fontWeight:700,color}}>
                      {entry.xp} XP
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Full list */}
            <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:16}}>
              {MOCK_WEEKLY.map(entry => {
                const title = getTitle(entry.level)
                const isTop3 = entry.rank <= 3
                return (
                  <div key={entry.rank}
                    style={{display:'flex',alignItems:'center',gap:10,
                      padding:'10px 12px',borderRadius:12,
                      background: entry.isYou
                        ? 'linear-gradient(135deg,rgba(27,138,143,0.08),rgba(42,191,191,0.06))'
                        : '#F8FAFC',
                      border: entry.isYou ? '1.5px solid #A7D9DB' : '1px solid #E2E8F0'}}>

                    {/* Rank */}
                    <div style={{width:28,textAlign:'center',fontSize:isTop3?16:13,
                      fontWeight:800,color: RANK_COLORS[entry.rank] ?? '#9CA3AF',flexShrink:0}}>
                      {isTop3 ? RANK_ICONS[entry.rank] : entry.rank}
                    </div>

                    {/* Avatar */}
                    <div style={{width:36,height:36,borderRadius:'50%',flexShrink:0,
                      background: entry.isYou
                        ? 'linear-gradient(135deg,#1B8A8F,#2ABFBF)'
                        : 'linear-gradient(135deg,#E2E8F0,#CBD5E1)',
                      display:'flex',alignItems:'center',justifyContent:'center',
                      fontSize:14,fontWeight:800,color: entry.isYou?'white':'#64748B'}}>
                      {entry.avatar}
                    </div>

                    {/* Name + title */}
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

                    {/* XP + streak */}
                    <div style={{textAlign:'right',flexShrink:0}}>
                      <div style={{fontSize:13,fontWeight:700,color:'#C9A84C'}}>{entry.xp} XP</div>
                      <div style={{fontSize:11,color:'#E8644B'}}>🔥 {entry.streak}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Your rank summary */}
            {youEntry && (
              <div style={{background:'linear-gradient(135deg,#F0FAFB,#E8F8F8)',
                border:'1.5px solid #A7D9DB',borderRadius:12,padding:'10px 14px',
                marginBottom:16,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:12,color:'#1B8A8F',fontWeight:700}}>
                  {isZh?`你的排名: #${youEntry.rank}`:`Your rank: #${youEntry.rank}`}
                </span>
                <span style={{fontSize:12,color:'#9CA3AF'}}>
                  {isZh?`距第${youEntry.rank-1}名还差 ${MOCK_WEEKLY[youEntry.rank-2]?.xp - youEntry.xp} XP`
                    :`${MOCK_WEEKLY[youEntry.rank-2]?.xp - youEntry.xp} XP to #${youEntry.rank-1}`}
                </span>
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
