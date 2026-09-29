import { useEffect, useRef, useState } from 'react'
import type { ChatResponse, Message } from '../types/chat'
import { clearMessages, loadMessages, saveMessages } from '../lib/storage'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

export function useChat() {
  const [messages, setMessages] = useState<Message[]>(loadMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const shouldScrollRef = useRef(false)

  useEffect(() => {
    saveMessages(messages)
  }, [messages])

  useEffect(() => {
    if (!shouldScrollRef.current) {
      return
    }

    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })

    shouldScrollRef.current = false
  }, [messages, loading])

  const sendMessage = async (question: string) => {
    const trimmedQuestion = question.trim()

    if (!trimmedQuestion || loading) {
      return
    }

    setInput('')
    setError('')
    shouldScrollRef.current = true

    setMessages((current) => [
      ...current,
      {
        role: 'user',
        content: trimmedQuestion,
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
          message: trimmedQuestion,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)

        throw new Error(
          data?.detail || 'CyberMira could not process your request.',
        )
      }

      const data: ChatResponse = await response.json()

      shouldScrollRef.current = true

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

  const submitMessage = (question?: string) => {
    const value = question ?? input
    void sendMessage(value)
  }

  const copyAnswer = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content)

      setCopiedIndex(index)

      window.setTimeout(() => {
        setCopiedIndex(null)
      }, 1600)
    } catch {
      // Clipboard access may be unavailable.
    }
  }

  const startNewConversation = () => {
    setMessages([])
    setInput('')
    setError('')
    setCopiedIndex(null)
    shouldScrollRef.current = false

    clearMessages()

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return {
    messages,
    input,
    setInput,
    loading,
    error,
    copiedIndex,
    messagesEndRef,
    sendMessage: submitMessage,
    copyAnswer,
    startNewConversation,
    hasConversation: messages.length > 0,
  }
}