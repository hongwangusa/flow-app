'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/dashboard', icon: '🏠', labelEn: 'Home',    labelZh: '主页' },
  { href: '/tasks',     icon: '⚔️', labelEn: 'Quests',  labelZh: '任务' },
  { href: '/habits',    icon: '🔥', labelEn: 'Habits',  labelZh: '习惯' },
  { href: '/coach',     icon: '🤖', labelEn: 'Coach',   labelZh: '教练' },
  { href: '/profile',   icon: '👤', labelEn: 'Profile', labelZh: '档案' },
]

export default function BottomNav({ lang = 'en' }: { lang?: 'en' | 'zh' }) {
  const pathname = usePathname()

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(255,255,255,0.97)',
      backdropFilter: 'blur(12px)',
      borderTop: '1px solid #F0F4F8',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
      display: 'flex', height: 64,
    }}>
      {NAV_ITEMS.map(item => {
        const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
        return (
          <Link key={item.href} href={item.href} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 2, textDecoration: 'none',
            color: active ? '#1B8A8F' : '#9CA3AF',
            position: 'relative',
            transition: 'color 0.15s',
          }}>
            {active && (
              <span style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: 32, height: 3, borderRadius: '0 0 4px 4px',
                background: 'linear-gradient(90deg,#1B8A8F,#2ABFBF)',
              }} />
            )}
            <span style={{
              fontSize: 22,
              transform: active ? 'scale(1.15)' : 'scale(1)',
              transition: 'transform 0.15s',
              filter: active ? 'none' : 'grayscale(40%)',
            }}>
              {item.icon}
            </span>
            <span style={{
              fontSize: 10, fontWeight: active ? 700 : 500,
              letterSpacing: 0.3,
            }}>
              {lang === 'zh' ? item.labelZh : item.labelEn}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
