'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const t = {
  en: {
    title: 'Settings', subtitle: 'Customize your Flow experience',
    language: 'Language', langEn: 'English 🇺🇸', langZh: '中文 🇨🇳',
    coach: 'AI Coach Personality',
    personalities: { mentor: '🧙 Mentor — Wise guidance', cheerleader: '🎉 Cheerleader — Pure hype!', analyst: '📊 Analyst — Data-driven' },
    notifications: 'Notifications', notifDesc: 'Daily reminder to complete your habits',
    dangerZone: 'Account', signOut: 'Sign Out', signOutDesc: 'Sign out of Flow on this device',
    saved: '✓ Saved', saving: 'Saving...',
    back: '← Back',
    version: 'Flow v0.1 Beta'
  },
  zh: {
    title: '设置', subtitle: '自定义你的Flow体验',
    language: '语言', langEn: 'English 🇺🇸', langZh: '中文 🇨🇳',
    coach: 'AI教练个性',
    personalities: { mentor: '🧙 导师 — 智慧引导', cheerleader: '🎉 啦啦队 — 纯粹热情！', analyst: '📊 分析师 — 数据驱动' },
    notifications: '通知', notifDesc: '每日提醒完成你的习惯',
    dangerZone: '账户', signOut: '退出登录', signOutDesc: '在此设备上退出Flow',
    saved: '✓ 已保存', saving: '保存中...',
    back: '← 返回',
    version: 'Flow v0.1 Beta'
  }
}

export default function SettingsPage() {
  const router = useRouter()
  const [lang, setLangState] = useState<'en' | 'zh'>('en')
  const [personality, setPersonalityState] = useState<'mentor' | 'cheerleader' | 'analyst'>('mentor')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()
  const tx = t[lang]

  useEffect(() => {
    const stored = localStorage.getItem('flow-lang') as 'en' | 'zh' | null
    if (stored) setLangState(stored)
    // load profile settings
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('users').select('lang_preference, coach_personality').eq('id', user.id).single().then(({ data }) => {
        if (data?.lang_preference) setLangState(data.lang_preference as 'en' | 'zh')
        if (data?.coach_personality) setPersonalityState(data.coach_personality as 'mentor' | 'cheerleader' | 'analyst')
      })
    })
  }, [])

  const save = async (newLang?: 'en' | 'zh', newPersonality?: 'mentor' | 'cheerleader' | 'analyst') => {
    setSaving(true)
    const l = newLang ?? lang
    const p = newPersonality ?? personality
    localStorage.setItem('flow-lang', l)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('users').update({ lang_preference: l, coach_personality: p }).eq('id', user.id)
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLang = (l: 'en' | 'zh') => { setLangState(l); save(l, personality) }
  const handlePersonality = (p: 'mentor' | 'cheerleader' | 'analyst') => { setPersonalityState(p); save(lang, p) }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4F8', fontFamily: 'system-ui,sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#1B3A5C,#2196F3)', padding: '20px', color: 'white' }}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', fontSize: 14, cursor: 'pointer', marginBottom: 8, padding: 0 }}>
            {tx.back}
          </button>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{tx.title}</div>
          <div style={{ fontSize: 13, opacity: 0.8 }}>{tx.subtitle}</div>
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '20px 16px' }}>
        {/* Save indicator */}
        {(saving || saved) && (
          <div style={{ textAlign: 'center', padding: '8px', color: saving ? '#9CA3AF' : '#10B981', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            {saving ? tx.saving : tx.saved}
          </div>
        )}

        {/* Language */}
        <div style={{ background: 'white', borderRadius: 16, padding: '16px 20px', marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>{tx.language}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['en', 'zh'] as const).map(l => (
              <button key={l} onClick={() => handleLang(l)}
                style={{
                  flex: 1, padding: '10px', borderRadius: 12, border: '2px solid',
                  borderColor: lang === l ? '#2196F3' : '#E5E7EB',
                  background: lang === l ? '#EFF6FF' : 'white',
                  color: lang === l ? '#1B3A5C' : '#6B7280',
                  fontWeight: 700, fontSize: 14, cursor: 'pointer'
                }}>
                {l === 'en' ? tx.langEn : tx.langZh}
              </button>
            ))}
          </div>
        </div>

        {/* Coach personality */}
        <div style={{ background: 'white', borderRadius: 16, padding: '16px 20px', marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>{tx.coach}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(['mentor', 'cheerleader', 'analyst'] as const).map(p => (
              <button key={p} onClick={() => handlePersonality(p)}
                style={{
                  padding: '12px 14px', borderRadius: 12, border: '2px solid',
                  borderColor: personality === p ? '#2196F3' : '#E5E7EB',
                  background: personality === p ? '#EFF6FF' : 'white',
                  color: personality === p ? '#1B3A5C' : '#374151',
                  fontWeight: personality === p ? 700 : 500,
                  fontSize: 14, cursor: 'pointer', textAlign: 'left'
                }}>
                {tx.personalities[p]}
              </button>
            ))}
          </div>
        </div>

        {/* Sign out */}
        <div style={{ background: 'white', borderRadius: 16, padding: '16px 20px', marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>{tx.dangerZone}</div>
          <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 12 }}>{tx.signOutDesc}</div>
          <button onClick={signOut}
            style={{
              width: '100%', padding: '12px', borderRadius: 12,
              border: '2px solid #EF4444', background: 'white',
              color: '#EF4444', fontWeight: 700, fontSize: 14, cursor: 'pointer'
            }}>
            {tx.signOut}
          </button>
        </div>

        <div style={{ textAlign: 'center', color: '#C0CBDA', fontSize: 12, marginTop: 24 }}>
          {tx.version} · Built with ❤️
        </div>
      </div>
    </div>
  )
}
