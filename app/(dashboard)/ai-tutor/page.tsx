"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useChat } from "@ai-sdk/react"
import { useChatStore } from "@/lib/chat-store"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { MarkdownRenderer } from "@/components/chat/markdown-renderer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  Calculator,
  FlaskConical,
  Lightbulb,
  User,
  Calendar,
  Brain,
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  StopCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

const suggestedPrompts = [
  {
    label: "Build Study Plan",
    icon: Calendar,
    prompt: "Help me create a study plan for my upcoming exams. I have finals in 2 weeks for Calculus, Physics, and Computer Science.",
  },
  {
    label: "Explain Topic",
    icon: BookOpen,
    prompt: "Explain the concept of neural networks in simple terms with examples.",
  },
  {
    label: "Quiz Me",
    icon: FlaskConical,
    prompt: "Create a 5-question quiz on derivatives and integrals to test my understanding.",
  },
  {
    label: "Solve Problem",
    icon: Calculator,
    prompt: "Help me solve this problem step by step:",
  },
  {
    label: "Summarize Notes",
    icon: FileText,
    prompt: "Summarize the key points from my notes on:",
  },
  {
    label: "Study Tips",
    icon: Lightbulb,
    prompt: "Give me effective study strategies for retaining information in a technical subject.",
  },
]

type FileAttachment = {
  name: string
  type: string
  url: string
  file: File
}

export default function AITutorPage() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const {
    activeConversationId,
    createConversation,
    getActiveConversation,
    addMessage,
    updateMessage,
  } = useChatStore()

  const conversation = getActiveConversation()
  const [attachments, setAttachments] = useState<FileAttachment[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize conversation if none exists
  useEffect(() => {
    if (!activeConversationId && !isInitialized) {
      createConversation()
      setIsInitialized(true)
    }
  }, [activeConversationId, createConversation, isInitialized])

  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
  } = useChat({
    api: "/api/chat",
    initialMessages: conversation?.messages.map((m) => ({
      id: m.id,
      role: m.role as "user" | "assistant",
      content: m.content,
    })) || [],
    onFinish: (message) => {
      if (activeConversationId) {
        addMessage(activeConversationId, {
          role: "assistant",
          content: message.content,
        })
      }
    },
  })

  // Ensure input is always a string (fallback for SSR)
  const inputValue = input ?? ""

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [inputValue])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newAttachments: FileAttachment[] = files.map((file) => ({
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      file,
    }))
    setAttachments((prev) => [...prev, ...newAttachments])
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => {
      const newAttachments = [...prev]
      URL.revokeObjectURL(newAttachments[index].url)
      newAttachments.splice(index, 1)
      return newAttachments
    })
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() && attachments.length === 0) return

    // Add user message to store
    if (activeConversationId) {
      const attachmentInfo = attachments.length > 0
        ? `\n\n[Attached files: ${attachments.map(a => a.name).join(", ")}]`
        : ""
      addMessage(activeConversationId, {
        role: "user",
        content: inputValue + attachmentInfo,
        attachments: attachments.map(a => ({ name: a.name, type: a.type, url: a.url })),
      })
    }

    // Clear attachments
    setAttachments([])

    // Submit to AI
    handleSubmit(e)
  }

  const handlePromptClick = (prompt: string) => {
    setInput(prompt)
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend(e)
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <ChatSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold flex items-center gap-2">
                AI Tutor
                <Badge className="gap-1 bg-primary/10 text-primary border-primary/20 text-xs">
                  <Sparkles className="h-3 w-3" />
                  GPT-4
                </Badge>
              </h1>
              <p className="text-sm text-muted-foreground">Your academic copilot</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Brain className="h-3 w-3" />
              {messages.length} messages
            </Badge>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-6">
          <div className="max-w-3xl mx-auto py-6 space-y-6">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Welcome to AI Tutor</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  I&apos;m your personal study assistant. Ask me anything about your coursework, and I&apos;ll help you learn effectively.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
                  {suggestedPrompts.map((prompt, index) => (
                    <Card
                      key={index}
                      className="p-4 cursor-pointer hover:bg-muted/50 transition-colors rounded-xl border-border/50"
                      onClick={() => handlePromptClick(prompt.prompt)}
                    >
                      <prompt.icon className="h-5 w-5 text-primary mb-2" />
                      <p className="text-sm font-medium">{prompt.label}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-4",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50"
                  )}
                >
                  {message.role === "assistant" ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <MarkdownRenderer content={message.content} />
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
                {message.role === "user" && (
                  <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4">
                <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="bg-muted/50 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="px-6 py-4 border-t border-border/50">
          <div className="max-w-3xl mx-auto">
            {/* Attachments Preview */}
            {attachments.length > 0 && (
              <div className="flex gap-2 mb-3 flex-wrap">
                {attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2"
                  >
                    {attachment.type.startsWith("image/") ? (
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm truncate max-w-[150px]">
                      {attachment.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => removeAttachment(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSend} className="relative">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about your studies..."
                className="min-h-[56px] max-h-[200px] resize-none rounded-2xl bg-muted/50 border-0 pr-24 focus-visible:ring-1 focus-visible:ring-primary"
                rows={1}
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.txt,.doc,.docx"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                {isLoading ? (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-9 w-9 rounded-xl"
                    onClick={stop}
                  >
                    <StopCircle className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="icon"
                    className="h-9 w-9 rounded-xl"
                    disabled={!inputValue.trim() && attachments.length === 0}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-3">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
