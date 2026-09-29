import { ArrowUp } from 'lucide-react'

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
    prompt:
      'What should I check when reviewing authentication and session security?',
  },
]

type SuggestionCardsProps = {
  onSelect: (prompt: string) => void
}

export function SuggestionCards({ onSelect }: SuggestionCardsProps) {
  return (
    <div className="suggestions">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion.title}
          className="suggestion-card"
          onClick={() => onSelect(suggestion.prompt)}
        >
          <span>{suggestion.title}</span>
          <ArrowUp size={14} />
        </button>
      ))}
    </div>
  )
}