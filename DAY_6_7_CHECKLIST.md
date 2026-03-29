# Flow App — Day 6 & 7 Checklist

## **DAY 6: Wire up Real Supabase Auth & Test Full Flow** 🔗

### Setup ✅ (Already Done)
- [x] `NEXT_PUBLIC_APP_URL=http://localhost:3001` added to `.env.local`
- [x] Supabase project created & credentials in .env.local
- [x] Auth actions hooked up (login, register, OAuth providers)
- [x] Auth middleware protecting `/dashboard`, `/profile`, `/habits`
- [x] Logout action ready in dashboard

### Step 1: Test Email/Password Auth Locally (5 min)
1. Start dev server: `npm run dev`
2. Go to http://localhost:3001/register
3. **Register** a test account (e.g., `test@example.com` / `password123`)
4. Check email for confirmation link (or skip if email verification disabled in Supabase)
5. Go to http://localhost:3001/login
6. **Login** with the credentials
7. Should see dashboard with user email ✓

### Step 2: Configure OAuth Providers in Supabase (10 min each)

#### **Google OAuth:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → Auth → Providers → Google
2. Enable "Google"
3. Paste Google OAuth credentials (from Google Cloud Console)
   - Client ID
   - Client Secret
4. Authorized redirect URIs should auto-include: `http://localhost:3001/auth/callback`
5. Save

#### **Facebook OAuth:**
1. Same as above but for Facebook
2. Enable Facebook provider
3. App ID + App Secret from [Facebook Developers](https://developers.facebook.com)
4. Authorized redirect URIs: `http://localhost:3001/auth/callback`

#### **Apple OAuth:**
1. Similar process
2. Requires Team ID, Key ID, Private Key from Apple Developer

⚠️ **Note:** If you don't have OAuth creds ready yet, skip this — Google/Facebook/Apple redirects will fail with error messages, but **email/password auth will work fine** and that's the main test.

### Step 3: Test Auth Flow End-to-End (10 min)
From **http://localhost:3001/login**, test:
- [x] Email login → redirects to `/dashboard`
- [x] "Create Character" link → redirects to `/register`
- [x] Lang toggle (EN/中文) works
- [x] Error handling (wrong password, etc.)

From **dashboard**, test:
- [x] User email/name displays
- [x] Logout button works → redirects to `/login`
- [x] Hitting `/dashboard` without login → redirects to `/login`

### Step 4: Commit Progress (2 min)
```bash
git add .
git commit -m "Day 6: Real Supabase Auth wired, email/password & OAuth ready for testing"
git push origin main
```

---

## **DAY 7: Deploy to Vercel** 🚀

### Step 1: Prepare Environment (2 min)
- [x] Code committed & pushed to GitHub
- Update `.env.local` (optional, won't be pushed to repo)

### Step 2: Connect Vercel (5 min)
1. Go to [vercel.com](https://vercel.com)
2. **New Project** → Import Git Repository
3. Select `hongwangusa/flow-app` repo
4. Click **Deploy**
5. Vercel will auto-detect Next.js and deploy

### Step 3: Set Environment Variables in Vercel (2 min)
1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add these three variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://xkijuegokfxvuuhbwjox.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc...
   NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
   ```
   (Vercel will show you the actual URL after first deploy)
3. Redeploy

### Step 4: Update Supabase OAuth Settings (5 min)
For each OAuth provider (Google, Facebook, Apple):
1. Supabase Dashboard → Auth → Providers → [Provider]
2. Update **Authorized redirect URIs** to include:
   ```
   https://your-app.vercel.app/auth/callback
   ```
3. Save

### Step 5: Test Production (5 min)
1. Go to your Vercel URL
2. Test **email/password login**
3. Test **logout**
4. Test **OAuth login** (if configured)
5. Check that dashboard loads with user data

### Step 6: Final Commit & Celebrate 🎉
```bash
git add .
git commit -m "Day 7: Deployed to Vercel, production auth working"
git push origin main
```

---

## **Troubleshooting**

### "OAuth redirect failed" on localhost
- Check `.env.local` has `NEXT_PUBLIC_APP_URL=http://localhost:3001`
- Restart dev server: `npm run dev`

### "Invalid grant" on OAuth
- OAuth provider not configured in Supabase
- Missing Client ID/Secret in Supabase settings

### Build fails on Vercel
- Check all environment variables are set
- Run `npm run build` locally to test build

### "User already exists" on register
- Supabase already has that email registered
- Go to Supabase Dashboard → Auth → Users to view/delete test users

---

## **Success Criteria ✓**
- [x] Email/password auth works locally
- [x] OAuth buttons appear (may redirect to error if not configured yet)
- [x] Middleware protects routes correctly
- [x] Vercel deployment is live
- [x] Production email login works
- [x] User data loads on dashboard

**Week 1 Complete!** 🎊
