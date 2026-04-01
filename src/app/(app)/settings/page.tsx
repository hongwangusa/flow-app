'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const copy = {
  en: {
    title: 'Settings',
    subtitle: 'Customize your Flow experience',
    language: 'Language',
    langEn: 'English',
    langZh: 'Chinese',
    coach: 'AI Coach Personality',
    personalities: {
      mentor: 'Mentor • calm guidance',
      cheerleader: 'Cheerleader • high energy',
      analyst: 'Analyst • practical feedback',
    },
    account: 'Account',
    signOut: 'Sign Out',
    signOutDesc: 'Sign out of Flow on this device',
    saved: 'Saved',
    saving: 'Saving...',
    back: 'Back',
    version: 'Flow v0.1 Beta',
  },
  zh: {
    title: '设置',
    subtitle: '自定义你的 Flow 体验',
    language: '语言',
    langEn: 'English',
    langZh: '中文',
    coach: 'AI 教练风格',
    personalities: {
      mentor: '导师 • 稳定指引',
      cheerleader: '打气王 • 高能鼓励',
      analyst: '分析师 • 实用反馈',
    },
    account: '账户',
    signOut: '退出登录',
    signOutDesc: '在这台设备上退出 Flow',
    saved: '已保存',
    saving: '保存中...',
    back: '返回',
    version: 'Flow v0.1 Beta',
  },
}

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [lang, setLangState] = useState<'en' | 'zh'>('en')
  const [personality, setPersonalityState] = useState<'mentor' | 'cheerleader' | 'analyst'>('mentor')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const text = copy[lang]

  useEffect(() => {
    const stored = localStorage.getItem('flow-lang') as 'en' | 'zh' | null
    if (stored) setLangState(stored)

    void supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      void supabase
        .from('users')
        .select('lang_preference, coach_personality')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data?.lang_preference) setLangState(data.lang_preference as 'en' | 'zh')
          if (data?.coach_personality) setPersonalityState(data.coach_personality as 'mentor' | 'cheerleader' | 'analyst')
        })
    })
  }, [supabase])

  const save = async (nextLang?: 'en' | 'zh', nextPersonality?: 'mentor' | 'cheerleader' | 'analyst') => {
    setSaving(true)
    const resolvedLang = nextLang ?? lang
    const resolvedPersonality = nextPersonality ?? personality
    localStorage.setItem('flow-lang', resolvedLang)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('users').update({ lang_preference: resolvedLang, coach_personality: resolvedPersonality }).eq('id', user.id)
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4F8', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ background: 'linear-gradient(135deg,#1B3A5C,#2196F3)', padding: 20, color: 'white' }}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', fontSize: 14, cursor: 'pointer', marginBottom: 8, padding: 0 }}>
            {text.back}
          </button>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{text.title}</div>
          <div style={{ fontSize: 13, opacity: 0.8 }}>{text.subtitle}</div>
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '20px 16px' }}>
        {(saving || saved) && (
          <div style={{ textAlign: 'center', padding: 8, color: saving ? '#9CA3AF' : '#10B981', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            {saving ? text.saving : text.saved}
          </div>
        )}

        <div style={{ background: 'white', borderRadius: 16, padding: '16px 20px', marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>{text.language}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['en', 'zh'] as const).map((option) => (
              <button
                key={option}
                onClick={() => {
                  setLangState(option)
                  void save(option, personality)
                }}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 12,
                  border: '2px solid',
                  borderColor: lang === option ? '#2196F3' : '#E5E7EB',
                  background: lang === option ? '#EFF6FF' : 'white',
                  color: lang === option ? '#1B3A5C' : '#6B7280',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                {option === 'en' ? text.langEn : text.langZh}
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: 16, padding: '16px 20px', marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>{text.coach}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(['mentor', 'cheerleader', 'analyst'] as const).map((option) => (
              <button
                key={option}
                onClick={() => {
                  setPersonalityState(option)
                  void save(lang, option)
                }}
                style={{
                  padding: '12px 14px',
                  borderRadius: 12,
                  border: '2px solid',
                  borderColor: personality === option ? '#2196F3' : '#E5E7EB',
                  background: personality === option ? '#EFF6FF' : 'white',
                  color: personality === option ? '#1B3A5C' : '#374151',
                  fontWeight: personality === option ? 700 : 500,
                  fontSize: 14,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                {text.personalities[option]}
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: 16, padding: '16px 20px', marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>{text.account}</div>
          <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 12 }}>{text.signOutDesc}</div>
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/login')
            }}
            style={{ width: '100%', padding: 12, borderRadius: 12, border: '2px solid #EF4444', background: 'white', color: '#EF4444', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
          >
            {text.signOut}
          </button>
        </div>

        <div style={{ textAlign: 'center', color: '#C0CBDA', fontSize: 12, marginTop: 24 }}>{text.version}</div>
      </div>
    </div>
  )
}
