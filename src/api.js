const API_URL = 'https://api.anthropic.com/v1/messages'

export async function callClaude(history, userMsg, systemPrompt) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('未設定 VITE_ANTHROPIC_API_KEY')

  const messages = [...history, { role: 'user', content: userMsg }]

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1400,
      system: systemPrompt,
      messages,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`API 錯誤 ${res.status}: ${err}`)
  }
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)

  const reply = data.content?.map(b => b.text || '').join('') || '（無回應）'
  return { reply, messages: [...messages, { role: 'assistant', content: reply }] }
}
