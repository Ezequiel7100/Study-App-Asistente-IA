"use client"

import { Clock, FileText, CheckCircle, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    title: "Weekly Study Hours",
    value: "24.5h",
    change: "+12%",
    changeType: "positive" as const,
    icon: Clock,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
  },
  {
    title: "Upcoming Exams",
    value: "3",
    change: "Next: 7 days",
    changeType: "neutral" as const,
    icon: FileText,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    title: "Pending Tasks",
    value: "12",
    change: "5 due today",
    changeType: "warning" as const,
    icon: CheckCircle,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    title: "Productivity Score",
    value: "87%",
    change: "+5%",
    changeType: "positive" as const,
    icon: TrendingUp,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
]

export function StatCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
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
