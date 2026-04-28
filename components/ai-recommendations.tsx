"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Sparkles, 
  BookOpen, 
  Brain, 
  Target, 
  ChevronRight, 
  Coffee, 
  Zap,
  X,
  RefreshCw,
  Inbox
} from "lucide-react"
import { useDashboardStore, type Recommendation } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

const iconMap = {
  exam_prep: BookOpen,
  spaced_repetition: Brain,
  weekly_goal: Target,
  break_reminder: Coffee,
  focus_session: Zap,
}

function RecommendationSkeleton() {
  return (
    <div className="flex items-start gap-4 rounded-xl p-4 bg-muted/30">
      <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  )
}

function EmptyRecommendations() {
  const { fetchRecommendations } = useDashboardStore()
  
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="rounded-full bg-muted p-3 mb-3">
        <Inbox className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium mb-1">All caught up!</p>
      <p className="text-xs text-muted-foreground mb-3">
        No recommendations right now.
      </p>
      <Button 
        onClick={fetchRecommendations} 
        variant="ghost" 
        size="sm"
        className="text-xs"
      >
        <RefreshCw className="h-3 w-3 mr-1" />
        Check Again
      </Button>
    </div>
  )
}

function RecommendationItem({ rec }: { rec: Recommendation }) {
  const { dismissRecommendation } = useDashboardStore()
  const { toast } = useToast()
  const Icon = iconMap[rec.type] || Sparkles

  const handleAction = () => {
    toast({
      title: rec.title,
      description: `Starting: ${rec.action}`,
    })
  }

  const handleDismiss = () => {
    dismissRecommendation(rec.id)
    toast({
      title: "Recommendation dismissed",
      description: "We'll adjust future suggestions based on your preferences.",
    })
  }

  return (
    <div
      className={`group relative flex items-start gap-4 rounded-xl p-4 transition-all duration-200 hover:bg-muted/50 ${
        rec.priority === "high"
          ? "bg-primary/5 border border-primary/20"
          : "bg-muted/30"
      }`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleDismiss}
      >
        <X className="h-3 w-3" />
      </Button>
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          rec.priority === "high"
            ? "bg-primary/20 text-primary"
            : "bg-muted text-muted-foreground"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0 pr-6">
        <h4 className="font-medium text-sm">{rec.title}</h4>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
          {rec.description}
        </p>
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0 mt-2 text-xs text-primary"
          onClick={handleAction}
        >
          {rec.action}
          <ChevronRight className="h-3 w-3 ml-0.5" />
        </Button>
      </div>
    </div>
  )
}

export function AIRecommendations() {
  const { recommendations, isLoadingRecommendations, error, fetchRecommendations } = useDashboardStore()
  const { toast } = useToast()

  useEffect(() => {
    fetchRecommendations()
  }, [fetchRecommendations])

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading recommendations",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  return (
    <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-lg font-semibold">AI Recommendations</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={fetchRecommendations}
            disabled={isLoadingRecommendations}
          >
            <RefreshCw className={`h-4 w-4 ${isLoadingRecommendations ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoadingRecommendations ? (
          <>
            <RecommendationSkeleton />
            <RecommendationSkeleton />
            <RecommendationSkeleton />
          </>
        ) : recommendations.length === 0 ? (
          <EmptyRecommendations />
        ) : (
          recommendations.map((rec) => (
            <RecommendationItem key={rec.id} rec={rec} />
          ))
        )}
      </CardContent>
    </Card>
  )
}
