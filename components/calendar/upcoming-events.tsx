"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  CalendarEvent,
  categoryColors,
  categoryLabels,
} from "@/lib/calendar-store"
import { format, parseISO, isToday, isTomorrow, differenceInDays } from "date-fns"
import { Clock, Repeat, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface UpcomingEventsProps {
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
}

export function UpcomingEvents({ events, onEventClick }: UpcomingEventsProps) {
  const sortedEvents = useMemo(() => {
    const now = new Date()
    return events
      .filter((e) => parseISO(e.start) >= now)
      .sort((a, b) => parseISO(a.start).getTime() - parseISO(b.start).getTime())
      .slice(0, 10)
  }, [events])

  const getRelativeDay = (date: Date) => {
    if (isToday(date)) return "Today"
    if (isTomorrow(date)) return "Tomorrow"
    const days = differenceInDays(date, new Date())
    if (days < 7) return format(date, "EEEE")
    return format(date, "MMM d")
  }

  const groupedEvents = useMemo(() => {
    const groups: Record<string, CalendarEvent[]> = {}
    sortedEvents.forEach((event) => {
      const date = parseISO(event.start)
      const key = format(date, "yyyy-MM-dd")
      if (!groups[key]) groups[key] = []
      groups[key].push(event)
    })
    return groups
  }, [sortedEvents])

  return (
    <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] px-4 pb-4">
          {Object.keys(groupedEvents).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No upcoming events</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedEvents).map(([dateKey, dayEvents]) => {
                const date = parseISO(dateKey)
                return (
                  <div key={dateKey}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">{getRelativeDay(date)}</span>
                      {isToday(date) && (
                        <Badge variant="secondary" className="text-xs">
                          Today
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      {dayEvents.map((event) => {
                        const colors = categoryColors[event.category]
                        return (
                          <div
                            key={event.id}
                            onClick={() => onEventClick(event)}
                            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group"
                          >
                            <div className={cn("h-10 w-1 rounded-full flex-shrink-0", colors.bg)} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                                  {event.title}
                                </p>
                                {event.isRecurring && (
                                  <Repeat className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                )}
                                {event.isAISuggested && (
                                  <Sparkles className="h-3 w-3 text-primary flex-shrink-0" />
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-muted-foreground">
                                  {format(parseISO(event.start), "h:mm a")} -{" "}
                                  {format(parseISO(event.end), "h:mm a")}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={cn("text-[10px] py-0 px-1.5", colors.border)}
                                >
                                  {categoryLabels[event.category]}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
