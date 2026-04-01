# STATUS.md — Flow / 流动 Build Progress
> Last updated: 2026-04-01

## Current Status

| Day | Scope | Status |
|-----|-------|--------|
| Day 1 | Accounts + repo setup | ✅ Done |
| Day 2 | Next.js scaffold + dependencies | ✅ Done |
| Day 3 | Login flow | ✅ Done |
| Day 4 | Register flow | ✅ Done |
| Day 5 | Supabase schema + auth wiring | ✅ Done |
| Day 6 | Protected app shell + dashboard foundation | ✅ Done |
| Day 7 | Tasks + habits + profile loop | ✅ Done |
| Day 8 | AI coach + settings | ✅ Done |
| Day 9 | Social feed + follows/discover | ✅ Done |
| Day 10 | Leaderboard + friend filtering | ✅ Done |
| Day 11 | Gold-based habit pledges | ✅ Code complete |
| Day 12 | Hype notifications + reward feedback | ✅ Code complete |
| Day 13 | Mobile-responsive polish pass | ✅ Local code pass complete |
| Day 14 | Bilingual cleanup + local verification | ✅ Local verification complete |

## Verified Locally

- `npm run build` passes on `2026-04-01`
- `npm run dev` starts successfully on `http://localhost:3200`
- `npx next lint --dir src` passes with no warnings or errors
- The app renders all main routes in the Next.js build output:
  - `/dashboard`
  - `/tasks`
  - `/habits`
  - `/profile`
  - `/coach`
  - `/social`
  - `/leaderboard`
  - `/settings`

## Remaining Manual / External Checks

- Apply the latest SQL migration in Supabase if it has not been run yet:
  - `supabase/migrations/20260331_progression_and_pledges.sql`
- Do a browser smoke test against live data:
  - register / login
  - create + complete task
  - create + complete habit
  - follow / unfollow from social
  - coach prompt / response
- Reconfirm Vercel environment variables and production auth redirect URLs

## MVP Features in Code

- Auth: email + protected routes
- Dashboard: live stats, pending quests, gold, streak, profile links
- Tasks: create, complete, delete, XP rewards
- Habits: daily / epic split, pledges, hype overlay, streak progression
- Profile: level title, total XP, streak stats, personality settings, heatmap
- Coach: bilingual coach UI and server-side action flow
- Social: activity feed, friends, discover, follow / unfollow
- Leaderboard: global and friends views
- Settings: language and personality persistence, sign out

## Data / Progression Notes

- Shared XP logic lives in `src/lib/xp.ts`
- Dashboard and profile now use unified total XP calculations
- User gold is tracked via `users.inventory_gold`
- Habit pledge fields are tracked via:
  - `habits.quest_type`
  - `habits.pledge_amount`
  - `habits.pledge_target_days`

## Key Files

```txt
src/app/(app)/dashboard/page.tsx
src/app/(app)/dashboard/DashboardClient.tsx
src/app/(app)/tasks/TasksClient.tsx
src/app/(app)/tasks/actions.ts
src/app/(app)/habits/page.tsx
src/app/(app)/habits/HabitsClient.tsx
src/app/(app)/habits/actions.ts
src/app/(app)/profile/page.tsx
src/app/(app)/profile/ProfileClient.tsx
src/app/(app)/coach/CoachClient.tsx
src/app/(app)/social/page.tsx
src/app/(app)/social/SocialClient.tsx
src/app/(app)/leaderboard/page.tsx
src/app/(app)/settings/page.tsx
src/lib/xp.ts
supabase/migrations/20260331_progression_and_pledges.sql
```

## Notes

- ESLint is now initialized via `.eslintrc.json`
- On Windows, if `next build` throws a flaky `/_document` error after switching between dev and build, clear `.next` and rerun the build.
- Local verification is complete enough to continue development from a stable base.
