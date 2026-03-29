# STATUS.md — Flow / 流动 Build Progress
> Last updated: 2026-03-29

## ✅ Completed Days

| Day | Task | Status |
|-----|------|--------|
| Day 1 | Register GitHub + Supabase + Vercel accounts | ✅ Done |
| Day 2 | Scaffold Next.js project, install dependencies | ✅ Done |
| Day 3 | Login page (Apple/Google/Facebook + email) | ✅ Done |
| Day 4 | Register page with email + social sign-up | ✅ Done |
| Day 5 | Supabase project created + DB migration run | ✅ Done |
| Day 6 | Wire up real Supabase Auth, test full flow | ✅ Done |
| Day 7 | Task system + XP engine + build passes — Vercel pending | ✅ Code done, push needed |

## 🔄 Up Next (Accelerated 3-Day Plan)

| Day | Task | Status |
|-----|------|--------|
| Day 8 | AI Coach (Claude Haiku, 3 personalities, bilingual) | 🔜 Next session |
| Day 9 | Streak visual + level-up animation | 🔜 Pending |
| Day 10 | Mobile responsive + full bilingual polish | 🔜 Pending |

## 🚀 Deployment
- **GitHub:** https://github.com/hongwangusa/flow-app
- **Vercel:** Not yet connected — needs manual push + Vercel import
- **Local:** `npm run dev` on localhost:3001

### To Deploy (manual steps):
1. Push to GitHub: `git push -u origin main` (enter GitHub credentials)
2. Go to vercel.com → New Project → Import `hongwangusa/flow-app`
3. Add env vars in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL` = https://xkijuegokfxvuuhbwjox.supabase.co
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (from .env.local)
   - `NEXT_PUBLIC_APP_URL` = https://your-vercel-url.vercel.app
4. Deploy → get live URL → update `NEXT_PUBLIC_APP_URL` → redeploy

## 🗄️ Supabase Project
- **Project ID:** xkijuegokfxvuuhbwjox
- **URL:** https://xkijuegokfxvuuhbwjox.supabase.co
- **Region:** ap-southeast-1 (Singapore)
- **Tables:** users ✅, tasks ✅, habits ✅, xp_log ✅
- **RLS:** Enabled on all tables ✅

## 📁 Key Files (as of Day 7)
```
src/app/(auth)/login/page.tsx          ✅ Login (bilingual, OAuth + email)
src/app/(auth)/login/actions.ts        ✅ Login server actions
src/app/(auth)/register/page.tsx       ✅ Register (bilingual, OAuth + email)
src/app/(auth)/register/actions.ts     ✅ Register + user profile creation (fixed column names)
src/app/auth/callback/route.ts         ✅ OAuth callback
src/app/(app)/dashboard/page.tsx       ✅ Dashboard (real Supabase data, task counts)
src/app/(app)/dashboard/DashboardClient.tsx  ✅ Dashboard UI + quick nav
src/app/(app)/tasks/page.tsx           ✅ Tasks (server component)
src/app/(app)/tasks/TasksClient.tsx    ✅ Task CRUD UI (add/complete/delete)
src/app/(app)/tasks/actions.ts         ✅ Task server actions + XP award
src/app/(app)/habits/page.tsx          ✅ Habits (server component, real data)
src/app/(app)/habits/HabitsClient.tsx  ✅ Habits CRUD UI
src/app/(app)/habits/actions.ts        ✅ Habit server actions + XP award
src/app/(app)/profile/page.tsx         ✅ Profile (server component, real data)
src/app/(app)/profile/ProfileClient.tsx ✅ Profile UI (stats + achievements)
src/lib/xp.ts                          ✅ XP + Level + Streak engine
src/lib/supabase/server.ts             ✅ Supabase SSR client
src/middleware.ts                      ✅ Route protection
src/app/layout.tsx                     ✅ Root layout (globals.css)
src/components/GameBackground.tsx      ✅ Animated background
.env.local                             ✅ Supabase keys (gitignored)
```

## 🏗️ Architecture Decisions (from ARCHITECTURE.md)
- Server Components fetch data, Client Components render UI + call server actions
- XP formula: easy=10, medium=25, hard=50 XP | Level N needs N×100 XP
- Streak: consecutive-day tracking via `last_active_date` in users table
- All tables have RLS — user_id = auth.uid() on every query

## 📊 Build Dashboard
- File: `E:\SBMA_VAULT\FLOW_BuildDashboard.html`
- Days 1-7 should now show as complete
- Connect GitHub repo (hongwangusa/flow-app) to auto-track commits
