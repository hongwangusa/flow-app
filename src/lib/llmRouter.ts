export type Provider = 
  | 'deepseek'
  | 'glm-4.7'
  | 'glm-4.6'
  | 'gpt-4'
  | 'gemini-flash'
  | 'claude-haiku';

export async function callLLM(messages: any[], provider: Provider, apiKey?: string) {
  // If no key is provided, return a mock response
  if (!apiKey || apiKey.trim() === '') {
    return { 
      mock: true, 
      response: "🤖 [Mock Mode] I see you haven't added an API key yet! Add one in the Dashboard settings to unleash my true power. But keep up the great work! ✨" 
    };
  }

  let url = '';
  let body: any = {};
  let headers: any = { 'Content-Type': 'application/json' };

  switch (provider) {
    case 'deepseek':
      url = 'https://api.deepseek.com/v1/chat/completions';
      body = { model: 'deepseek-chat', messages };
      headers['Authorization'] = `Bearer ${apiKey}`;
      break;
    case 'glm-4.7':
    case 'glm-4.6':
      const version = provider === 'glm-4.7' ? 'glm-4.7' : 'glm-4.6';
      url = `https://open.bigmodel.cn/api/paas/v4/chat/completions`; // ZhipuAI standard endpoint
      body = { model: version, messages };
      headers['Authorization'] = `Bearer ${apiKey}`;
      break;
    case 'gpt-4':
      url = 'https://api.openai.com/v1/chat/completions';
      body = { model: 'gpt-4o', messages };
      headers['Authorization'] = `Bearer ${apiKey}`;
      break;
    case 'gemini-flash':
      url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      body = { 
        contents: messages.map(m => ({ 
          role: m.role === 'user' ? 'user' : 'model', 
          parts: [{ text: m.content }] 
        }))
      };
      // Gemini uses query param for auth mostly, but we set it above
      break;
    case 'claude-haiku':
      url = 'https://api.anthropic.com/v1/messages';
      body = { 
        model: 'claude-3-haiku-20240307', 
        max_tokens: 1024, 
        messages: messages.filter(m => m.role !== 'system'),
        system: messages.find(m => m.role === 'system')?.content
      };
      headers['x-api-key'] = apiKey;
      headers['anthropic-version'] = '2023-06-01';
      break;
    default:
      throw new Error('Unsupported provider');
  }

  try {
    const resp = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
    const data = await resp.json();

    if (!resp.ok) {
      console.error('LLM API Error:', data);
      return { mock: true, response: `⚠️ API Error: ${data.error?.message || resp.statusText}` };
    }

    // Normalize response formats
    let content = '';
    if (provider === 'gemini-flash') {
      content = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } else if (provider === 'claude-haiku') {
      content = data?.content?.[0]?.text || '';
    } else {
      // standard OpenAI format (Deepseek, GLM, GPT)
      content = data?.choices?.[0]?.message?.content || '';
    }

    return { mock: false, response: content };
  } catch (error: any) {
    console.error('LLM Fetch Error:', error);
    return { mock: true, response: `⚠️ Network Error: Could not reach the AI provider.` };
  }
}
