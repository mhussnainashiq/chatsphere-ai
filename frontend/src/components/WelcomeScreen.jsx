import { Sparkles, Code2, Lightbulb, BookOpen, PenLine, ArrowUpRight } from 'lucide-react'

const prompts = [
  { icon: Code2, title: 'Build something', text: 'Help me plan a modern React application' },
  { icon: Lightbulb, title: 'Explore an idea', text: 'Explain how large language models work' },
  { icon: BookOpen, title: 'Learn a topic', text: 'Teach me Python APIs with a simple example' },
  { icon: PenLine, title: 'Write with AI', text: 'Help me write a professional project README' },
]

export default function WelcomeScreen({ onPrompt }) {
  return (
    <div className="welcome-screen">
      <div className="welcome-icon"><Sparkles size={27} /></div>
      <p className="eyebrow">YOUR AI WORKSPACE</p>
      <h1>Ideas start with<br /><span>a conversation.</span></h1>
      <p className="welcome-description">Think, create, learn, and solve problems with your AI assistant.</p>
      <div className="prompt-grid">
        {prompts.map(({ icon: Icon, title, text }) => (
          <button className="prompt-card" key={title} onClick={() => onPrompt(text)}>
            <span className="prompt-icon"><Icon size={18} /></span><span className="prompt-copy"><strong>{title}</strong><small>{text}</small></span><ArrowUpRight className="prompt-arrow" size={16} />
          </button>
        ))}
      </div>
    </div>
  )
}
