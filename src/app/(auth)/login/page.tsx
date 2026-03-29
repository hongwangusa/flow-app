'use client'
import { useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import GameBackground from '@/components/GameBackground'
import { signInWithEmail, signInWithGoogle, signInWithFacebook, signInWithApple } from './actions'

const LEVEL_TITLES: Record<string, string> = {
  en: 'Welcome Back, Explorer',
  zh: '欢迎回来，探险者',
}

export default function LoginPage() {
  const [lang, setLang] = useState<'en'|'zh'>('en')
  const isZh = lang === 'zh'
  const [showPw, setShowPw] = useState(false)
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const t = {
    brand: 'Flow / 流动',
    title: isZh ? '欢迎回来，探险者' : 'Welcome Back, Explorer',
    subtitle: isZh ? '继续你的冒险旅程' : 'Continue your adventure',
    apple: isZh ? '使用 Apple 登录' : 'Sign in with Apple',
    google: isZh ? '使用 Google 登录' : 'Sign in with Google',
    facebook: isZh ? '使用 Facebook 登录' : 'Sign in with Facebook',
    divider: isZh ? '或使用邮箱' : 'or use email',
    email: isZh ? '邮箱地址' : 'Email address',
    password: isZh ? '密码' : 'Password',
    cta: isZh ? '进入世界 ⚔️' : 'Enter the World ⚔️',
    noAccount: isZh ? '还没有账号？' : "Don't have an account?",
    register: isZh ? '创建角色' : 'Create Character',
    errors: {
      invalid_credentials: isZh ? '邮箱或密码错误' : 'Invalid email or password',
      default: isZh ? '登录失败，请重试' : 'Sign in failed. Please try again.',
    }
  }

  function handleOAuth(provider: 'google'|'facebook'|'apple') {
    startTransition(async () => {
      if (provider === 'google') await signInWithGoogle()
      else if (provider === 'facebook') await signInWithFacebook()
      else await signInWithApple()
    })
  }

  const card: React.CSSProperties = {
    background: 'rgba(255,255,255,0.97)',
    borderRadius: 24,
    padding: '36px 32px 28px',
    width: '100%',
    maxWidth: 400,
    boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
    position: 'relative',
    zIndex: 10,
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <GameBackground />

      {/* Lang toggle */}
      <button onClick={() => setLang(isZh ? 'en' : 'zh')}
        style={{position:'fixed',top:18,right:18,zIndex:20,background:'rgba(255,255,255,0.85)',
          border:'1px solid rgba(255,255,255,0.6)',borderRadius:20,padding:'5px 14px',
          fontSize:13,fontWeight:600,cursor:'pointer',backdropFilter:'blur(8px)'}}>
        {isZh ? 'EN' : '中文'}
      </button>

      <div style={card}>
        {/* Brand */}
        <div style={{textAlign:'center',marginBottom:6}}>
          <div style={{fontSize:13,fontWeight:700,color:'#1B8A8F',letterSpacing:1,textTransform:'uppercase',marginBottom:2}}>
            {t.brand}
          </div>
          <h1 style={{fontSize:22,fontWeight:900,color:'#0D1B2A',marginBottom:4}}>{t.title}</h1>
          <p style={{fontSize:13,color:'#8B9BB0',marginBottom:20}}>{t.subtitle}</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:10,
            padding:'10px 14px',marginBottom:16,fontSize:13,color:'#DC2626'}}>
            {t.errors[error as keyof typeof t.errors] || t.errors.default}
          </div>
        )}

        {/* Social buttons */}
        {(['apple','google','facebook'] as const).map(p => (
          <button key={p} onClick={() => handleOAuth(p)} disabled={isPending}
            style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',
              gap:10,padding:'11px 16px',marginBottom:10,background:'white',
              border:'1.5px solid #E2E8F0',borderRadius:12,fontSize:14,fontWeight:600,
              color:'#1A2332',cursor:'pointer',transition:'all .15s'}}>
            <span style={{fontSize:18}}>
              {p==='apple'?'🍎':p==='google'?'🔵':'🔷'}
            </span>
            {p==='apple'?t.apple:p==='google'?t.google:t.facebook}
          </button>
        ))}

        {/* Divider */}
        <div style={{display:'flex',alignItems:'center',gap:10,margin:'14px 0'}}>
          <div style={{flex:1,height:1,background:'#E2E8F0'}}/>
          <span style={{fontSize:12,color:'#94A3B8',whiteSpace:'nowrap'}}>{t.divider}</span>
          <div style={{flex:1,height:1,background:'#E2E8F0'}}/>
        </div>

        {/* Email/Password form */}
        <form action={async (fd) => {
          startTransition(async () => { await signInWithEmail(fd) })
        }}>
          <div style={{marginBottom:12}}>
            <label style={{fontSize:12,fontWeight:600,color:'#64748B',display:'block',marginBottom:5}}>
              {t.email}
            </label>
            <input name="email" type="email" required placeholder={isZh?'your@email.com':'your@email.com'}
              style={{width:'100%',padding:'11px 14px',background:'#F8FAFC',border:'1.5px solid #E2E8F0',
                borderRadius:10,fontSize:14,color:'#0D1B2A',outline:'none',boxSizing:'border-box'}}/>
          </div>
          <div style={{marginBottom:18,position:'relative'}}>
            <label style={{fontSize:12,fontWeight:600,color:'#64748B',display:'block',marginBottom:5}}>
              {t.password}
            </label>
            <input name="password" type={showPw?'text':'password'} required
              placeholder="••••••••"
              style={{width:'100%',padding:'11px 42px 11px 14px',background:'#F8FAFC',
                border:'1.5px solid #E2E8F0',borderRadius:10,fontSize:14,color:'#0D1B2A',
                outline:'none',boxSizing:'border-box'}}/>
            <button type="button" onClick={() => setShowPw(!showPw)}
              style={{position:'absolute',right:12,top:30,background:'none',border:'none',
                cursor:'pointer',fontSize:16,color:'#94A3B8'}}>
              {showPw?'🙈':'👁️'}
            </button>
          </div>

          {/* Gold CTA */}
          <button type="submit" disabled={isPending}
            style={{width:'100%',padding:'14px',background:'linear-gradient(135deg,#F5C842,#E8A020)',
              border:'none',borderRadius:14,fontSize:16,fontWeight:800,color:'#1A1200',
              cursor:'pointer',boxShadow:'0 4px 16px rgba(232,160,32,0.4)',
              opacity:isPending?0.7:1,transition:'all .2s',letterSpacing:.3}}>
            {isPending ? (isZh?'登录中…':'Signing in…') : t.cta}
          </button>
        </form>

        {/* Footer link */}
        <p style={{textAlign:'center',marginTop:18,fontSize:13,color:'#8B9BB0'}}>
          {t.noAccount}{' '}
          <Link href="/register" style={{color:'#1B8A8F',fontWeight:700,textDecoration:'none'}}>
            {t.register}
          </Link>
        </p>

        <p style={{textAlign:'center',marginTop:10,fontSize:11,color:'#C0CBDA'}}>
          v0.1 Beta · Flow / 流动
        </p>
      </div>
    </div>
  )
}
