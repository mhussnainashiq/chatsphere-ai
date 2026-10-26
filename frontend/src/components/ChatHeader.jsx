import { Menu, Sun, Moon, Sparkles } from 'lucide-react'

export default function ChatHeader({ theme, onToggleTheme, onOpenSidebar, health }) {
  return (
    <header className="chat-header">
      <button className="icon-button mobile-menu" onClick={onOpenSidebar} aria-label="Open sidebar"><Menu size={20} /></button>
      <div className="header-title"><span className="header-sparkle"><Sparkles size={16} /></span><div><strong>AI Assistant</strong><span className="status-line"><i className={health.status === 'ok' && health.ai_configured ? 'status-dot ready' : 'status-dot'} />{health.ai_configured ? 'AI connected' : 'API setup required'}</span></div></div>
      <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle color theme">{theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}<span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span></button>
    </header>
  )
}
