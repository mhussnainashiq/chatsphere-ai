import { Bot, UserRound, Copy, Check, Sparkles } from 'lucide-react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function formatTime(value) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function ChatMessage({ message }) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'
  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch { /* Clipboard can be unavailable on insecure origins. */ }
  }
  return (
    <article className={`message-row ${isUser ? 'user-row' : 'assistant-row'}`}>
      <div className={`message-avatar ${isUser ? 'user-avatar' : 'assistant-avatar'}`}>{isUser ? <UserRound size={17} /> : <Sparkles size={17} />}</div>
      <div className="message-content">
        <div className="message-meta"><strong>{isUser ? 'You' : 'ChatSphere'}</strong><time>{formatTime(message.created_at)}</time></div>
        <div className={`message-body ${isUser ? 'user-message' : 'assistant-message'}`}>
          {isUser ? <p>{message.content}</p> : <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>}
        </div>
        {!isUser && <button className="copy-button" onClick={copyMessage}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copied' : 'Copy response'}</button>}
      </div>
    </article>
  )
}
