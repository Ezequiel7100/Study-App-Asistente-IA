"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Bot, Send, Sparkles, BookOpen, Calculator, FlaskConical, Lightbulb, User } from "lucide-react"

type Message = {
  id: number
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const quickPrompts = [
  { label: "Explain Concepts", icon: BookOpen, prompt: "Explain the concept of..." },
  { label: "Solve Problem", icon: Calculator, prompt: "Help me solve this problem..." },
  { label: "Study Tips", icon: Lightbulb, prompt: "Give me study tips for..." },
  { label: "Quiz Me", icon: FlaskConical, prompt: "Quiz me on..." },
]

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content: "Hello! I'm your AI Study Assistant. I can help you understand complex topics, solve problems, create study plans, and quiz you on your subjects. What would you like to learn today?",
    timestamp: new Date(),
  },
]

export default function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's a great question! Let me break this down for you...\n\nThe key concept here involves understanding the relationship between the variables. Think of it like building blocks - each piece connects to form the whole picture.\n\nWould you like me to provide a specific example or practice problem?",
        "I'd be happy to help with that! Here's a step-by-step approach:\n\n1. First, identify the main components\n2. Analyze the relationships between them\n3. Apply the relevant formulas or concepts\n4. Verify your solution\n\nShall I elaborate on any of these steps?",
        "Based on your question, I think you're dealing with a fundamental concept in this subject. Let me explain it in simpler terms...\n\nThe core idea is that everything connects in a logical sequence. Once you understand the foundation, the advanced topics become much clearer.\n\nDo you want me to create some practice questions for you?",
      ]
      
      const assistantMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      }
      
      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
  }

  return (
    <div className="container max-w-5xl mx-auto p-6 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            AI Tutor
          </h1>
          <p className="text-muted-foreground">Your personal study assistant</p>
        </div>
        <Badge className="gap-1 bg-primary/10 text-primary border-primary/20">
          <Sparkles className="h-3 w-3" />
          Powered by AI
        </Badge>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {quickPrompts.map((item, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl"
            onClick={() => handleQuickPrompt(item.prompt)}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </div>

      <Card className="flex-1 rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm flex flex-col overflow-hidden">
        <CardContent className="flex-1 overflow-auto p-4 space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-60 mt-2">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              {message.role === "user" && (
                <div className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3 items-center">
              <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="bg-muted rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        <div className="p-4 border-t border-border/50">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me anything about your studies..."
              className="flex-1 h-12 rounded-xl bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="h-12 w-12 rounded-xl"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
