'use client'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import GameBackground from '@/components/GameBackground'
import { addTask, completeTask, deleteTask } from './actions'
import { xpForLevel } from '@/lib/xp'

type Task = {
  id: string
  title: string
  difficulty: string
  xp_reward: number
  is_completed: boolean
  completed_at: string | null
  category: string
  created_at: string
}

interface Props {
  tasks: Task[]
  level: number
  xpCurrent: number
  streakCurrent: number
}

const DIFF_CONFIG: Record<string, { label: string; zh: string; color: string; bg: string; border: string }> = {
  easy:   { label:'Easy',   zh:'简单', color:'#1B8A8F', bg:'#F0FAFB', border:'#A7D9DB' },
  medium: { label:'Medium', zh:'中等', color:'#C9A84C', bg:'#FFFBF0', border:'#E8D897' },
  hard:   { label:'Hard',   zh:'困难', color:'#E8644B', bg:'#FFF5F3', border:'#F5BDB3' },
}

export default function TasksClient({ tasks, level, xpCurrent, streakCurrent }: Props) {
  const [lang, setLang] = useState<'en'|'zh'>('en')
  const isZh = lang === 'zh'
  const [isPending, startTransition] = useTransition()
  const [showForm, setShowForm] = useState(false)
  const [diff, setDiff] = useState<'easy'|'medium'|'hard'>('medium')

  const pending = tasks.filter(t => !t.is_completed)
  const done    = tasks.filter(t => t.is_completed)
  const xpTotal = xpForLevel(level)
  const pct = xpTotal > 0 ? Math.round((xpCurrent / xpTotal) * 100) : 0

  const t = {
    title:    isZh ? '⚔️ 每日任务' : '⚔️ Daily Quests',
    add:      isZh ? '+ 新任务'    : '+ New Quest',
    cancel:   isZh ? '取消'        : 'Cancel',
    submit:   isZh ? '创建任务'    : 'Create Quest',
    placeholder: isZh ? '任务名称…' : 'Quest title…',
    pending:  isZh ? '进行中'      : 'Pending',
    done:     isZh ? '已完成'      : 'Completed',
    empty:    isZh ? '暂无任务，快添加一个吧！' : 'No quests yet — add your first!',
    back:     isZh ? '← 返回主页'  : '← Back to Dashboard',
    xpEarn:   isZh ? '获得XP'      : 'Earn XP',
  }

  const card: React.CSSProperties = {
    background:'rgba(255,255,255,0.97)', borderRadius:24,
    padding:'24px 24px 20px', width:'100%', maxWidth:480,
    boxShadow:'0 24px 64px rgba(0,0,0,0.22)',
    position:'relative', zIndex:10,
  }

  function handleComplete(id: string) {
    startTransition(async () => { await completeTask(id) })
  }
  function handleDelete(id: string) {
    startTransition(async () => { await deleteTask(id) })
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
          <h1 style={{fontSize:20,fontWeight:900,color:'#0D1B2A'}}>{t.title}</h1>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <span style={{fontSize:12,color:'#E8644B',fontWeight:700}}>🔥 {streakCurrent}</span>
            <span style={{fontSize:12,color:'#C9A84C',fontWeight:700}}>⭐ Lv.{level}</span>
          </div>
        </div>

        {/* XP bar */}
        <div style={{marginBottom:16}}>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#9CA3AF',marginBottom:5}}>
            <span>{isZh?'经验值':'XP'}</span>
            <span>{xpCurrent} / {xpTotal}</span>
          </div>
          <div style={{height:6,background:'#E2E8F0',borderRadius:99,overflow:'hidden'}}>
            <div style={{height:'100%',width:`${pct}%`,background:'linear-gradient(90deg,#1B8A8F,#C9A84C)',
              borderRadius:99,transition:'width .8s ease'}}/>
          </div>
        </div>

        {/* Add task button / form */}
        {!showForm ? (
          <button onClick={() => setShowForm(true)}
            style={{width:'100%',padding:'12px',marginBottom:20,
              background:'linear-gradient(135deg,#F5C842,#E8A020)',
              border:'none',borderRadius:14,fontSize:14,fontWeight:800,
              color:'#1A1200',cursor:'pointer',boxShadow:'0 4px 16px rgba(232,160,32,0.35)'}}>
            {t.add}
          </button>
        ) : (
          <form action={(fd) => { startTransition(async () => { await addTask(fd); setShowForm(false) }) }}
            style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:14,
              padding:'16px',marginBottom:20}}>
            <input name="title" required autoFocus placeholder={t.placeholder}
              style={{width:'100%',padding:'10px 12px',background:'white',
                border:'1.5px solid #E2E8F0',borderRadius:10,fontSize:14,
                color:'#0D1B2A',outline:'none',marginBottom:10,boxSizing:'border-box'}}/>

            {/* Difficulty picker */}
            <div style={{display:'flex',gap:6,marginBottom:12}}>
              {(['easy','medium','hard'] as const).map(d => {
                const c = DIFF_CONFIG[d]
                return (
                  <button key={d} type="button" onClick={() => setDiff(d)}
                    style={{flex:1,padding:'7px 4px',borderRadius:10,fontSize:12,fontWeight:700,
                      cursor:'pointer',transition:'all .15s',
                      background: diff===d ? c.bg : 'white',
                      border: `1.5px solid ${diff===d ? c.border : '#E2E8F0'}`,
                      color: diff===d ? c.color : '#9CA3AF'}}>
                    {isZh ? c.zh : c.label} · +{d==='easy'?10:d==='medium'?25:50} XP
                  </button>
                )
              })}
            </div>
            <input type="hidden" name="difficulty" value={diff}/>

            <div style={{display:'flex',gap:8}}>
              <button type="button" onClick={() => setShowForm(false)}
                style={{flex:1,padding:'10px',background:'white',border:'1.5px solid #E2E8F0',
                  borderRadius:10,fontSize:13,fontWeight:600,color:'#94A3B8',cursor:'pointer'}}>
                {t.cancel}
              </button>
              <button type="submit" disabled={isPending}
                style={{flex:2,padding:'10px',background:'linear-gradient(135deg,#1B8A8F,#2ABFBF)',
                  border:'none',borderRadius:10,fontSize:13,fontWeight:700,
                  color:'white',cursor:'pointer',opacity:isPending?0.7:1}}>
                {t.submit}
              </button>
            </div>
          </form>
        )}

        {/* Pending tasks */}
        <p style={{fontSize:11,fontWeight:700,color:'#9CA3AF',textTransform:'uppercase',
          letterSpacing:.6,marginBottom:8}}>
          {t.pending} ({pending.length})
        </p>

        {pending.length === 0 && (
          <div style={{textAlign:'center',padding:'20px 0',color:'#C0CBDA',fontSize:13}}>
            {t.empty}
          </div>
        )}

        <div style={{marginBottom:16}}>
          {pending.map(task => (
            <TaskRow key={task.id} task={task} isZh={isZh} isPending={isPending}
              onComplete={() => handleComplete(task.id)}
              onDelete={() => handleDelete(task.id)} />
          ))}
        </div>

        {/* Completed tasks */}
        {done.length > 0 && (
          <>
            <p style={{fontSize:11,fontWeight:700,color:'#9CA3AF',textTransform:'uppercase',
              letterSpacing:.6,marginBottom:8}}>
              {t.done} ({done.length})
            </p>
            <div style={{marginBottom:16,opacity:0.7}}>
              {done.slice(0, 5).map(task => (
                <TaskRow key={task.id} task={task} isZh={isZh} isPending={isPending}
                  onComplete={() => {}} onDelete={() => handleDelete(task.id)} />
              ))}
            </div>
          </>
        )}

        <Link href="/dashboard"
          style={{display:'block',textAlign:'center',fontSize:13,color:'#94A3B8',textDecoration:'none'}}>
          {t.back}
        </Link>
        <p style={{textAlign:'center',marginTop:8,fontSize:11,color:'#C0CBDA'}}>v0.1 Beta · Flow / 流动</p>
      </div>
    </div>
  )
}

