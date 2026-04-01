'use client'

import { useEffect, useState } from 'react'

const providers = [
  { id: 'deepseek', label: 'DeepSeek' },
  { id: 'glm-4.7', label: 'GLM 4.7' },
  { id: 'glm-4.6', label: 'GLM 4.6' },
  { id: 'gpt-4', label: 'GPT / OpenAI' },
  { id: 'gemini-flash', label: 'Gemini Flash' },
  { id: 'claude-haiku', label: 'Claude Haiku' },
]

export default function ModelSelector() {
  const [selected, setSelected] = useState<string>('deepseek')
  const [key, setKey] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const storedProvider = localStorage.getItem('llmProvider')
    if (storedProvider) {
      setSelected(storedProvider)
      setKey(localStorage.getItem(`llmKey_${storedProvider}`) || '')
      return
    }
    setKey(localStorage.getItem('llmKey_deepseek') || '')
  }, [])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem('llmProvider', selected)
    setKey(localStorage.getItem(`llmKey_${selected}`) || '')
    window.dispatchEvent(new Event('llmProviderChanged'))
  }, [selected, mounted])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem(`llmKey_${selected}`, key)
  }, [key, selected, mounted])

  if (!mounted) return null

  const selectedProviderLabel = providers.find((provider) => provider.id === selected)?.label ?? 'selected provider'

  return (
    <div style={{ padding: 16, background: 'rgba(255,255,255,0.6)', borderRadius: 16, border: '1px solid #E2E8F0', marginBottom: 24 }}>
      <h3 style={{ margin: '0 0 12px 0', color: '#0D1B2A', fontSize: 16, fontWeight: 700 }}>Coach AI Model</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        {providers.map((provider) => (
          <label key={provider.id} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: 14, color: '#64748B', fontWeight: 500 }}>
            <input
              type="radio"
              name="llmProvider"
              value={provider.id}
              checked={selected === provider.id}
              onChange={() => setSelected(provider.id)}
              style={{ marginRight: 6, accentColor: '#1B8A8F' }}
            />
            {provider.label}
          </label>
        ))}
      </div>
      <div>
        <input
          type="password"
          placeholder={`Enter your ${selectedProviderLabel} API key...`}
          value={key}
          onChange={(event) => setKey(event.target.value)}
          style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none', background: '#F8FAFC' }}
        />
        <p style={{ margin: '6px 0 0 0', fontSize: 12, color: '#94A3B8' }}>
          Keys are stored safely in your browser&apos;s local storage.
        </p>
      </div>
    </div>
  )
}
