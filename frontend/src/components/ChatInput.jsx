import { ArrowUp, Paperclip, ShieldCheck } from 'lucide-react'
import { useState } from 'react'

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('')
  function submit(event) {
    event.preventDefault()
    if (!value.trim() || disabled) return
    onSend(value)
    setValue('')
  }
  function keyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit(event)
    }
  }
  return (
    <div className="composer-wrap">
      <form className="composer" onSubmit={submit}>
        <textarea value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={keyDown} placeholder="Message ChatSphere..." rows={1} maxLength={12000} aria-label="Message ChatSphere" />
        <div className="composer-footer">
          <div className="composer-hint"><Paperclip size={15} /><span>Ask anything · Shift + Enter for a new line</span></div>
          <button className="send-button" type="submit" disabled={!value.trim() || disabled} aria-label="Send message"><ArrowUp size={19} /></button>
        </div>
      </form>
      <p className="privacy-note"><ShieldCheck size={13} /> Your conversations are stored locally in this app's database. AI responses can be inaccurate.</p>
    </div>
  )
}
