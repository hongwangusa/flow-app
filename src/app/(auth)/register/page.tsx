'use client'
import { useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import GameBackground from '@/components/GameBackground'
import { signUpWithEmail, signUpWithGoogle, signUpWithFacebook, signUpWithApple } from './actions'

export default function RegisterPage() {
  const [lang, setLang] = useState<'en'|'zh'>('en')
  const isZh = lang === 'zh'
  const [showPw, setShowPw] = useState(false)
  const [showPw2, setShowPw2] = useState(false)
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const success = searchParams.get('success')

  const t = {
    brand: 'Flow / 流动',
    title: isZh ? '开始你的旅程' : 'Begin Your Journey',
    subtitle: isZh ? '创建你的英雄账号' : 'Create your hero account',
    apple: isZh ? '使用 Apple 注册' : 'Sign up with Apple',
    google: isZh ? '使用 Google 注册' : 'Sign up with Google',
    facebook: isZh ? '使用 Facebook 注册' : 'Sign up with Facebook',
    divider: isZh ? '或使用邮箱' : 'or use email',
    name: isZh ? '你的名字' : 'Your name',
    email: isZh ? '邮箱地址' : 'Email address',
    password: isZh ? '密码（至少8位）' : 'Password (min 8 chars)',
    confirm: isZh ? '确认密码' : 'Confirm password',
    cta: isZh ? '创建英雄 ✨' : 'Create My Hero ✨',
    hasAccount: isZh ? '已有账号？' : 'Already have an account?',
    login: isZh ? '去登录' : 'Sign in',
    checkEmail: isZh ? '请检查邮箱，点击确认链接以激活账号 🎉' : 'Check your email and click the confirmation link to activate! 🎉',
    errors: {
      missing_fields: isZh?'请填写所有字段':'Please fill in all fields',
      passwords_do_not_match: isZh?'两次密码不一致':'Passwords do not match',
      password_too_short: isZh?'密码至少需要8位':'Password must be at least 8 characters',
      'User already registered': isZh?'该邮箱已注册，请直接登录':'Email already registered. Please sign in.',
      default: isZh?'注册失败，请重试':'Sign up failed. Please try again.',
    }
  }

  const card: React.CSSProperties = {
    background:'rgba(255,255,255,0.97)', borderRadius:24,
    padding:'32px 32px 24px', width:'100%', maxWidth:400,
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
        <div style={{textAlign:'center',marginBottom:6}}>
          <div style={{fontSize:13,fontWeight:700,color:'#C9A84C',letterSpacing:1,textTransform:'uppercase',marginBottom:2}}>
            {t.brand}
          </div>
          <h1 style={{fontSize:22,fontWeight:900,color:'#0D1B2A',marginBottom:4}}>{t.title}</h1>
          <p style={{fontSize:13,color:'#8B9BB0',marginBottom:18}}>{t.subtitle}</p>
        </div>

        {success==='check_email' && (
          <div style={{background:'#F0FDF4',border:'1px solid #86EFAC',borderRadius:10,
            padding:'10px 14px',marginBottom:16,fontSize:13,color:'#166534',textAlign:'center'}}>
            {t.checkEmail}
          </div>
        )}
        {error && (
          <div style={{background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:10,
            padding:'10px 14px',marginBottom:16,fontSize:13,color:'#DC2626'}}>
            {t.errors[error as keyof typeof t.errors] || t.errors.default}
          </div>
        )}

        {(['apple','google','facebook'] as const).map(p => (
          <div key={p} title={isZh ? '即将推出' : 'Coming soon — use email for now'}
            style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',
              gap:10,padding:'10px 16px',marginBottom:9,background:'#F8FAFC',
              border:'1.5px solid #E2E8F0',borderRadius:12,fontSize:14,fontWeight:600,
              color:'#C0CBDA',cursor:'not-allowed',userSelect:'none',
              position:'relative'}}>
            <span style={{fontSize:18,opacity:0.4}}>{p==='apple'?'🍎':p==='google'?'🔵':'🔷'}</span>
            <span style={{opacity:0.5}}>{p==='apple'?t.apple:p==='google'?t.google:t.facebook}</span>
            <span style={{position:'absolute',right:12,fontSize:10,color:'#C9A84C',fontWeight:700,
              background:'#FFFBF0',border:'1px solid #E8D897',borderRadius:4,padding:'1px 5px'}}>
              {isZh?'即将推出':'Soon'}
            </span>
          </div>
        ))}

        <div style={{display:'flex',alignItems:'center',gap:10,margin:'12px 0'}}>
          <div style={{flex:1,height:1,background:'#E2E8F0'}}/>
          <span style={{fontSize:12,color:'#94A3B8'}}>{t.divider}</span>
          <div style={{flex:1,height:1,background:'#E2E8F0'}}/>
        </div>

        <form action={async (fd) => { startTransition(async () => { await signUpWithEmail(fd) }) }}>
          {[
            {name:'name', label:t.name, type:'text', placeholder:isZh?'你的名字':'Your name'},
            {name:'email', label:t.email, type:'email', placeholder:'you@email.com'},
          ].map(f => (
            <div key={f.name} style={{marginBottom:11}}>
              <label style={{fontSize:12,fontWeight:600,color:'#64748B',display:'block',marginBottom:4}}>{f.label}</label>
              <input name={f.name} type={f.type} required placeholder={f.placeholder}
                style={{width:'100%',padding:'10px 14px',background:'#F8FAFC',border:'1.5px solid #E2E8F0',
                  borderRadius:10,fontSize:14,color:'#0D1B2A',outline:'none',boxSizing:'border-box'}}/>
            </div>
          ))}

          {/* Password */}
          <div style={{marginBottom:11,position:'relative'}}>
            <label style={{fontSize:12,fontWeight:600,color:'#64748B',display:'block',marginBottom:4}}>{t.password}</label>
            <input name="password" type={showPw?'text':'password'} required placeholder="••••••••"
              style={{width:'100%',padding:'10px 40px 10px 14px',background:'#F8FAFC',border:'1.5px solid #E2E8F0',
                borderRadius:10,fontSize:14,color:'#0D1B2A',outline:'none',boxSizing:'border-box'}}/>
            <button type="button" onClick={()=>setShowPw(!showPw)}
              style={{position:'absolute',right:10,top:28,background:'none',border:'none',cursor:'pointer',fontSize:15,color:'#94A3B8'}}>
              {showPw?'🙈':'👁️'}
            </button>
          </div>
          <div style={{marginBottom:18,position:'relative'}}>
            <label style={{fontSize:12,fontWeight:600,color:'#64748B',display:'block',marginBottom:4}}>{t.confirm}</label>
            <input name="confirmPassword" type={showPw2?'text':'password'} required placeholder="••••••••"
              style={{width:'100%',padding:'10px 40px 10px 14px',background:'#F8FAFC',border:'1.5px solid #E2E8F0',
                borderRadius:10,fontSize:14,color:'#0D1B2A',outline:'none',boxSizing:'border-box'}}/>
            <button type="button" onClick={()=>setShowPw2(!showPw2)}
              style={{position:'absolute',right:10,top:28,background:'none',border:'none',cursor:'pointer',fontSize:15,color:'#94A3B8'}}>
              {showPw2?'🙈':'👁️'}
            </button>
          </div>

          <button type="submit" disabled={isPending}
            style={{width:'100%',padding:'14px',background:'linear-gradient(135deg,#F5C842,#E8A020)',
              border:'none',borderRadius:14,fontSize:16,fontWeight:800,color:'#1A1200',
              cursor:'pointer',boxShadow:'0 4px 16px rgba(232,160,32,0.4)',opacity:isPending?0.7:1}}>
            {isPending?(isZh?'创建中…':'Creating…'):t.cta}
          </button>
        </form>

        <p style={{textAlign:'center',marginTop:16,fontSize:13,color:'#8B9BB0'}}>
          {t.hasAccount}{' '}
          <Link href="/login" style={{color:'#1B8A8F',fontWeight:700,textDecoration:'none'}}>{t.login}</Link>
        </p>
        <p style={{textAlign:'center',marginTop:8,fontSize:11,color:'#C0CBDA'}}>v0.1 Beta · Flow / 流动</p>
      </div>
    </div>
  )
}
