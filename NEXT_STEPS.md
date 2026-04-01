# NEXT_STEPS.md — Flow / 流动
> Auto-read project handoff. Last updated: 2026-04-01

## Current Reality

- The app is no longer in the old Day 5-7 phase.
- Local code has progressed through the original 14-day MVP plan.
- Current local verification:
  - `npm run build` ✅
  - `npx next lint --dir src` ✅
  - `npm run dev` ✅ on `http://localhost:3200`

## Highest-Priority Next Actions

1. Apply / confirm the latest Supabase migration:
   - `supabase/migrations/20260331_progression_and_pledges.sql`
2. Run a real Safari-on-macOS smoke test
3. Run a browser QA pass with real auth + data
4. Recheck production env vars and redirect URLs in Vercel / Supabase
5. Deploy or redeploy only after the above checks pass

## Suggested QA Checklist

### Auth
- Register a new account
- Log in with an existing account
- Confirm protected routes redirect correctly
- Sign out from dashboard and settings

### Tasks
- Add a task
- Complete a task
- Confirm XP increases
- Delete a task

### Habits / Pledges
- Add a daily habit
- Add an epic habit with a gold pledge
- Complete both types
- Confirm streak, XP, hype state, and gold behavior

### Social / Leaderboard
- Open activity feed
- Follow and unfollow a user
- Confirm discover list updates
- Check global vs friends leaderboard

### Coach / Settings / Profile
- Save coach personality
- Send a coach prompt
- Toggle language
- Open profile and confirm XP / streak stats

## Known Repo Notes

- Shared XP logic is centralized in `src/lib/xp.ts`
- Local dev port is `3200`
- ESLint is initialized via `.eslintrc.json`
- If `next build` flakes with `/_document` on Windows after dev/build switching, clear `.next` and rerun
- Do not run `next build` and `next dev` in parallel in the same repo; they can corrupt `.next`
- Status dashboard lives in `STATUS.md`

## If You Resume This Project Later

- Start with `STATUS.md`
- Then check:
  - `src/app/(app)/dashboard`
  - `src/app/(app)/habits`
  - `src/app/(app)/social`
  - `src/lib/xp.ts`
  - `supabase/migrations/20260331_progression_and_pledges.sql`

## Recommended Next Build Phase

After MVP verification is complete, the next good expansion areas are:

1. richer task planning / daily roadmap
2. stronger pet progression and collectibles
3. better coach memory / personalization
4. production analytics and error monitoring
