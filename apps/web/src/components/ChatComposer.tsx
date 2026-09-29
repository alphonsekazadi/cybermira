import { ArrowUp, Loader2, Terminal } from 'lucide-react'
import type { FormEvent } from 'react'

type ChatComposerProps = {
  value: string
  placeholder: string
  loading: boolean
  className?: string
  onChange: (value: string) => void
  onSubmit: () => void
}

export function ChatComposer({
  value,
  placeholder,
  loading,
  className = '',
  onChange,
  onSubmit,
}: ChatComposerProps) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form
      className={`composer ${className}`.trim()}
      onSubmit={handleSubmit}
    >
      <div className="composer-icon">
        <Terminal size={19} />
      </div>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={loading}
        aria-label="Ask CyberMira a question"
      />

      <button
        className="send-button"
        type="submit"
        disabled={!value.trim() || loading}
        aria-label="Send question"
      >
        {loading ? (
          <Loader2 className="spin" size={18} />
        ) : (
          <ArrowUp size={18} />
        )}
      </button>
    </form>
  )
}