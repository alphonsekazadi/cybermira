import { CircleAlert, Loader2, ShieldCheck } from 'lucide-react'
import type { RefObject } from 'react'
import { ChatComposer } from './ChatComposer'
import { ChatMessage } from './ChatMessage'
import type { Message } from '../types/chat'

type ConversationProps = {
  messages: Message[]
  input: string
  loading: boolean
  error: string
  copiedIndex: number | null
  messagesEndRef: RefObject<HTMLDivElement | null>  
  onInputChange: (value: string) => void
  onSubmit: () => void
  onCopy: (content: string, index: number) => void
  onNewConversation: () => void
}

export function Conversation({
  messages,
  input,
  loading,
  error,
  copiedIndex,
  messagesEndRef,
  onInputChange,
  onSubmit,
  onCopy,
  onNewConversation,
}: ConversationProps) {
  return (
    <section className="conversation">
      <div className="conversation-header">
        <div>
          <span className="eyebrow">CYBERMIRA ASSISTANT</span>
          <h2>Security analysis</h2>
        </div>

        <button
          className="new-chat-button"
          onClick={onNewConversation}
        >
          New question
        </button>
      </div>

      <div className="messages">
        {messages.map((message, index) => (
          <ChatMessage
            key={`${message.role}-${index}`}
            message={message}
            index={index}
            copied={copiedIndex === index}
            onCopy={() => onCopy(message.content, index)}
          />
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

        <div ref={messagesEndRef} />
      </div>

      <ChatComposer
        className="conversation-composer"
        value={input}
        placeholder="Ask another security question..."
        loading={loading}
        onChange={onInputChange}
        onSubmit={onSubmit}
      />
    </section>
  )
}