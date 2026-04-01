'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfileAction(data: { coach_personality?: string, lang_preference?: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authorized' }

  const { error } = await supabase
    .from('users')
    .update(data)
    .eq('id', user.id)

  if (error) {
    console.error('Profile update error:', error)
    return { error: error.message }
  }

  revalidatePath('/profile')
  revalidatePath('/dashboard')
  return { success: true }
}
