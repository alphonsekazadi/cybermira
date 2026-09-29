import './styles.css'
import { Background } from './components/Background'
import { Conversation } from './components/Conversation'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { useChat } from './hooks/useChat'

function App() {
  const chat = useChat()

  return (
    <div className="app-shell">
      <Background />

      <Header />

      <main
        className={`main-content ${
          chat.hasConversation ? 'conversation-mode' : ''
        }`}
      >
        {chat.hasConversation ? (
          <Conversation
            messages={chat.messages}
            input={chat.input}
            loading={chat.loading}
            error={chat.error}
            copiedIndex={chat.copiedIndex}
            messagesEndRef={chat.messagesEndRef}
            onInputChange={chat.setInput}
            onSubmit={() => chat.sendMessage()}
            onCopy={chat.copyAnswer}
            onNewConversation={chat.startNewConversation}
          />
        ) : (
          <Hero
            input={chat.input}
            loading={chat.loading}
            onInputChange={chat.setInput}
            onSubmit={(question) => chat.sendMessage(question)}
          />
        )}
      </main>

      <Footer />
    </div>
  )
}

export default App