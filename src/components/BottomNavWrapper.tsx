'use client'

import { useEffect, useState } from 'react'
import BottomNav from './BottomNav'

export default function BottomNavWrapper() {
  const [lang, setLang] = useState<'en' | 'zh'>('en')

  useEffect(() => {
    const stored = localStorage.getItem('flow-lang') as 'en' | 'zh' | null
    if (stored) setLang(stored)
  }, [])

  return <BottomNav lang={lang} />
}
