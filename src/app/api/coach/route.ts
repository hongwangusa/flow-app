import { NextResponse } from 'next/server'
import { callLLM, Provider } from '@/lib/llmRouter'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { prompt, provider, apiKey } = await req.json()
    
    // 1. Verify Authentication
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Fetch User Profile to get personality/language
    const { data: profile } = await supabase
      .from('users')
      .select('name, level, lang_preference, coach_personality')
      .eq('id', user.id)
      .single()

    const personality = profile?.coach_personality || 'mentor'
    const lang = profile?.lang_preference || 'en'
    
    // 3. Construct System Prompt based on user settings
    let systemPrompt = `You are an AI habit coaching assistant in a gamified productivity app called Flow / 流动.
The user is named ${profile?.name || 'Trainer'} and is currently Level ${profile?.level || 1}.
Keep your answers extremely concise (max 2-3 sentences). Use emojis.`

    if (lang === 'zh') {
      systemPrompt += `\nCRITICAL MUST FOLLOW: You must respond ENTIRELY in fluent Chinese.`
    }

    if (personality === 'mentor') {
      systemPrompt += `\nYour personality is a wise, calm martial arts mentor. You speak in profound but encouraging truths.`
    } else if (personality === 'cheerleader') {
      systemPrompt += `\nYour personality is an insanely energetic, hyper-positive cheerleader. You use tons of exclamation points and hype!`
    } else if (personality === 'analyst') {
      systemPrompt += `\nYour personality is a cold, calculated, highly logical data analyst. You focus on efficiency and streak metrics.`
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ]

    // 4. Call the LLM Router
    const result = await callLLM(messages, provider as Provider, apiKey)

    return NextResponse.json(result)

  } catch (err: any) {
    console.error('Coach API Error:', err)
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 })
  }
}
