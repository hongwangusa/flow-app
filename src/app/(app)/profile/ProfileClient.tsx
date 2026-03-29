'use client'
import { useState } from 'react'
import Link from 'next/link'
import GameBackground from '@/components/GameBackground'
import { xpForLevel } from '@/lib/xp'

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

interface Props {
  name: string
  level: number
  xpCurrent: number
  xpTotal: number
  streakCurrent: number
  streakBest: number
  tasksCompleted: number
  tasksTotal: number
}

export default function ProfileClient({ name, level, xpCurrent, xpTotal, streakCurrent, streakBest, tasksCompleted, tasksTotal }: Props) {
  const [lang, setLang] = useState<'en'|'zh'>('en')
  const isZh = lang === 'zh'
  const title = getLevelTitle(level)
  const xpNeeded = xpForLevel(level)
  const pct = xpNeeded > 0 ? Math.round((xpCurrent / xpNeeded) * 100) : 0

  // Achievements unlocked based on real data
  const achievements = [
    { icon:'🌟', en:'First Quest',    zh:'第一任务',  unlocked: tasksCompleted >= 1 },
    { icon:'🔥', en:'3-Day Streak',   zh:'三日连击',  unlocked: streakBest >= 3 },
    { icon:'⚔️', en:'Quest Master',  zh:'任务大师',  unlocked: tasksCompleted >= 10 },
    { icon:'📚', en:'Scholar',        zh:'学者',      unlocked: tasksCompleted >= 25 },
    { icon:'🏆', en:'Champion',       zh:'冠军',      unlocked: streakBest >= 7 },
    { icon:'💎', en:'Legend',         zh:'传说',      unlocked: level >= 10 },
  ]

  const card: React.CSSProperties = {
    background:'rgba(255,255,255,0.97)', borderRadius:24,
    padding:'32px 28px 24px', width:'100%', maxWidth:400,
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
        {/* Hero Avatar */}
        <div style={{textAlign:'center',marginBottom:20}}>
          <div style={{width:80,height:80,borderRadius:'50%',margin:'0 auto 12px',
            background:'linear-gradient(135deg,#1B8A8F,#2ABFBF)',
            border:'3px solid #C9A84C',display:'flex',alignItems:'center',
            justifyContent:'center',fontSize:32,fontWeight:900,color:'white',
            boxShadow:'0 4px 16px rgba(27,138,143,0.3)'}}>
            {name.charAt(0).toUpperCase()}
          </div>
          <h2 style={{fontSize:22,fontWeight:900,color:'#0D1B2A',marginBottom:6}}>{name}</h2>
          <span style={{background:'#F0FAFB',border:'1.5px solid #A7D9DB',borderRadius:99,
            padding:'3px 14px',fontSize:13,fontWeight:700,color:'#1B8A8F'}}>
            Lv.{level} · {isZh ? title.zh : title.en}
          </span>
        </div>

        {/* XP Bar */}
        <div style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:12,
          padding:'12px 16px',marginBottom:16}}>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:12,
            color:'#64748B',fontWeight:600,marginBottom:8}}>
            <span>{isZh?'下一等级':'XP to next level'}</span>
            <span>{xpCurrent} / {xpNeeded} XP</span>
          </div>
          <div style={{height:8,background:'#E2E8F0',borderRadius:99,overflow:'hidden'}}>
            <div style={{height:'100%',width:`${pct}%`,
              background:'linear-gradient(90deg,#1B8A8F,#C9A84C)',borderRadius:99,
              transition:'width 1s ease'}}/>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:20}}>
          {[
            { label:isZh?'等级':'Level',           value:level,                      color:'#1B8A8F' },
            { label:isZh?'总经验':'Total XP',      value:xpTotal,                     color:'#C9A84C' },
            { label:isZh?'当前连击':'🔥 Streak',   value:`${streakCurrent}d`,         color:'#E8644B' },
            { label:isZh?'最佳连击':'Best Streak',  value:`${streakBest}d`,            color:'#E8644B' },
            { label:isZh?'完成任务':'✅ Done',      value:tasksCompleted,              color:'#1B8A8F' },
            { label:isZh?'总任务':'Total Tasks',    value:tasksTotal,                  color:'#6B7280' },
          ].map(s => (
            <div key={s.label} style={{background:'#F8FAFC',border:'1px solid #E2E8F0',
              borderRadius:12,padding:'12px 10px',textAlign:'center'}}>
              <div style={{fontSize:20,fontWeight:800,color:s.color,marginBottom:3}}>{s.value}</div>
              <div style={{fontSize:11,color:'#9CA3AF',fontWeight:600}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <p style={{fontSize:12,fontWeight:700,color:'#64748B',textTransform:'uppercase',
          letterSpacing:.6,marginBottom:10}}>{isZh?'成就':'Achievements'}</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:8,marginBottom:20}}>
          {achievements.map(a => (
            <div key={a.en} title={isZh?a.zh:a.en}
              style={{aspectRatio:'1',borderRadius:12,display:'flex',alignItems:'center',
                justifyContent:'center',fontSize:20,
                background: a.unlocked ? '#F0FAFB' : '#F8FAFC',
                border: a.unlocked ? '1.5px solid #A7D9DB' : '1.5px solid #E2E8F0',
                opacity: a.unlocked ? 1 : 0.4,
                filter: a.unlocked ? 'none' : 'grayscale(1)'}}>
              {a.unlocked ? a.icon : '🔒'}
            </div>
          ))}
        </div>

        <div style={{display:'flex',gap:8,marginBottom:8}}>
          <Link href="/tasks"
            style={{flex:1,textAlign:'center',padding:'10px',
              background:'linear-gradient(135deg,#F5C842,#E8A020)',
              borderRadius:12,fontSize:13,fontWeight:700,color:'#1A1200',textDecoration:'none',
              boxShadow:'0 2px 8px rgba(232,160,32,0.3)'}}>
            {isZh?'⚔️ 任务':'⚔️ Quests'}
          </Link>
          <Link href="/dashboard"
            style={{flex:1,textAlign:'center',padding:'10px',background:'#F0FAFB',
              border:'1.5px solid #A7D9DB',borderRadius:12,fontSize:13,fontWeight:700,
              color:'#1B8A8F',textDecoration:'none'}}>
            {isZh?'🏠 主页':'🏠 Home'}
          </Link>
        </div>
        <p style={{textAlign:'center',marginTop:10,fontSize:11,color:'#C0CBDA'}}>v0.1 Beta · Flow / 流动</p>
      </div>
    </div>
  )
}
