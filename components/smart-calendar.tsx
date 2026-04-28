"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { useCalendarStore, categoryColors } from "@/lib/calendar-store"
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  parseISO,
  getHours,
  getMinutes,
  differenceInMinutes,
  addWeeks,
  subWeeks,
} from "date-fns"

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const hours = ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM", "8 PM"]

const typeColors = [
  { type: "class", label: "Classes", color: "bg-chart-1" },
  { type: "study", label: "Study", color: "bg-chart-2" },
  { type: "gym", label: "Gym", color: "bg-chart-3" },
  { type: "work", label: "Work", color: "bg-chart-4" },
  { type: "exam", label: "Exams", color: "bg-destructive" },
]

export function SmartCalendar() {
  const { events, selectedDate, setSelectedDate } = useCalendarStore()
  const currentDate = useMemo(() => parseISO(selectedDate), [selectedDate])

  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
    return eachDayOfInterval({ start: weekStart, end: weekEnd })
  }, [currentDate])

  const weekEvents = useMemo(() => {
    return events.filter((event) => {
      const eventDate = parseISO(event.start)
      return weekDays.some((day) => isSameDay(eventDate, day))
    })
  }, [events, weekDays])

  const navigatePrev = () => {
    setSelectedDate(subWeeks(currentDate, 1).toISOString())
  }

  const navigateNext = () => {
    setSelectedDate(addWeeks(currentDate, 1).toISOString())
  }

  const getEventPosition = (event: typeof weekEvents[0]) => {
    const start = parseISO(event.start)
    const end = parseISO(event.end)
    const dayIndex = weekDays.findIndex((d) => isSameDay(d, start))
    const startHour = getHours(start)
    const startMinute = getMinutes(start)
    const duration = differenceInMinutes(end, start)

    // Map to our hour slots (8 AM = 0, 10 AM = 1, etc.)
    const hourIndex = Math.floor((startHour - 8) / 2)
    const slotOffset = ((startHour - 8) % 2 === 1 ? 0.5 : 0) + startMinute / 120

    return {
      dayIndex,
      hourIndex: hourIndex + slotOffset,
      duration: duration / 120, // Convert to 2-hour slots
    }
  }

  return (
    <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">Weekly Schedule</CardTitle>
          <p className="text-sm text-muted-foreground">
            {format(weekDays[0], "MMM d")} - {format(weekDays[6], "MMM d, yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={navigatePrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={navigateNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 rounded-lg gap-1" asChild>
            <Link href="/calendar">
              <ExternalLink className="h-3.5 w-3.5" />
              Full Calendar
            </Link>
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
            {weekDays.map((day, idx) => {
              const isToday = isSameDay(day, new Date(2026, 3, 28)) // Demo today
              return (
                <div
                  key={idx}
                  className={`border-r border-border/50 p-2 text-center ${
                    isToday ? "bg-primary/5" : ""
                  }`}
                >
                  <span className="text-xs font-medium text-muted-foreground">
                    {format(day, "EEE")}
                  </span>
                  <p className={`text-sm font-semibold ${isToday ? "text-primary" : ""}`}>
                    {format(day, "d")}
                  </p>
                </div>
              )
            })}
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
                    {weekEvents
                      .filter((e) => {
                        const pos = getEventPosition(e)
                        return pos.dayIndex === dayIdx && Math.floor(pos.hourIndex) === hourIdx
                      })
                      .map((event) => {
                        const pos = getEventPosition(event)
                        const colors = categoryColors[event.category]
                        return (
                          <div
                            key={event.id}
                            className={`absolute inset-x-0.5 rounded-lg p-1.5 ${colors.bg} ${colors.text}`}
                            style={{
                              top: `${(pos.hourIndex - hourIdx) * 56}px`,
                              height: `${Math.max(pos.duration * 56, 28)}px`,
                            }}
                          >
                            <p className="text-[10px] font-medium leading-tight truncate">
                              {event.title}
                            </p>
                          </div>
                        )
                      })}
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
