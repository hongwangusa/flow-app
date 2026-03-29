# ARCHITECTURE.md — Flow / 流动 Technical Decisions
# Why we built it this way. Read before making structural changes.

## Why Next.js 14 App Router (not Pages Router)?
- Server Components = faster page loads, better SEO
- Server Actions = forms submit without API routes (cleaner code for Kitty to learn)
- Built-in layouts = shared nav/footer without prop drilling
- Supabase SSR package is designed for App Router

## Why Supabase (not Firebase)?
- PostgreSQL = real relational database (better for habit streaks, XP calculations)
- Row Level Security = each user can ONLY see their own data (built-in, no custom code)
- Auth built-in = handles OAuth (Apple/Google/Facebook) + email/password in one place
- Free tier is generous: 500MB storage, 50MB database, unlimited auth

## Why Claude Haiku for AI Coach (not GPT)?
- Cost: Haiku is ~$0.25/million tokens vs GPT-4o-mini at $0.15/million — comparable
- Integration: single Anthropic account (James老师 already has one)
- Quality: better at bilingual Chinese/English than comparable GPT models
- Future: can upgrade to Sonnet/Opus for premium tier users (BYOK model)

## Auth Flow Architecture
```
User clicks "Continue with Google"
  → Supabase generates OAuth URL
  → User redirected to Google
  → Google redirects to /auth/callback?code=xxx
  → route.ts exchanges code for session
  → Session stored in cookies (httpOnly, secure)
  → middleware.ts checks session on every protected route
  → User lands on /dashboard
```

## Route Structure
```
/                     → redirects to /login (unauthenticated) or /dashboard (authenticated)
/login                → public, redirects to /dashboard if already logged in
/register             → public, redirects to /dashboard if already logged in
/forgot-password      → public
/auth/callback        → public (OAuth return URL)
/dashboard            → PROTECTED — requires auth
/habits               → PROTECTED
/tasks                → PROTECTED
/profile              → PROTECTED
/settings             → PROTECTED
/packs                → PROTECTED (Study Packs store)
```

## Database Schema Decisions
- `tasks` is the base table — habits/dailies/todos all extend it (discriminator: `task_type`)
- All tables have `user_id` foreign key with RLS: `user_id = auth.uid()`
- `task_completions` is a separate table (not a boolean on tasks) — allows streak calculation
- `leaderboard_weekly` is a materialized view — refreshed weekly, not real-time

## i18n Pattern
Every page follows this pattern:
```tsx
const [lang, setLang] = useState<'en' | 'zh'>('en')
const isZh = lang === 'zh'
const t = {
  title: isZh ? '中文' : 'English',
  // ... all strings
}
```
Language preference saved to localStorage key: `flow-lang`
Default: 'en' (can detect browser language in future)

## Styling Architecture
1. Tailwind utility classes for layout/spacing
2. `.glass-card`, `.btn-flow-primary` etc. in globals.css for reusable components
3. Inline `style` only for dynamic values (animation delays, orb colors)
4. Never use hardcoded hex colors in components — always use `flow-teal`, `flow-gold` etc.

## Component Hierarchy (planned)
```
app/
  layout.tsx (fonts, metadata)
  (auth)/layout.tsx (centered, dark bg, no nav)
  dashboard/layout.tsx (sidebar nav + top bar)
components/
  ui/ (buttons, inputs, badges — reusable primitives)
  task/ (TaskCard, TaskForm, TaskList)
  rpg/ (XPBar, LevelBadge, StreakCounter)
  coach/ (CoachBubble, CoachChat)
  packs/ (PackCard, PackStore)
```

## Performance Rules
- Never fetch data in Client Components — use Server Components + pass props
- Images: always use Next.js `<Image>` component, never `<img>`
- Animations: use CSS keyframes (defined in globals.css), not JS-based animation libraries
- Supabase queries: always filter by `user_id`, never fetch all rows

## Security Rules
- NEVER put `SUPABASE_SERVICE_ROLE_KEY` in client-side code
- NEVER disable RLS on any table
- All user input must be validated server-side in Server Actions
- OAuth redirect URLs must be allowlisted in Supabase dashboard
