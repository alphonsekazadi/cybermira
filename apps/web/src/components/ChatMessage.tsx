import { ShieldCheck } from 'lucide-react'
import type { Message } from '../types/chat'
import { EvidenceCard } from './EvidenceCard'
import { MarkdownText } from './MarkdownText'

type ChatMessageProps = {
  message: Message
  index: number
  copied: boolean
  onCopy: () => void
}

export function ChatMessage({
  message,
  index,
  copied,
  onCopy,
}: ChatMessageProps) {
  return (
    <article
      className={`message-row ${message.role}`}
      data-message-index={index}
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
          <EvidenceCard
            paths={message.knowledgePaths}
            copied={copied}
            onCopy={onCopy}
          />
        )}
      </div>
    </article>
  )
}