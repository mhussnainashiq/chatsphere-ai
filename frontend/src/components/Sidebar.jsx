import { MessageSquare, Plus, Trash2, PanelLeftClose, Sparkles } from 'lucide-react'

export default function Sidebar({ conversations, activeId, onNewChat, onSelectChat, onDeleteChat, open, onClose }) {
  return (
    <>
      {open && <button className="mobile-scrim" aria-label="Close menu" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Sparkles size={20} /></div>
          <div><strong>ChatSphere</strong><span>AI assistant</span></div>
          <button className="icon-button sidebar-close" onClick={onClose} aria-label="Close sidebar"><PanelLeftClose size={18} /></button>
        </div>
        <button className="new-chat-button" onClick={onNewChat}><Plus size={18} /> New chat <span>⌘ K</span></button>
        <div className="history-label">YOUR CONVERSATIONS</div>
        <div className="history-list">
          {conversations.length === 0 && <p className="history-empty">Your conversations will appear here.</p>}
          {conversations.map((chat) => (
            <div className={`history-item ${activeId === chat.id ? 'active' : ''}`} key={chat.id}>
              <button className="history-select" onClick={() => { onSelectChat(chat.id); onClose() }}>
                <MessageSquare size={16} /><span>{chat.title || 'New chat'}</span>
              </button>
              <button className="history-delete" aria-label={`Delete ${chat.title}`} onClick={() => onDeleteChat(chat.id)}><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
        <div className="sidebar-bottom">
          <div className="profile-avatar">CS</div>
          <div className="profile-copy"><strong>ChatSphere AI</strong><span>Personal workspace</span></div>
          <span className="online-dot" title="Local app" />
        </div>
      </aside>
    </>
  )
}
