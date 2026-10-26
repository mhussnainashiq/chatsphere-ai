import { useCallback, useEffect, useState } from 'react'
import { chatApi } from '../api/chatApi'

export function useChat() {
  const [conversations, setConversations] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [health, setHealth] = useState({ status: 'checking', ai_configured: false })

  const refreshList = useCallback(async () => {
    const items = await chatApi.listConversations()
    setConversations(items)
    return items
  }, [])

  useEffect(() => {
    let alive = true
    Promise.all([chatApi.listConversations(), chatApi.health()])
      .then(([items, status]) => {
        if (!alive) return
        setConversations(items)
        setHealth(status)
        if (items.length) setActiveId(items[0].id)
      })
      .catch((err) => { if (alive) setError(err.message) })
    return () => { alive = false }
  }, [])

  useEffect(() => {
    if (!activeId) {
      setMessages([])
      return
    }
    let alive = true
    setLoading(true)
    chatApi.getConversation(activeId)
      .then((conversation) => { if (alive) setMessages(conversation.messages || []) })
      .catch((err) => { if (alive) setError(err.message) })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [activeId])

  const newChat = useCallback(async () => {
    setError('')
    try {
      const conversation = await chatApi.createConversation()
      await refreshList()
      setActiveId(conversation.id)
      setMessages([])
      return conversation.id
    } catch (err) {
      setError(err.message)
      return null
    }
  }, [refreshList])

  const deleteChat = useCallback(async (id) => {
    setError('')
    try {
      await chatApi.deleteConversation(id)
      const remaining = await refreshList()
      if (activeId === id) {
        setActiveId(remaining[0]?.id || null)
        setMessages([])
      }
    } catch (err) { setError(err.message) }
  }, [activeId, refreshList])

  const sendMessage = useCallback(async (content) => {
    const trimmed = content.trim()
    if (!trimmed || sending) return
    setError('')
    setSending(true)
    let id = activeId
    try {
      if (!id) {
        id = await chatApi.createConversation().then((item) => item.id)
        setActiveId(id)
      }
      const optimistic = { id: `temp-${Date.now()}`, role: 'user', content: trimmed, created_at: new Date().toISOString() }
      setMessages((current) => [...current, optimistic])
      const result = await chatApi.sendMessage(id, trimmed)
      setMessages((current) => [
        ...current.filter((message) => !String(message.id).startsWith('temp-')),
        result.user_message,
        result.assistant_message,
      ])
      await refreshList()
      setHealth((current) => ({ ...current, status: 'ok' }))
    } catch (err) {
      setError(err.message)
      if (id) {
        try {
          const conversation = await chatApi.getConversation(id)
          setMessages(conversation.messages || [])
        } catch { /* Preserve original error. */ }
      }
    } finally { setSending(false) }
  }, [activeId, sending, refreshList])

  const selectChat = useCallback((id) => {
    setError('')
    setActiveId(id)
  }, [])

  return { conversations, activeId, messages, loading, sending, error, setError, health, newChat, deleteChat, sendMessage, selectChat }
}
