const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')

async function request(path, options = {}) {
  let response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    })
  } catch {
    throw new Error('Cannot reach the backend. Make sure FastAPI is running at ' + API_BASE + '.')
  }

  if (!response.ok) {
    let message = `Request failed (${response.status}).`
    try {
      const data = await response.json()
      message = typeof data.detail === 'string' ? data.detail : message
    } catch { /* Keep fallback message. */ }
    throw new Error(message)
  }
  if (response.status === 204) return null
  return response.json()
}

export const chatApi = {
  health: () => request('/api/health'),
  listConversations: () => request('/api/conversations'),
  createConversation: () => request('/api/conversations', { method: 'POST' }),
  getConversation: (id) => request(`/api/conversations/${encodeURIComponent(id)}`),
  deleteConversation: (id) => request(`/api/conversations/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  sendMessage: (id, content) => request(`/api/conversations/${encodeURIComponent(id)}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  }),
}
