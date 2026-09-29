export type ChatResponse = {
  message: string
  answer: string
  knowledge_paths: string[]
}

export type Message = {
  role: 'user' | 'assistant'
  content: string
  knowledgePaths?: string[]
}