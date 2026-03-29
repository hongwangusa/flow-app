# AI Handoff Spec — Flow / 流动
> Paste this entire file into ChatGPT / Gemini / DeepSeek to build the remaining pages.
> Last updated: 2026-03-26

---

## YOUR JOB
Build 3 React/Next.js pages for a bilingual gamified habit tracker called **Flow / 流动**.
Write each page as a `.tsx` file. All pages already have a shared GameBackground component.

---

## TECH STACK
- Next.js 14 (App Router), TypeScript, inline styles only (no Tailwind classes)
- `'use client'` directive at top of every page
- Import: `import GameBackground from '@/components/GameBackground'`
- Import: `import Link from 'next/link'`
- All pages are bilingual: EN/ZH toggle via `useState<'en'|'zh'>('en')`

---

## DESIGN SYSTEM — FOLLOW EXACTLY

### Card (white floating card over landscape)
```ts
background: 'rgba(255,255,255,0.97)'
borderRadius: 24
padding: '36px 32px 28px'
maxWidth: 440 (profile/dashboard) or 380 (narrow)
boxShadow: '0 24px 64px rgba(0,0,0,0.22)'
position: 'relative', zIndex: 10
```

### Brand colors
- Navy (primary text): #0D1B2A
- Teal (primary accent): #1B8A8F
- Teal light: #2ABFBF
- Gold (CTA buttons): linear-gradient(135deg, #F5C842, #E8A020)
- Coral (streak/danger): #E8644B
- Gray text: #64748B
- Light border: #E2E8F0
- Input background: #F8FAFC

### CTA Button (gold)
```ts
background: 'linear-gradient(135deg,#F5C842,#E8A020)'
borderRadius: 14, padding: '14px', fontSize: 16, fontWeight: 800
color: '#1A1200', boxShadow: '0 4px 16px rgba(232,160,32,0.4)'
width: '100%', border: 'none'
```

### Input fields
```ts
background: '#F8FAFC', border: '1.5px solid #E2E8F0'
borderRadius: 10, padding: '11px 14px', fontSize: 14
color: '#0D1B2A', outline: 'none', boxSizing: 'border-box'
```

### Stat cards (small data cards inside main card)
```ts
background: '#F8FAFC', border: '1px solid #E2E8F0'
borderRadius: 12, padding: '12px 16px', textAlign: 'center'
```

### Language toggle button (fixed top-right)
```tsx
<button onClick={() => setLang(isZh ? 'en' : 'zh')}
  style={{position:'fixed',top:18,right:18,zIndex:20,
    background:'rgba(255,255,255,0.85)',border:'1px solid rgba(255,255,255,0.6)',
    borderRadius:20,padding:'5px 14px',fontSize:13,fontWeight:600,
    cursor:'pointer',backdropFilter:'blur(8px)'}}>
  {isZh ? 'EN' : '中文'}
</button>
```

### Page wrapper
```tsx
<div style={{minHeight:'100vh',display:'flex',alignItems:'center',
  justifyContent:'center',padding:20}}>
  <GameBackground />
  <div style={card}> ... </div>
</div>
```

---

## Chinese Level Titles (用于 Profile 页面)
```ts
const LEVEL_TITLES = [
  { min: 1,  max: 5,  en: 'Initiate Disciple',  zh: '入门弟子' },
  { min: 6,  max: 15, en: 'Foundation Builder',  zh: '筑基期' },
  { min: 16, max: 30, en: 'Golden Core',          zh: '金丹期' },
  { min: 31, max: 50, en: 'Nascent Soul',          zh: '元婴期' },
  { min: 51, max: 75, en: 'Spirit Transformation', zh: '化神期' },
  { min: 76, max: 99, en: 'Tribulation Crossing',  zh: '渡劫期' },
]
function getLevelTitle(level: number) {
  return LEVEL_TITLES.find(t => level >= t.min && level <= t.max) || LEVEL_TITLES[0]
}
```

---

## XP Formula
```ts
const BASE_XP = 10
const DIFFICULTY = { easy: 0.5, medium: 1, hard: 2, boss: 3 }
function xpToNextLevel(level: number) { return Math.floor(50 * Math.pow(level, 1.5)) }
```

---

## PAGE 1: Dashboard (`src/app/(app)/dashboard/DashboardClient.tsx`)

This is a CLIENT component (already has a server wrapper at `dashboard/page.tsx`).
It receives these props:
```ts
interface Props {
  userName: string      // e.g. "Kitty"
  level: number         // e.g. 1
  xpCurrent: number     // e.g. 45
  xpTotal: number       // e.g. 100 (xpToNextLevel(level))
  streakCurrent: number // e.g. 3
  lang?: 'en' | 'zh'
}
```

### Layout (inside the white card, maxWidth 480)
1. **Top bar**: Avatar circle (teal, first letter of name) + level badge + lang toggle
2. **Welcome**: "Good morning, [name]! ⚔️" / "早上好，[name]！⚔️"
3. **XP progress bar**: teal→gold gradient fill, shows "Level X · XP current/total"
4. **3 stat cards in a row**: Level (teal), Streak 🔥 (coral), Days Active (gold)
5. **"My Quests" section**: placeholder grid of 3 empty cards with dashed border
   - Each card: "Quest coming soon... / 任务即将开放" in gray
6. **Sign out button**: white with teal border, bottom of card

### Sign out action:
```ts
import { signOut } from './actions'
// button onClick: startTransition(async () => await signOut())
```

---

## PAGE 2: Profile (`src/app/(app)/profile/page.tsx`)

Full page (server component that reads user data, client for display).
For now make it a `'use client'` component with hardcoded demo data.

### Layout (white card, maxWidth 400)
1. **Hero avatar**: large circle (80px), teal bg, first letter of name, gold border
2. **Name + Level title**: Name in bold, cultivation title badge below (teal pill)
3. **XP progress bar**: labeled "XP to next level"
4. **Stats grid (2×2)**:
   - Level | Total XP
   - 🔥 Streak | ✅ Tasks Done
5. **Achievements section**: "Achievements / 成就" heading, 3 locked badges (gray circles with 🔒)
6. **"Edit Profile" button**: teal outline button
7. **"Back to Dashboard" link**: small gray link at bottom

Demo data to use:
```ts
const user = { name: 'Kitty', level: 1, xpCurrent: 45, xpTotal: 71,
               streak: 3, tasksCompleted: 12, lang: 'en' }
```

---

## PAGE 3: Habits (`src/app/(app)/habits/page.tsx`)

`'use client'` component with demo habit data.

### Layout (wider card, maxWidth 500, or full page with card list)
1. **Page header**: "Daily Quests / 每日任务" title + "＋ Add Quest" gold button (top right)
2. **Habit cards** (3 demo habits):
   Each card has:
   - Left: emoji icon + habit name (bold) + streak badge "🔥 3 days"
   - Right: big circular "Complete / 完成" button (teal when not done, gray checkmark when done)
   - Background: white, border: #E2E8F0, borderRadius: 14, padding: 16
   Toggle complete state with useState per habit

   Demo habits:
   ```ts
   { id:1, emoji:'📚', name:'Read 20 pages', zh:'阅读20页', streak:5, done:false }
   { id:2, emoji:'💪', name:'Exercise 30 min', zh:'锻炼30分钟', streak:12, done:false }
   { id:3, emoji:'🧘', name:'Morning meditation', zh:'晨间冥想', streak:2, done:false }
   ```
3. **XP toast**: when a habit is completed, show a "+10 XP ⭐" floating toast animation
4. **"Back to Dashboard" link** at bottom

---

## WHAT TO DELIVER
3 files, each complete and ready to save:
1. `src/app/(app)/dashboard/DashboardClient.tsx`
2. `src/app/(app)/profile/page.tsx`
3. `src/app/(app)/habits/page.tsx`

No extra dependencies. Inline styles only. Keep bilingual EN/ZH throughout.
GameBackground is already built — just import it.
