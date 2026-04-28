"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Flame, CheckCircle2, Brain } from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

const studyHoursData = [
  { day: "Mon", hours: 4.5 },
  { day: "Tue", hours: 3.2 },
  { day: "Wed", hours: 5.1 },
  { day: "Thu", hours: 4.8 },
  { day: "Fri", hours: 6.2 },
  { day: "Sat", hours: 2.5 },
  { day: "Sun", hours: 3.8 },
]

const completionData = [
  { subject: "Math", rate: 92 },
  { subject: "Physics", rate: 78 },
  { subject: "CS", rate: 85 },
  { subject: "Chem", rate: 65 },
]

const streakDays = [true, true, true, true, true, false, true]

export function AnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Study Hours Chart */}
      <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-1/10">
              <BarChart3 className="h-4 w-4 text-chart-1" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Study Hours</CardTitle>
              <p className="text-xs text-muted-foreground">This week: 30.1 hours</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studyHoursData}>
                <defs>
                  <linearGradient id="studyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.55 0.25 265)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="oklch(0.55 0.25 265)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "oklch(0.5 0 0)", fontSize: 11 }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.16 0.01 265)",
                    border: "1px solid oklch(0.25 0.02 265)",
                    borderRadius: "8px",
                    color: "oklch(0.95 0 0)",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`${value}h`, "Study Time"]}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="oklch(0.55 0.25 265)"
                  strokeWidth={2}
                  fill="url(#studyGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Streak */}
      <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-3/10">
              <Flame className="h-4 w-4 text-chart-3" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Study Streak</CardTitle>
              <p className="text-xs text-muted-foreground">Keep the momentum!</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-3 py-6">
            {streakDays.map((active, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div
                  className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${
                    active
                      ? "bg-chart-3 text-primary-foreground shadow-lg shadow-chart-3/30"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Flame className="h-5 w-5" />
                </div>
                <span className="text-xs text-muted-foreground">
                  {["M", "T", "W", "T", "F", "S", "S"][i]}
                </span>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">6 Days</p>
            <p className="text-sm text-muted-foreground">Current streak</p>
          </div>
        </CardContent>
      </Card>

      {/* Completion Rate */}
      <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-2/10">
              <CheckCircle2 className="h-4 w-4 text-chart-2" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Completion Rate</CardTitle>
              <p className="text-xs text-muted-foreground">By subject</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionData} layout="vertical">
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis
                  type="category"
                  dataKey="subject"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "oklch(0.5 0 0)", fontSize: 11 }}
                  width={50}
                />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.16 0.01 265)",
                    border: "1px solid oklch(0.25 0.02 265)",
                    borderRadius: "8px",
                    color: "oklch(0.95 0 0)",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`${value}%`, "Completion"]}
                />
                <Bar dataKey="rate" radius={[0, 6, 6, 0]} barSize={24}>
                  {completionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.rate >= 80
                          ? "oklch(0.65 0.2 150)"
                          : entry.rate >= 60
                          ? "oklch(0.75 0.12 40)"
                          : "oklch(0.65 0.2 330)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Cognitive Load */}
      <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-4/10">
              <Brain className="h-4 w-4 text-chart-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Cognitive Load</CardTitle>
              <p className="text-xs text-muted-foreground">Optimal learning zone</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <div className="relative h-32 w-32">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="oklch(0.22 0.02 265)"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="oklch(0.65 0.2 330)"
                strokeWidth="3"
                strokeDasharray="72, 100"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">72%</span>
              <span className="text-xs text-muted-foreground">Optimal</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-center text-muted-foreground max-w-[200px]">
            Your cognitive load is in the optimal zone for effective learning.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
