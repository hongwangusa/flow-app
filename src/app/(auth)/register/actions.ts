'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signUpWithEmail(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!name || !email || !password || !confirmPassword)
    redirect('/register?error=missing_fields')
  if (password !== confirmPassword)
    redirect('/register?error=passwords_do_not_match')
  if (password.length < 8)
    redirect('/register?error=password_too_short')

  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: {
      data: { full_name: name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) redirect(`/register?error=${encodeURIComponent(error.message)}`)

  if (data.user) {
    await supabase.from('users').upsert({
      id: data.user.id,
      email,
      name,
      lang_preference: 'en',
      level: 1,
      xp_current: 0,
      xp_total: 0,
      streak_current: 0,
      streak_best: 0,
    })
  }

  if (data.session) redirect('/dashboard')
  else redirect('/register?success=check_email')
}

export async function signUpWithGoogle() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` },
  })
  if (error) redirect(`/register?error=${encodeURIComponent(error.message)}`)
  if (data.url) redirect(data.url)
}

export async function signUpWithFacebook() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` },
  })
  if (error) redirect(`/register?error=${encodeURIComponent(error.message)}`)
  if (data.url) redirect(data.url)
}

export async function signUpWithApple() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` },
  })
  if (error) redirect(`/register?error=${encodeURIComponent(error.message)}`)
  if (data.url) redirect(data.url)
}
