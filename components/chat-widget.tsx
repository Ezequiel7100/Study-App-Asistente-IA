"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, Send, Sparkles } from "lucide-react"

const quickActions = [
  "Explain derivatives",
  "Quiz me on Physics",
  "Create study plan",
  "Summarize my notes",
]

export function ChatWidget() {
  const [message, setMessage] = useState("")

  return (
    <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Bot className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">AI Tutor</CardTitle>
            <p className="text-xs text-muted-foreground">Always ready to help</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="flex-1 space-y-4">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 shrink-0 bg-primary">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                <Sparkles className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="rounded-2xl rounded-tl-none bg-muted/50 px-4 py-3 max-w-[85%]">
              <p className="text-sm">
                Hi Jane! I noticed you have an Algebra exam coming up. Would you like me
                to create a personalized study plan or quiz you on any topics?
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <Button
              key={action}
              variant="outline"
              size="sm"
              className="h-8 rounded-full text-xs border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
            >
              {action}
            </Button>
          ))}
        </div>
        <div className="relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask StudySync AI anything..."
            className="h-12 rounded-xl bg-muted/50 border-0 pr-12 focus-visible:ring-1 focus-visible:ring-primary"
          />
          <Button
            size="icon"
            className="absolute right-1.5 top-1.5 h-9 w-9 rounded-lg bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
