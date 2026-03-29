# NEXT_STEPS.md — Flow / 流动
> Auto-read by Claude Code at session start. Last updated: 2026-03-26

## ✅ Completed So Far
- Day 1: Accounts registered (GitHub ✅, Supabase ✅, Vercel ✅)
- Day 2: Project scaffolded (Next.js 14 App Router, all dependencies installed)
- Day 3: Login page complete — `src/app/(auth)/login/page.tsx` + `actions.ts`
- Day 4: Register page complete — `src/app/(auth)/register/page.tsx` + `actions.ts`
- Auth infrastructure: `middleware.ts`, `src/lib/supabase/server.ts`, `src/app/auth/callback/route.ts`

---

## 🔴 BLOCKER — Must Do Before Any Coding

**Create `.env.local`** in the project root with these values:
```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Get these from: Supabase Dashboard → Project Settings → API

---

## Day 5 — Run Database Migration

### Step 1: Open Supabase SQL Editor
Go to: https://supabase.com/dashboard → your Flow project → SQL Editor

### Step 2: Run this SQL (copy entire block):

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users profile table (mirrors auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  xp_total INTEGER DEFAULT 0,
  xp_current INTEGER DEFAULT 0,
  streak_current INTEGER DEFAULT 0,
  streak_best INTEGER DEFAULT 0,
  last_active_date DATE,
  lang_preference TEXT DEFAULT 'en' CHECK (lang_preference IN ('en', 'zh')),
  coach_personality TEXT DEFAULT 'mentor' CHECK (coach_personality IN ('mentor', 'cheerleader', 'analyst')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_zh TEXT,
  description TEXT,
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard', 'boss')),
  xp_reward INTEGER DEFAULT 10,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  due_date DATE,
  category TEXT DEFAULT 'general',
  pack_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habits table
CREATE TABLE IF NOT EXISTS public.habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_zh TEXT,
  frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly')),
  xp_reward INTEGER DEFAULT 10,
  streak_count INTEGER DEFAULT 0,
  last_completed_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- XP log table
CREATE TABLE IF NOT EXISTS public.xp_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  source TEXT NOT NULL,
  source_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only see their own data)
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can manage own tasks" ON public.tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own habits" ON public.habits FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own xp_log" ON public.xp_log FOR ALL USING (auth.uid() = user_id);
```

### Step 3: Verify
Run this query to confirm tables exist:
```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```
Should show: users, tasks, habits, xp_log

---

## Day 6 — Wire Up Real Supabase Auth

**Goal:** End-to-end test: sign up → email confirm → login → dashboard → logout

### Step 1: Verify .env.local is filled in
```bash
cat .env.local
# Should show real SUPABASE_URL and ANON_KEY
```

### Step 2: Start dev server
```bash
npm run dev
```

### Step 3: Test email sign-up flow
1. Go to http://localhost:3000/register
2. Fill in name, email, password → submit
3. Check email for confirmation link → click it
4. Should redirect to /dashboard (placeholder page is fine)

### Step 4: Test Google OAuth (if configured)
- Go to /login → click "Continue with Google"
- Should open Google consent screen
- After approval → redirects to /auth/callback → /dashboard

### Step 5: Test middleware protection
- Log out, then go directly to http://localhost:3000/dashboard
- Should redirect to /login ✅

### Step 6: Create placeholder dashboard page
If /dashboard throws 404, create it:

File: `src/app/(app)/dashboard/page.tsx`
```tsx
export default function DashboardPage() {
  return (
    <div style={{background:'#0D1B2A',color:'white',minHeight:'100vh',padding:40}}>
      <h1 style={{color:'#C9A84C'}}>Flow / 流动 Dashboard</h1>
      <p style={{color:'rgba(255,255,255,0.5)',marginTop:8}}>
        Week 2 will build this out. Auth is working! 🎉
      </p>
    </div>
  )
}
```

---

## Day 7 — Deploy to Vercel

### Step 1: Push code to GitHub
```bash
cd E:\SBMA_VAULT\SBMA_LMS_Education\09_TITAN_Discovery_Truth\flow-app
git add .
git commit -m "Day 7: Deploy to Vercel — Week 1 complete"
git push origin main
```

### Step 2: Connect repo in Vercel
1. Go to https://vercel.com/dashboard (hongwangusa account)
2. "Add New Project" → Import from GitHub → select `flow-app`
3. Framework: Next.js (auto-detected)

### Step 3: Add Environment Variables in Vercel
In Project Settings → Environment Variables, add:
- `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key

### Step 4: Deploy
Click Deploy. Wait ~2 minutes.
Your app will be live at: `https://flow-app-[hash].vercel.app`

### Step 5: Update Supabase redirect URLs
In Supabase → Authentication → URL Configuration:
- Site URL: `https://your-vercel-url.vercel.app`
- Redirect URLs: add `https://your-vercel-url.vercel.app/auth/callback`

### Step 6: Celebrate 🎉
Week 1 complete! Update STATUS.md — mark Days 5, 6, 7 done.

---

## After Day 7 — Week 2 Preview

**Day 8:** Dashboard layout — 4-column grid with glass cards
**Day 9:** TaskCard component — title, XP badge, difficulty indicator, complete button
**Day 10:** Add task modal — form with title, difficulty select, due date
**Day 11:** Supabase data persistence — real CRUD for tasks
**Day 12:** Complete task animation — XP gain + confetti
**Day 13:** Navigation bar — avatar, level badge, logout
**Day 14:** Week 2 test + deploy

---

## Commit Message Format
Always start commits with `Day X:` so the build dashboard auto-tracks progress:
```
Day 5: Run Supabase migration, tables verified
Day 6: Wire up auth, email flow working end-to-end
Day 7: Deploy to Vercel, Week 1 complete 🚀
```

## If Stuck
- Check ARCHITECTURE.md for technical decisions
- Check CLAUDE.md for project context + brand colors
- Google: "Next.js 14 App Router [your error message]"
- Supabase docs: https://supabase.com/docs
