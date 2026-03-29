# CLAUDE.md — Flow / 流动 App
# READ THIS FIRST every session before touching any code.

## What This Project Is
Flow / 流动 is a **bilingual (Chinese + English) gamified habit tracker**.
Think BeeDone × Habitica — but the ONLY one with real bilingual support.
This is NOT an SAT study engine. SAT/IELTS are optional Study Packs only.
Builder: Kitty (high school student, college application project)
Mentor: James老师

## Tech Stack
- **Framework:** Next.js 14 (App Router) — files live in `src/app/`
- **Database + Auth:** Supabase (PostgreSQL + Row Level Security)
- **AI Coach:** Claude Haiku (`claude-haiku-4-5-20251001`) via Anthropic SDK
- **Styling:** Tailwind CSS + custom Flow design system in `globals.css`
- **i18n:** i18next — translations in `src/lib/i18n/en.json` + `zh.json`
- **Deploy:** Vercel (auto-deploys on git push)
- **Language:** TypeScript throughout

## Brand / Design System
Colors (defined in tailwind.config.ts AND globals.css):
- Navy:     #0D1B2A  (background)
- Teal:     #1B8A8F  (primary actions)
- TealLight:#2ABFBF  (hover states)
- Gold:     #C9A84C  (XP, achievements)
- Coral:    #E8644B  (alerts, excitement)

CSS component classes (use these, don't reinvent):
- `.glass-card` — dark frosted glass panel
- `.btn-flow-primary` — teal gradient button
- `.btn-social` — dark glass social login button
- `.input-flow` — styled dark input field
- `.divider-with-text` — horizontal rule with centered label
- `.level-badge` — gold pill badge
- `.orb` — blurred background glow sphere

## Project Structure
```
src/
  app/
    (auth)/
      login/          ✅ DONE — page.tsx + actions.ts
      register/       ← Day 4, NOT YET BUILT
    auth/
      callback/       ✅ DONE — route.ts (OAuth redirect handler)
    dashboard/        ← Day 8, NOT YET BUILT
    layout.tsx        ✅ DONE
    globals.css       ✅ DONE
  lib/
    supabase/
      client.ts       ✅ DONE (browser client)
      server.ts       ✅ DONE (server SSR client)
    claude/
      client.ts       ✅ DONE (AI coach integration)
    i18n/
      en.json         ✅ DONE
      zh.json         ✅ DONE
  middleware.ts       ✅ DONE (route protection)
  types/
    index.ts          ✅ DONE (all TypeScript types)
supabase/
  migrations/
    001_initial.sql   ✅ DONE — run this in Supabase SQL Editor
```

## Coding Rules — MUST FOLLOW
1. **Bilingual everything** — all user-facing text uses the `t` translation object, never hardcoded strings
2. **Language toggle** — every page must have EN/ZH toggle, matching the login page pattern
3. **Server Actions** — use `'use server'` actions.ts files for all form submissions (see login/actions.ts as template)
4. **Supabase SSR** — always use `createClient()` from `@/lib/supabase/server` in server components
5. **No inline styles** — use Tailwind classes + the `.glass-card`, `.btn-flow-primary` etc. component classes
6. **TypeScript strict** — no `any` types, use the interfaces in `src/types/index.ts`
7. **Mobile first** — every component must work on 375px width (iPhone SE)

## Environment Variables Needed
Copy `.env.example` → `.env.local` and fill in:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ANTHROPIC_API_KEY`
- `NEXT_PUBLIC_APP_URL` = http://localhost:3000 (dev) or https://your-app.vercel.app (prod)

## XP / Game Economy
- BASE_XP = 10
- Easy × 0.5 = 5 XP | Medium × 1.0 = 10 XP | Hard × 2.0 = 20 XP | Boss × 3.0 = 30 XP
- Streak bonus: +10% per day, max 2× multiplier
- Level formula: `Math.floor(50 * Math.pow(level, 1.5))` XP to next level
- Functions already defined in `src/types/index.ts`: `calculateXP()`, `xpToNextLevel()`

## Chinese Level Titles (in order)
入门弟子 → 筑基期 → 金丹期 → 元婴期 → 化神期 → 渡劫期

## Check STATUS.md for current progress before starting any session.
