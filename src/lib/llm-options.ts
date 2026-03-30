// Shared LLM provider registry — safe to import in both client and server components
export type LLMProvider = 'claude-haiku' | 'deepseek' | 'glm-flash' | 'gemini-flash'

export const LLM_OPTIONS: Record<LLMProvider, {
  label: string; labelZh: string; flag: string; note: string; noteZh: string
}> = {
  'claude-haiku': { label: 'Claude Haiku',  labelZh: 'Claude Haiku', flag: '🤖', note: 'Fast & smart',   noteZh: '快速智能' },
  'deepseek':     { label: 'DeepSeek V3',   labelZh: 'DeepSeek V3',  flag: '🔍', note: 'Deep reasoning', noteZh: '深度推理' },
  'glm-flash':    { label: 'GLM Flash',     labelZh: 'GLM 极速',      flag: '⚡', note: 'Ultra fast',     noteZh: '极速响应' },
  'gemini-flash': { label: 'Gemini Flash',  labelZh: 'Gemini Flash', flag: '✨', note: 'Google AI',      noteZh: '谷歌AI' },
}
