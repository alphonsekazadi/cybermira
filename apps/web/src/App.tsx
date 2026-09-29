import { FormEvent, useState } from 'react'
import {
  ArrowUp,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Copy,
  Loader2,
  ShieldCheck,
  Sparkles,
  Terminal,
} from 'lucide-react'
import './styles.css'

type ChatResponse = {
  message: string
  answer: string
  knowledge_paths: string[]
}

type Message = {
  role: 'user' | 'assistant'
  content: string
  knowledgePaths?: string[]
}

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const suggestions = [
  {
    title: 'Understand BOLA',
    prompt: 'What is BOLA and how can I detect it in a REST API?',
  },
  {
    title: 'Secure FastAPI',
    prompt: 'What are the main authorization risks in a FastAPI application?',
  },
  {
    title: 'Detect SQL injection',
    prompt: 'How can I detect SQL injection safely during development?',
  },
  {
    title: 'Review authentication',
    prompt: 'What should I check when reviewing authentication and session security?',
  },
]

const pathLabels: Record<string, string> = {
  access_control: 'Access Control',
  attack_patterns: 'Attack Patterns',
  'authentication/hardening_and_detection': 'Authentication Hardening',
  'authentication/vulnerabilities': 'Authentication Vulnerabilities',
  detection: 'Detection',
  frameworks: 'Frameworks',
  injection: 'Injection',
  mitigation: 'Mitigation',
  owasp_top_10: 'OWASP Top 10',
}

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const sendMessage = async (event?: FormEvent, preset?: string) => {
    event?.preventDefault()

    const question = (preset ?? input).trim()

    if (!question || loading) {
      return
    }

    setInput('')
    setError('')

    setMessages((current) => [
      ...current,
      {
        role: 'user',
        content: question,
      },
    ])

    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: question,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.detail || 'CyberMira could not process your request.')
      }

      const data: ChatResponse = await response.json()

      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: data.answer,
          knowledgePaths: data.knowledge_paths,
        },
      ])
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'Something went wrong while contacting CyberMira.'

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const copyAnswer = async (content: string, index: number) => {
    await navigator.clipboard.writeText(content)
    setCopiedIndex(index)

    window.setTimeout(() => {
      setCopiedIndex(null)
    }, 1600)
  }

  const hasConversation = messages.length > 0

  return (
    <div className="app-shell">
      <div className="background-grid" />
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      <header className="topbar">
        <a className="brand" href="/">
          <div className="brand-mark">
            <ShieldCheck size={21} strokeWidth={2.2} />
          </div>

          <div>
            <div className="brand-name">CyberMira</div>
            <div className="brand-tagline">Security intelligence for developers</div>
          </div>
        </a>

        <div className="status-pill">
          <span className="status-dot" />
          <span>Knowledge base online</span>
        </div>
      </header>

      <main className={`main-content ${hasConversation ? 'conversation-mode' : ''}`}>
        {!hasConversation ? (
          <section className="hero-section">
            <div className="hero-badge">
              <Sparkles size={14} />
              <span>AI-powered cybersecurity knowledge</span>
            </div>

            <h1>
              Build more secure software
              <span> with better evidence.</span>
            </h1>

            <p className="hero-description">
              Ask CyberMira about vulnerabilities, APIs, authentication, OWASP,
              detection, and mitigation. Answers are grounded in a structured
              cybersecurity knowledge base.
            </p>

            <form className="composer hero-composer" onSubmit={sendMessage}>
              <div className="composer-icon">
                <Terminal size={19} />
              </div>

              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask a cybersecurity question..."
                disabled={loading}
                aria-label="Ask CyberMira a question"
              />

              <button
                className="send-button"
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send question"
              >
                {loading ? <Loader2 className="spin" size={18} /> : <ArrowUp size={18} />}
              </button>
            </form>

            <div className="suggestions">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.title}
                  className="suggestion-card"
                  onClick={() => sendMessage(undefined, suggestion.prompt)}
                >
                  <span>{suggestion.title}</span>
                  <ArrowUp size={14} />
                </button>
              ))}
            </div>

            <div className="trust-row">
              <div>
                <CheckCircle2 size={15} />
                <span>Structured evidence</span>
              </div>
              <div>
                <CheckCircle2 size={15} />
                <span>OWASP & CWE mappings</span>
              </div>
              <div>
                <CheckCircle2 size={15} />
                <span>Defensive guidance</span>
              </div>
            </div>
          </section>
        ) : (
          <section className="conversation">
            <div className="conversation-header">
              <div>
                <span className="eyebrow">CYBERMIRA ASSISTANT</span>
                <h2>Security analysis</h2>
              </div>

              <button
                className="new-chat-button"
                onClick={() => {
                  setMessages([])
                  setError('')
                }}
              >
                New question
              </button>
            </div>

            <div className="messages">
              {messages.map((message, index) => (
                <article
                  className={`message-row ${message.role}`}
                  key={`${message.role}-${index}`}
                >
                  {message.role === 'assistant' && (
                    <div className="assistant-avatar">
                      <ShieldCheck size={18} />
                    </div>
                  )}

                  <div className="message-content">
                    <div className="message-label">
                      {message.role === 'user' ? 'You' : 'CyberMira'}
                    </div>

                    <div className="message-bubble">
                      <MarkdownText text={message.content} />
                    </div>

                    {message.role === 'assistant' && (
                      <div className="evidence-card">
                        <div className="evidence-header">
                          <div className="evidence-title">
                            <BookOpen size={16} />
                            <span>Evidence used</span>
                          </div>

                          <button
                            className="copy-button"
                            onClick={() => copyAnswer(message.content, index)}
                          >
                            {copiedIndex === index ? (
                              <>
                                <CheckCircle2 size={14} />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy size={14} />
                                Copy
                              </>
                            )}
                          </button>
                        </div>

                        <div className="evidence-paths">
                          {message.knowledgePaths?.map((path) => (
                            <span className="evidence-tag" key={path}>
                              <span className="tag-dot" />
                              {pathLabels[path] ?? path}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              ))}

              {loading && (
                <article className="message-row assistant">
                  <div className="assistant-avatar">
                    <ShieldCheck size={18} />
                  </div>

                  <div className="message-content">
                    <div className="message-label">CyberMira</div>

                    <div className="thinking-bubble">
                      <Loader2 className="spin" size={17} />
                      <span>Searching security evidence...</span>
                    </div>
                  </div>
                </article>
              )}

              {error && (
                <div className="error-card">
                  <CircleAlert size={18} />
                  <div>
                    <strong>Unable to complete the analysis</strong>
                    <p>{error}</p>
                  </div>
                </div>
              )}
            </div>

            <form className="composer conversation-composer" onSubmit={sendMessage}>
              <div className="composer-icon">
                <Terminal size={19} />
              </div>

              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask another security question..."
                disabled={loading}
              />

              <button
                className="send-button"
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send question"
              >
                {loading ? <Loader2 className="spin" size={18} /> : <ArrowUp size={18} />}
              </button>
            </form>
          </section>
        )}
      </main>

      <footer className="footer">
        <span>CyberMira</span>
        <span className="footer-separator">•</span>
        <span>AI-powered cybersecurity knowledge for developers</span>
      </footer>
    </div>
  )
}

function MarkdownText({ text }: { text: string }) {
  const blocks = text.split(/\n\n+/)

  return (
    <div className="markdown-content">
      {blocks.map((block, index) => {
        const lines = block.split('\n')

        if (lines.every((line) => line.trim().startsWith('- '))) {
          return (
            <ul key={index}>
              {lines.map((line) => (
                <li key={line}>{formatInline(line.replace(/^- /, ''))}</li>
              ))}
            </ul>
          )
        }

        if (block.startsWith('### ')) {
          return <h3 key={index}>{formatInline(block.replace(/^### /, ''))}</h3>
        }

        if (block.startsWith('## ')) {
          return <h3 key={index}>{formatInline(block.replace(/^## /, ''))}</h3>
        }

        return (
          <p key={index}>
            {lines.map((line, lineIndex) => (
              <span key={`${index}-${lineIndex}`}>
                {formatInline(line)}
                {lineIndex < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        )
      })}
    </div>
  )
}

function formatInline(text: string) {
  const pieces = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)

  return pieces.map((piece, index) => {
    if (piece.startsWith('**') && piece.endsWith('**')) {
      return <strong key={index}>{piece.slice(2, -2)}</strong>
    }

    if (piece.startsWith('`') && piece.endsWith('`')) {
      return <code key={index}>{piece.slice(1, -1)}</code>
    }

    return piece
  })
}

export default App
