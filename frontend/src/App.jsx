import { useEffect, useRef, useState } from 'react'
import { AlertCircle, MessageCircle, Sparkles } from 'lucide-react'
import { useChat } from './hooks/useChat'
import Sidebar from './components/Sidebar'
import ChatHeader from './components/ChatHeader'
import ChatMessage from './components/ChatMessage'
import ChatInput from './components/ChatInput'
import TypingIndicator from './components/TypingIndicator'
import WelcomeScreen from './components/WelcomeScreen'

export default function App() {
  const chat = useChat()
  const [theme, setTheme] = useState(() => window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [chat.messages, chat.sending])

  async function send(content) {
    await chat.sendMessage(content)
  }
  async function startNewChat() {
    await chat.newChat()
    setSidebarOpen(false)
  }

  return (
    <div className={`app-shell theme-${theme}`}>
      <Sidebar conversations={chat.conversations} activeId={chat.activeId} onNewChat={startNewChat} onSelectChat={chat.selectChat} onDeleteChat={chat.deleteChat} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-panel">
        <ChatHeader theme={theme} onToggleTheme={() => setTheme((current) => current === 'light' ? 'dark' : 'light')} onOpenSidebar={() => setSidebarOpen(true)} health={chat.health} />
        <section className="conversation-area">
          {chat.error && <div className="error-banner"><AlertCircle size={17} /><span>{chat.error}</span><button onClick={() => chat.setError('')} aria-label="Dismiss error">×</button></div>}
          {chat.loading ? <div className="loading-state"><span className="loader" />Loading conversation...</div> : chat.messages.length === 0 ? (
            <WelcomeScreen onPrompt={send} />
          ) : (
            <div className="messages-list">
              {chat.messages.map((message) => <ChatMessage key={message.id} message={message} />)}
              {chat.sending && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>
          )}
        </section>
        <ChatInput onSend={send} disabled={chat.sending} />
        <footer className="app-footer"><span><MessageCircle size={13} /> Built with React, FastAPI & OpenAI</span><span><Sparkles size={13} /> ChatSphere AI</span></footer>
      </main>
    </div>
  )
}
