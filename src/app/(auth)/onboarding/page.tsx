'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import GameBackground from '@/components/GameBackground'

type Gender = 'female' | 'nonbinary' | 'male'
type Coach = 'mentor' | 'cheerleader' | 'analyst'

const HEROES = [
  { id:'female' as Gender,  emoji:'🌸', label:'Female',    zh:'女侠',    color:'#E8644B', ring:'#F4B8AE' },
  { id:'nonbinary' as Gender, emoji:'✨', label:'Non-binary', zh:'无界者', color:'#8B5CF6', ring:'#C4B5FD' },
  { id:'male' as Gender,   emoji:'⚔️',  label:'Male',      zh:'勇士',    color:'#1B8A8F', ring:'#A7D9DB' },
]

const COACHES = [
  { id:'mentor' as Coach,      emoji:'🧙', label:'Mentor',      zh:'智者导师',  desc:'Wise guidance & strategy' },
  { id:'cheerleader' as Coach, emoji:'🌟', label:'Cheerleader', zh:'热情拉拉队', desc:'Energy & encouragement' },
  { id:'analyst' as Coach,     emoji:'📊', label:'Analyst',     zh:'数据分析师', desc:'Data-driven insights' },
]

export default function OnboardingPage() {
  const [lang, setLang] = useState<'en'|'zh'>('en')
  const isZh = lang === 'zh'
  const [gender, setGender] = useState<Gender>('female')
  const [coach, setCoach] = useState<Coach>('mentor')
  const [displayName, setDisplayName] = useState('')
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  async function handleSubmit() {
    if (!displayName.trim()) return
    setSaving(true)
    // TODO (Week 2): save gender + coach to users table via server action
    // For now, store in localStorage and redirect to dashboard
    localStorage.setItem('flow-gender', gender)
    localStorage.setItem('flow-coach', coach)
    localStorage.setItem('flow-display-name', displayName)
    router.push('/dashboard')
  }

  const card: React.CSSProperties = {
    background:'rgba(255,255,255,0.97)', borderRadius:24,
    padding:'36px 32px 28px', width:'100%', maxWidth:440,
    boxShadow:'0 24px 64px rgba(0,0,0,0.22)',
    position:'relative', zIndex:10,
  }

  const selectedHero = HEROES.find(h => h.id === gender)!

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
        {/* Brand + title */}
        <div style={{textAlign:'center',marginBottom:20}}>
          <div style={{fontSize:13,fontWeight:700,color:'#C9A84C',letterSpacing:1,textTransform:'uppercase',marginBottom:4}}>
            Flow / 流动
          </div>
          {/* Hero avatar preview */}
          <div style={{width:72,height:72,borderRadius:'50%',margin:'0 auto 12px',
            background:`${selectedHero.ring}`,border:`3px solid ${selectedHero.color}`,
            display:'flex',alignItems:'center',justifyContent:'center',fontSize:32,
            transition:'all .3s'}}>
            {selectedHero.emoji}
          </div>
          <h1 style={{fontSize:22,fontWeight:900,color:'#0D1B2A',marginBottom:4}}>
            {isZh ? '选择你的英雄' : 'Choose Your Hero'}
          </h1>
          <p style={{fontSize:13,color:'#8B9BB0'}}>
            {isZh ? '你的角色将陪伴你整个旅程' : 'Your character will journey with you'}
          </p>
        </div>

        {/* Hero selector */}
        <p style={{fontSize:12,fontWeight:700,color:'#64748B',textTransform:'uppercase',letterSpacing:.6,marginBottom:10}}>
          {isZh ? '选择角色' : 'Choose Your Character'}
        </p>
        <div style={{display:'flex',gap:10,marginBottom:20}}>
          {HEROES.map(h => (
            <button key={h.id} onClick={() => setGender(h.id)}
              style={{flex:1,padding:'12px 8px',borderRadius:14,border:`2px solid ${gender===h.id ? h.color : '#E2E8F0'}`,
                background: gender===h.id ? `${h.ring}40` : 'white',
                cursor:'pointer',transition:'all .2s',textAlign:'center'}}>
              <div style={{fontSize:24,marginBottom:4}}>{h.emoji}</div>
              <div style={{fontSize:12,fontWeight:700,color: gender===h.id ? h.color : '#64748B'}}>
                {isZh ? h.zh : h.label}
              </div>
            </button>
          ))}
        </div>

        {/* Display name */}
        <p style={{fontSize:12,fontWeight:700,color:'#64748B',textTransform:'uppercase',letterSpacing:.6,marginBottom:8}}>
          {isZh ? '你的英雄名称' : 'Hero Name'}
        </p>
        <input value={displayName} onChange={e => setDisplayName(e.target.value)}
          placeholder={isZh ? '起个酷的名字...' : 'Give yourself a cool name...'}
          style={{width:'100%',padding:'11px 14px',background:'#F8FAFC',border:'1.5px solid #E2E8F0',
            borderRadius:10,fontSize:14,color:'#0D1B2A',outline:'none',
            boxSizing:'border-box',marginBottom:20}}/>

        {/* Coach selector */}
        <p style={{fontSize:12,fontWeight:700,color:'#64748B',textTransform:'uppercase',letterSpacing:.6,marginBottom:10}}>
          {isZh ? '选择你的教练' : 'Choose Your Coach'}
        </p>
        <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:24}}>
          {COACHES.map(c => (
            <button key={c.id} onClick={() => setCoach(c.id)}
              style={{display:'flex',alignItems:'center',gap:12,padding:'11px 14px',
                borderRadius:12,border:`1.5px solid ${coach===c.id ? '#1B8A8F' : '#E2E8F0'}`,
                background: coach===c.id ? '#F0FAFB' : 'white',cursor:'pointer',transition:'all .2s',textAlign:'left'}}>
              <span style={{fontSize:22}}>{c.emoji}</span>
              <div>
                <div style={{fontSize:13,fontWeight:700,color: coach===c.id ? '#1B8A8F' : '#0D1B2A'}}>
                  {isZh ? c.zh : c.label}
                </div>
                <div style={{fontSize:11,color:'#94A3B8'}}>{c.desc}</div>
              </div>
              {coach===c.id && <span style={{marginLeft:'auto',color:'#1B8A8F',fontSize:18}}>✓</span>}
            </button>
          ))}
        </div>

        {/* CTA */}
        <button onClick={handleSubmit} disabled={saving || !displayName.trim()}
          style={{width:'100%',padding:'14px',background:'linear-gradient(135deg,#F5C842,#E8A020)',
            border:'none',borderRadius:14,fontSize:16,fontWeight:800,color:'#1A1200',
            cursor: displayName.trim() ? 'pointer' : 'not-allowed',
            boxShadow:'0 4px 16px rgba(232,160,32,0.4)',
            opacity: (!displayName.trim() || saving) ? 0.6 : 1,transition:'all .2s'}}>
          {saving ? (isZh?'进入中…':'Entering…') : (isZh ? '进入世界 🗡️' : 'Enter the World 🗡️')}
        </button>

        <p style={{textAlign:'center',marginTop:12,fontSize:11,color:'#C0CBDA'}}>
          v0.1 Beta · Flow / 流动
        </p>
      </div>
    </div>
  )
}
