import { Sparkles } from 'lucide-react'

export default function TypingIndicator() {
  return <div className="typing-row"><div className="message-avatar assistant-avatar"><Sparkles size={17} /></div><div className="typing-content"><strong>ChatSphere is thinking</strong><span className="typing-dots"><i /><i /><i /></span></div></div>
}
