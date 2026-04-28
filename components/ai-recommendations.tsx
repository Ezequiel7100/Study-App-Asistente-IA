"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, BookOpen, Brain, Target, ChevronRight } from "lucide-react"

const recommendations = [
  {
    icon: BookOpen,
    title: "Algebra Exam Prep",
    description: "You have an Algebra exam in 7 days. Recommended: 3 focused sessions + 1 recall quiz.",
    action: "Start Session",
    priority: "high",
  },
  {
    icon: Brain,
    title: "Spaced Repetition",
    description: "Review your Physics flashcards - optimal retention window is today.",
    action: "Review Now",
    priority: "medium",
  },
  {
    icon: Target,
    title: "Weekly Goal Check",
    description: "You&apos;re 85% towards your 25-hour study goal. 3.75 hours remaining.",
    action: "View Progress",
    priority: "low",
  },
]

export function AIRecommendations() {
  return (
    <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-lg font-semibold">AI Recommendations</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec, i) => (
          <div
            key={i}
            className={`group flex items-start gap-4 rounded-xl p-4 transition-all duration-200 hover:bg-muted/50 ${
              rec.priority === "high"
                ? "bg-primary/5 border border-primary/20"
                : "bg-muted/30"
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                rec.priority === "high"
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <rec.icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm">{rec.title}</h4>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {rec.description}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0 h-8 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {rec.action}
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
