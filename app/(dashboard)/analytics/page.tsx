import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Clock, Target, Brain, Flame, Trophy, Calendar } from "lucide-react"
import { AnalyticsCharts } from "@/components/analytics-charts"

const weeklyStats = [
  { day: "Mon", hours: 4.5 },
  { day: "Tue", hours: 3.2 },
  { day: "Wed", hours: 5.1 },
  { day: "Thu", hours: 2.8 },
  { day: "Fri", hours: 4.0 },
  { day: "Sat", hours: 6.2 },
  { day: "Sun", hours: 3.5 },
]

const subjectBreakdown = [
  { name: "Data Structures", hours: 12, percentage: 28, color: "bg-primary" },
  { name: "Physics", hours: 10, percentage: 24, color: "bg-emerald-500" },
  { name: "Calculus", hours: 8, percentage: 19, color: "bg-amber-500" },
  { name: "Chemistry", hours: 7, percentage: 17, color: "bg-cyan-500" },
  { name: "Others", hours: 5, percentage: 12, color: "bg-muted" },
]

const achievements = [
  { title: "7-Day Streak", icon: Flame, description: "Studied every day this week", earned: true },
  { title: "Early Bird", icon: Calendar, description: "Started studying before 8 AM", earned: true },
  { title: "Deep Focus", icon: Brain, description: "3+ hours uninterrupted session", earned: true },
  { title: "Task Master", icon: Trophy, description: "Complete 50 tasks this month", earned: false, progress: 38 },
]

export default function AnalyticsPage() {
  const totalHours = weeklyStats.reduce((acc, day) => acc + day.hours, 0)
  const avgHours = (totalHours / 7).toFixed(1)
  const maxHours = Math.max(...weeklyStats.map(d => d.hours))

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Track your study performance and progress</p>
        </div>
        <Badge className="gap-1 bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
          <TrendingUp className="h-3 w-3" />
          +15% this week
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalHours.toFixed(1)}h</p>
                <p className="text-xs text-muted-foreground">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgHours}h</p>
                <p className="text-xs text-muted-foreground">Daily Average</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Flame className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">7</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-cyan-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">87%</p>
                <p className="text-xs text-muted-foreground">Goal Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Weekly Study Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-48">
              {weeklyStats.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-primary/20 rounded-t-lg relative overflow-hidden transition-all duration-300 hover:bg-primary/30"
                    style={{ height: `${(day.hours / maxHours) * 100}%` }}
                  >
                    <div
                      className="absolute bottom-0 w-full bg-primary rounded-t-lg transition-all duration-500"
                      style={{ height: `${(day.hours / maxHours) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{day.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Subject Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subjectBreakdown.map((subject, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{subject.name}</span>
                  <span className="text-muted-foreground">{subject.hours}h ({subject.percentage}%)</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${subject.color} rounded-full transition-all duration-500`}
                    style={{ width: `${subject.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border transition-all ${
                  achievement.earned
                    ? "border-primary/30 bg-primary/5"
                    : "border-border/50 opacity-60"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                    achievement.earned ? "bg-primary/10" : "bg-muted"
                  }`}>
                    <achievement.icon className={`h-5 w-5 ${achievement.earned ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  {achievement.earned && (
                    <Badge className="bg-primary/10 text-primary border-primary/20">Earned</Badge>
                  )}
                </div>
                <p className="font-medium">{achievement.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                {!achievement.earned && achievement.progress && (
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{achievement.progress}/50</span>
                      <span>{Math.round((achievement.progress / 50) * 100)}%</span>
                    </div>
                    <Progress value={(achievement.progress / 50) * 100} className="h-1.5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <section>
        <h2 className="text-xl font-semibold mb-4">Detailed Analytics</h2>
        <AnalyticsCharts />
      </section>
    </div>
  )
}
