import { CheckCircle2, Sparkles } from 'lucide-react'
import { ChatComposer } from './ChatComposer'
import { SuggestionCards } from './SuggestionCards'

type HeroProps = {
  input: string
  loading: boolean
  onInputChange: (value: string) => void
  onSubmit: (question?: string) => void
}

export function Hero({
  input,
  loading,
  onInputChange,
  onSubmit,
}: HeroProps) {
  return (
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

      <ChatComposer
        className="hero-composer"
        value={input}
        placeholder="Ask a cybersecurity question..."
        loading={loading}
        onChange={onInputChange}
        onSubmit={() => onSubmit()}
      />

      <SuggestionCards onSelect={onSubmit} />

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
  )
}