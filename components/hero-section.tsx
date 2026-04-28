"use client"

import { Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-chart-2/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
          <Sparkles className="h-3 w-3" />
          AI-Powered Learning
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
          Your Academic Copilot
        </h1>
        <p className="mt-3 text-muted-foreground text-balance max-w-lg leading-relaxed">
          Organize your study life with AI-powered planning, dynamic scheduling, and
          intelligent tutoring. Let StudySync optimize your learning journey.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button className="h-11 rounded-xl bg-primary px-6 hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all duration-200">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-11 rounded-xl border-border/50 px-6 hover:bg-muted/50"
          >
            Watch Demo
          </Button>
        </div>
      </div>
    </div>
  )
}
