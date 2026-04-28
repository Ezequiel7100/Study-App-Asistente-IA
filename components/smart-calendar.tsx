"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const hours = ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM", "8 PM"]

const events = [
  { day: 0, startHour: 0, duration: 2, title: "Calculus III", type: "class", color: "bg-chart-1" },
  { day: 0, startHour: 3, duration: 2, title: "Study Block", type: "study", color: "bg-chart-2" },
  { day: 1, startHour: 1, duration: 2, title: "Physics Lab", type: "class", color: "bg-chart-1" },
  { day: 1, startHour: 4, duration: 1, title: "Gym", type: "gym", color: "bg-chart-3" },
  { day: 2, startHour: 0, duration: 2, title: "Data Structures", type: "class", color: "bg-chart-1" },
  { day: 2, startHour: 3, duration: 2, title: "Study Block", type: "study", color: "bg-chart-2" },
  { day: 3, startHour: 2, duration: 2, title: "Part-time Work", type: "work", color: "bg-chart-4" },
  { day: 3, startHour: 5, duration: 1, title: "Gym", type: "gym", color: "bg-chart-3" },
  { day: 4, startHour: 0, duration: 3, title: "Algebra Exam", type: "exam", color: "bg-destructive" },
  { day: 4, startHour: 4, duration: 2, title: "Study Block", type: "study", color: "bg-chart-2" },
  { day: 5, startHour: 1, duration: 2, title: "Study Block", type: "study", color: "bg-chart-2" },
  { day: 6, startHour: 2, duration: 2, title: "Review Session", type: "study", color: "bg-chart-2" },
]

const typeColors = [
  { type: "class", label: "Classes", color: "bg-chart-1" },
  { type: "study", label: "Study", color: "bg-chart-2" },
  { type: "gym", label: "Gym", color: "bg-chart-3" },
  { type: "work", label: "Work", color: "bg-chart-4" },
  { type: "exam", label: "Exams", color: "bg-destructive" },
]

export function SmartCalendar() {
  return (
    <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">Weekly Schedule</CardTitle>
          <p className="text-sm text-muted-foreground">April 28 - May 4, 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 mb-4">
          {typeColors.map((item) => (
            <div key={item.type} className="flex items-center gap-1.5">
              <div className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="relative overflow-hidden rounded-xl border border-border/50">
          <div className="grid grid-cols-8">
            <div className="border-r border-border/50" />
            {days.map((day, idx) => (
              <div
                key={day}
                className={`border-r border-border/50 p-2 text-center ${
                  idx === 0 ? "bg-primary/5" : ""
                }`}
              >
                <span className="text-xs font-medium text-muted-foreground">{day}</span>
                <p className={`text-sm font-semibold ${idx === 0 ? "text-primary" : ""}`}>
                  {28 + idx > 30 ? idx - 2 : 28 + idx}
                </p>
              </div>
            ))}
          </div>
          <div className="relative">
            {hours.map((hour, hourIdx) => (
              <div key={hour} className="grid grid-cols-8 border-t border-border/30">
                <div className="border-r border-border/50 p-2 text-right">
                  <span className="text-xs text-muted-foreground">{hour}</span>
                </div>
                {days.map((_, dayIdx) => (
                  <div
                    key={dayIdx}
                    className="relative h-14 border-r border-border/30"
                  >
                    {events
                      .filter((e) => e.day === dayIdx && e.startHour === hourIdx)
                      .map((event, i) => (
                        <div
                          key={i}
                          className={`absolute inset-x-0.5 top-0.5 rounded-lg p-1.5 ${event.color} text-primary-foreground`}
                          style={{ height: `${event.duration * 56 - 4}px` }}
                        >
                          <p className="text-[10px] font-medium leading-tight truncate">
                            {event.title}
                          </p>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
