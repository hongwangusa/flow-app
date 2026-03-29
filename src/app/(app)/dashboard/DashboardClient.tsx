'use client'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import GameBackground from '@/components/GameBackground'
import { signOut } from './actions'

interface Props {
  email: string
  userName: string
  level: number
  xpCurrent: number
  streakCurrent: number
  tasksDone?: number
  tasksPending?: number
  lang?: 'en' | 'zh'
}

const LEVEL_TITLES = [
  { min:1,  max:5,  en:'Initiate Disciple',    zh:'入门弟子' },
  { min:6,  max:15, en:'Foundation Builder',   zh:'筑基期' },
  { min:16, max:30, en:'Golden Core',           zh:'金丹期' },
  { min:31, max:50, en:'Nascent Soul',          zh:'元婴期' },
  { min:51, max:75, en:'Spirit Transformation', zh:'化神期' },
  { min:76, max:99, en:'Tribulation Crossing',  zh:'渡劫期' },
]
function getLevelTitle(level: number) {
  return LEVEL_TITLES.find(t => level >= t.min && level <= t.max) || LEVEL_TITLES[0]
}


export default function DashboardClient({ email, userName, level, xpCurrent, streakCurrent, tasksDone = 0, tasksPending = 0, lang: initialLang = 'en' }: Props) {
  const [lang, setLang] = useState<'en'|'zh'>(initialLang)
  const isZh = lang === 'zh'
  const [isPending, startTransition] = useTransition()
  const title = getLevelTitle(level)
  const xpTotal = level * 100
  const pct = xpTotal > 0 ? Math.round((xpCurrent / xpTotal) * 100) : 0
  const hour = new Date().getHours()
  const greeting = hour < 12 ? (isZh?'早上好':'Good morning') : hour < 18 ? (isZh?'下午好':'Good afternoon') : (isZh?'晚上好':'Good evening')

  const card: React.CSSProperties = {
    background:'rgba(255,255,255,0.97)', borderRadius:24,
    padding:'28px 28px 24px', width:'100%', maxWidth:480,
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
        {/* Top bar */}
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
          <div style={{width:44,height:44,borderRadius:'50%',background:'linear-gradient(135deg,#1B8A8F,#2ABFBF)',
            display:'flex',alignItems:'center',justifyContent:'center',
            fontSize:18,fontWeight:800,color:'white',flexShrink:0}}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:11,color:'#9CA3AF',fontWeight:600,textTransform:'uppercase',letterSpacing:.5}}>
              Flow / 流动
            </div>
            <div style={{display:'flex',alignItems:'center',gap:6}}>
              <span style={{fontSize:13,fontWeight:700,color:'#0D1B2A'}}>{userName}</span>
              <span style={{background:'#F0FAFB',border:'1px solid #A7D9DB',borderRadius:99,
                padding:'1px 8px',fontSize:11,fontWeight:700,color:'#1B8A8F'}}>
                Lv.{level} · {isZh ? title.zh : title.en}
              </span>
            </div>
          </div>
          <Link href="/profile" style={{fontSize:20,textDecoration:'none'}}>👤</Link>
        </div>

        {/* Greeting */}
        <h1 style={{fontSize:20,fontWeight:900,color:'#0D1B2A',marginBottom:4}}>
          {greeting}, {userName}! ⚔️
        </h1>
        <p style={{fontSize:13,color:'#8B9BB0',marginBottom:16}}>
          {isZh ? '今天也要继续你的冒险旅程！' : "Keep going on your adventure today!"}
        </p>

        {/* XP Bar */}
        <div style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:12,padding:'12px 16px',marginBottom:16}}>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'#64748B',fontWeight:600,marginBottom:8}}>
            <span>{isZh?`等级 ${level}`:`Level ${level}`} · {isZh?title.zh:title.en}</span>
            <span>{xpCurrent} / {xpTotal} XP</span>
          </div>
          <div style={{height:8,background:'#E2E8F0',borderRadius:99,overflow:'hidden'}}>
            <div style={{height:'100%',width:`${pct}%`,background:'linear-gradient(90deg,#1B8A8F,#C9A84C)',borderRadius:99,transition:'width 1s ease'}}/>
          </div>
        </div>

        {/* Stats row */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:20}}>
          {[
            { label:isZh?'等级':'Level',       value:level,              color:'#1B8A8F' },
            { label:isZh?'连击':'🔥 Streak',   value:streakCurrent,      color:'#E8644B' },
            { label:isZh?'待完成':'Pending',    value:tasksPending,       color:'#C9A84C' },
          ].map(s => (
            <div key={s.label} style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:12,
              padding:'12px 8px',textAlign:'center'}}>
              <div style={{fontSize:20,fontWeight:800,color:s.color,marginBottom:2}}>{s.value}</div>
              <div style={{fontSize:11,color:'#9CA3AF',fontWeight:600,textTransform:'uppercase',letterSpacing:.4}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick nav */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:20}}>
          {[
            { href:'/tasks',       icon:'⚔️', en:'Daily Quests',        zh:'每日任务',   primary:true  },
            { href:'/habits',      icon:'🔥', en:'Habit Tracker',       zh:'习惯追踪',   primary:false },
            { href:'/leaderboard', icon:'🏆', en:'Leaderboard',         zh:'排行榜',    primary:false },
            { href:'/social',      icon:'👥', en:'Social',              zh:'社交圈',    primary:false },
            { href:'/profile',     icon:'👤', en:'Profile',             zh:'个人资料',   primary:false },
            { href:'/tasks',       icon:'✅', en:`${tasksDone} Done`,   zh:`完成 ${tasksDone}`, primary:false },
          ].map(item => (
            <Link key={item.href + item.en} href={item.href}
              style={{display:'flex',alignItems:'center',gap:8,padding:'12px 14px',
                textDecoration:'none',borderRadius:12,fontSize:13,fontWeight:700,
                background: item.primary ? 'linear-gradient(135deg,#F5C842,#E8A020)' : '#F8FAFC',
                border: item.primary ? 'none' : '1px solid #E2E8F0',
                color: item.primary ? '#1A1200' : '#374151',
                boxShadow: item.primary ? '0 2px 8px rgba(232,160,32,0.3)' : 'none'}}>
              <span style={{fontSize:18}}>{item.icon}</span>
              {isZh ? item.zh : item.en}
            </Link>
          ))}
        </div>

        {/* Sign out */}
        <button onClick={() => startTransition(async () => { await signOut() })} disabled={isPending}
          style={{width:'100%',padding:'10px',background:'white',border:'1.5px solid #E2E8F0',
            borderRadius:12,fontSize:13,fontWeight:600,color:'#94A3B8',cursor:'pointer'}}>
          {isPending?(isZh?'退出中…':'Signing out…'):(isZh?'退出登录':'Sign out')}
        </button>
        <p style={{textAlign:'center',marginTop:10,fontSize:11,color:'#C0CBDA'}}>v0.1 Beta · Flow / 流动</p>
      </div>
    </div>
  )
}