function TaskRow({ task, isZh, isPending, onComplete, onDelete }: {
  task: Task; isZh: boolean; isPending: boolean
  onComplete: () => void; onDelete: () => void
}) {
  const diff = DIFF_CONFIG[task.difficulty] ?? DIFF_CONFIG.medium
  return (
    <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 0',
      borderBottom:'1px solid #F3F4F6'}}>
      {/* Complete button */}
      <button onClick={onComplete} disabled={isPending || task.is_completed}
        style={{width:32,height:32,borderRadius:'50%',flexShrink:0,cursor:'pointer',
          transition:'all .2s',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,
          background: task.is_completed ? '#1B8A8F' : '#F0FAFB',
          border: task.is_completed ? 'none' : '1.5px solid #A7D9DB',
          color: task.is_completed ? 'white' : '#1B8A8F'}}>
        {task.is_completed ? '✓' : '○'}
      </button>

      {/* Title + badges */}
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:14,fontWeight:600,color:'#0D1B2A',
          textDecoration: task.is_completed ? 'line-through' : 'none',
          whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
          {task.title}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:6,marginTop:3}}>
          <span style={{fontSize:11,fontWeight:700,padding:'1px 7px',borderRadius:6,
            color:diff.color,background:diff.bg,border:`1px solid ${diff.border}`}}>
            {isZh ? diff.zh : diff.label}
          </span>
          <span style={{fontSize:11,color:'#C9A84C',fontWeight:600}}>+{task.xp_reward} XP</span>
        </div>
      </div>

      {/* Delete */}
      <button onClick={onDelete} disabled={isPending}
        style={{background:'none',border:'none',cursor:'pointer',
          fontSize:16,color:'#E2E8F0',padding:'4px',borderRadius:6,
          transition:'color .15s'}}
        onMouseEnter={e => (e.currentTarget.style.color='#E8644B')}
        onMouseLeave={e => (e.currentTarget.style.color='#E2E8F0')}>
        ✕
      </button>
    </div>
  )
}
