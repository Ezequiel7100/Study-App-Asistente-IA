"use client"

import { useEffect } from "react"
import { Clock, FileText, CheckCircle, TrendingUp, RefreshCw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useDashboardStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

function StatCardSkeleton() {
  return (
    <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-11 w-11 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState() {
  const { refreshAll } = useDashboardStore()
  
  return (
    <Card className="col-span-full rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm">
      <CardContent className="p-8 flex flex-col items-center justify-center text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <TrendingUp className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg mb-1">No data available</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Start tracking your study sessions to see your stats here.
        </p>
        <Button onClick={refreshAll} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardContent>
    </Card>
  )
}

export function StatCards() {
  const { stats, isLoadingStats, error, fetchStats } = useDashboardStore()
  const { toast } = useToast()

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading stats",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  if (isLoadingStats) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <EmptyState />
      </div>
    )
  }

  const statItems = [
    {
      title: "Weekly Study Hours",
      value: `${stats.weeklyStudyHours}h`,
      change: `${stats.weeklyStudyChange >= 0 ? "+" : ""}${stats.weeklyStudyChange}%`,
      changeType: stats.weeklyStudyChange >= 0 ? "positive" : "negative",
      icon: Clock,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Upcoming Exams",
      value: String(stats.upcomingExams.length),
      change: stats.upcomingExams.length > 0 
        ? `Next: ${stats.upcomingExams[0].daysUntil} days` 
        : "None scheduled",
      changeType: "neutral",
      icon: FileText,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Pending Tasks",
      value: String(stats.pendingTasks.filter(t => !t.completed).length),
      change: `${stats.tasksDueToday} due today`,
      changeType: stats.tasksDueToday > 3 ? "warning" : "neutral",
      icon: CheckCircle,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Productivity Score",
      value: `${stats.productivityScore}%`,
      change: `${stats.productivityChange >= 0 ? "+" : ""}${stats.productivityChange}%`,
      changeType: stats.productivityChange >= 0 ? "positive" : "negative",
      icon: TrendingUp,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((stat) => (
        <Card
          key={stat.title}
          className="group relative overflow-hidden rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                <p
                  className={`text-xs font-medium ${
                    stat.changeType === "positive"
                      ? "text-emerald-500"
                      : stat.changeType === "warning"
                      ? "text-amber-500"
                      : stat.changeType === "negative"
                      ? "text-red-500"
                      : "text-muted-foreground"
                  }`}
                >
                  {stat.change}
                </p>
              </div>
              <div className={`rounded-xl p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
