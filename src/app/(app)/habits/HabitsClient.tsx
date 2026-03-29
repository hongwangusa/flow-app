'use client'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import GameBackground from '@/components/GameBackground'
import { addHabit, completeHabit, deleteHabit } from './actions'
import { xpForLevel } from '@/lib/xp'

type Habit = {
  id: string
  title: string
  title_zh: string | null
  xp_reward: number
  streak_count: number
  last_completed_date: string | null
  done_today: boolean
}

interface Props {
  habits: Habit[]
  level: number
  xpCurrent: number
  streakCurrent: number
}

export default function HabitsClient({ habits, level, xpCurrent, streakCurrent }: Props) {
  const [lang, setLang] = useState<'en'|'zh'>('en')
  const isZh = lang === 'zh'
  const [isPending, startTransition] = useTransition()
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState<number|null>(null)

  const xpTotal = xpForLevel(level)
  const pct = xpTotal > 0 ? Math.round((xpCurrent / xpTotal) * 100) : 0
  const doneCount = habits.filter(h => h.done_today).length

  function handleComplete(id: string, xpReward: number) {
    startTransition(async () => {
      await completeHabit(id)
      setToast(xpReward)
      setTimeout(() => setToast(null), 2000)
    })
  }
  function handleDelete(id: string) {
    startTransition(async () => { await deleteHabit(id) })
  }

  const card: React.CSSProperties = {
    background:'rgba(255,255,255,0.97)', borderRadius:24,
    padding:'24px 24px 20px', width:'100%', maxWidth:460,
    boxShadow:'0 24px 64px rgba(0,0,0,0.22)',
    position:'relative', zIndex:10,
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <GameBackground />

      {/* XP Toast */}
      {toast !== null && (
        <div style={{position:'fixed',top:60,right:18,zIndex:30,
          background:'linear-gradient(135deg,#F5C842,#E8A020)',
          borderRadius:99,padding:'8px 18px',fontWeight:800,fontSize:14,color:'#1A1200',
          boxShadow:'0 4px 16px rgba(232,160,32,0.4)'}}>
          +{toast} XP ⭐
        </div>
      )}

      <button onClick={() => setLang(isZh?'en':'zh')}
        style={{position:'fixed',top:18,right:18,zIndex:20,background:'rgba(255,255,255,0.85)',
          border:'1px solid rgba(255,255,255,0.6)',borderRadius:20,padding:'5px 14px',
          fontSize:13,fontWeight:600,cursor:'pointer',backdropFilter:'blur(8px)'}}>
        {isZh?'EN':'中文'}
      </button>

      <div style={card}>
        {/* Header */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
          <h1 style={{fontSize:20,fontWeight:900,color:'#0D1B2A'}}>
            {isZh?'习惯追踪':'Habit Tracker'} 🔥
          </h1>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <span style={{fontSize:12,color:'#E8644B',fontWeight:700}}>🔥 {streakCurrent}</span>
            <span style={{fontSize:12,color:'#C9A84C',fontWeight:700}}>⭐ Lv.{level}</span>
          </div>
        </div>

        {/* XP bar */}
        <div style={{marginBottom:14}}>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#9CA3AF',marginBottom:5}}>
            <span>{isZh?'经验值':'XP'}</span>
            <span>{xpCurrent} / {xpTotal}</span>
          </div>
          <div style={{height:6,background:'#E2E8F0',borderRadius:99,overflow:'hidden'}}>
            <div style={{height:'100%',width:`${pct}%`,
              background:'linear-gradient(90deg,#1B8A8F,#C9A84C)',borderRadius:99,transition:'width .8s ease'}}/>
          </div>
        </div>

        {/* Today progress */}
        <div style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:12,
          padding:'10px 16px',marginBottom:16,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{fontSize:13,color:'#64748B',fontWeight:600}}>
            {isZh?`今日 ${doneCount}/${habits.length} 完成`:`Today: ${doneCount}/${habits.length} done`}
          </span>
          {doneCount === habits.length && habits.length > 0 && (
            <span style={{fontSize:12,color:'#1B8A8F',fontWeight:700}}>
              {isZh?'🎉 全部完成！':'🎉 All done!'}
            </span>
          )}
        </div>

        {/* Add habit */}
        {!showForm ? (
          <button onClick={() => setShowForm(true)}
            style={{width:'100%',padding:'11px',marginBottom:16,
              background:'linear-gradient(135deg,#F5C842,#E8A020)',
              border:'none',borderRadius:14,fontSize:14,fontWeight:800,
              color:'#1A1200',cursor:'pointer',boxShadow:'0 4px 16px rgba(232,160,32,0.35)'}}>
            {isZh?'+ 新习惯':'+ New Habit'}
          </button>
        ) : (
          <form action={(fd) => { startTransition(async () => { await addHabit(fd); setShowForm(false) }) }}
            style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:14,
              padding:'14px',marginBottom:16,display:'flex',gap:8}}>
            <input name="title" required autoFocus
              placeholder={isZh?'习惯名称…':'Habit name…'}
              style={{flex:1,padding:'9px 12px',background:'white',
                border:'1.5px solid #E2E8F0',borderRadius:10,fontSize:14,
                color:'#0D1B2A',outline:'none'}}/>
            <button type="button" onClick={() => setShowForm(false)}
              style={{padding:'9px 12px',background:'white',border:'1.5px solid #E2E8F0',
                borderRadius:10,fontSize:13,color:'#94A3B8',cursor:'pointer'}}>
              {isZh?'取消':'Cancel'}
            </button>
            <button type="submit" disabled={isPending}
              style={{padding:'9px 14px',background:'linear-gradient(135deg,#1B8A8F,#2ABFBF)',
                border:'none',borderRadius:10,fontSize:13,fontWeight:700,
                color:'white',cursor:'pointer'}}>
              {isZh?'添加':'Add'}
            </button>
          </form>
        )}

        {/* Habit list */}
        {habits.length === 0 ? (
          <div style={{textAlign:'center',padding:'24px 0',color:'#C0CBDA',fontSize:13}}>
            {isZh?'还没有习惯，快添加一个吧！':'No habits yet — add your first!'}
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:20}}>
            {habits.map(h => (
              <div key={h.id} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',
                background: h.done_today ? '#F0FAFB' : 'white',
                border:`1.5px solid ${h.done_today ? '#A7D9DB' : '#E2E8F0'}`,
                borderRadius:14,transition:'all .2s'}}>

                <button onClick={() => !h.done_today && handleComplete(h.id, h.xp_reward)}
                  disabled={isPending || h.done_today}
                  style={{width:38,height:38,borderRadius:'50%',flexShrink:0,cursor: h.done_today?'default':'pointer',
                    transition:'all .2s',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,
                    background: h.done_today ? '#1B8A8F' : '#F0FAFB',
                    border: h.done_today ? 'none' : '1.5px solid #A7D9DB',
                    color: h.done_today ? 'white' : '#1B8A8F'}}>
                  {h.done_today ? '✓' : '○'}
                </button>

                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:600,color: h.done_today?'#1B8A8F':'#0D1B2A',
                    textDecoration: h.done_today?'line-through':'none',
                    whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                    {isZh && h.title_zh ? h.title_zh : h.title}
                  </div>
                  <div style={{display:'flex',gap:8,marginTop:3}}>
                    <span style={{fontSize:11,color:'#E8644B',fontWeight:600}}>
                      🔥 {h.streak_count} {isZh?'天':'days'}
                    </span>
                    <span style={{fontSize:11,color:'#C9A84C',fontWeight:600}}>
                      +{h.xp_reward} XP
                    </span>
                  </div>
                </div>

                <button onClick={() => handleDelete(h.id)} disabled={isPending}
                  style={{background:'none',border:'none',cursor:'pointer',
                    fontSize:14,color:'#E2E8F0',padding:'4px',borderRadius:6}}
                  onMouseEnter={e => (e.currentTarget.style.color='#E8644B')}
                  onMouseLeave={e => (e.currentTarget.style.color='#E2E8F0')}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{display:'flex',gap:8}}>
          <Link href="/tasks"
            style={{flex:1,textAlign:'center',padding:'10px',
              background:'linear-gradient(135deg,#F5C842,#E8A020)',
              borderRadius:12,fontSize:13,fontWeight:700,color:'#1A1200',textDecoration:'none'}}>
            {isZh?'⚔️ 任务':'⚔️ Quests'}
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
