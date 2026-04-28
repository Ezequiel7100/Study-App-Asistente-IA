"use client"

import { useMemo } from "react"
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from "date-fns"
import {
  CalendarEvent,
  categoryColors,
  getEventsForDate,
} from "@/lib/calendar-store"
import { useDraggable, useDroppable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"
import { Repeat } from "lucide-react"

interface MonthViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onDateClick: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
}

interface DraggableEventProps {
  event: CalendarEvent
  onClick: () => void
}

function DraggableEvent({ event, onClick }: DraggableEventProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: event.id,
    data: { event },
  })

  const colors = categoryColors[event.category]

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={cn(
        "group relative rounded px-1.5 py-0.5 text-xs truncate cursor-grab active:cursor-grabbing transition-all",
        colors.bg,
        colors.text,
        isDragging && "opacity-50 scale-95",
        event.isAISuggested && "ring-2 ring-primary ring-offset-1"
      )}
    >
      <span className="truncate">{event.title}</span>
      {event.isRecurring && (
        <Repeat className="absolute right-1 top-1/2 -translate-y-1/2 h-2.5 w-2.5 opacity-70" />
      )}
    </div>
  )
}

interface DroppableDayProps {
  date: Date
  isCurrentMonth: boolean
  events: CalendarEvent[]
  onDateClick: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
}

function DroppableDay({
  date,
  isCurrentMonth,
  events,
  onDateClick,
  onEventClick,
}: DroppableDayProps) {
  const dateStr = format(date, "yyyy-MM-dd")
  const { setNodeRef, isOver } = useDroppable({
    id: dateStr,
    data: { date },
  })

  const today = isToday(date)

  return (
    <div
      ref={setNodeRef}
      onClick={() => onDateClick(date)}
      className={cn(
        "min-h-24 md:min-h-28 p-1 border-b border-r border-border/30 transition-colors cursor-pointer",
        !isCurrentMonth && "bg-muted/30",
        isOver && "bg-primary/10",
        today && "bg-primary/5"
      )}
    >
      <div
        className={cn(
          "text-sm font-medium p-1 w-7 h-7 flex items-center justify-center rounded-full",
          today && "bg-primary text-primary-foreground",
          !isCurrentMonth && "text-muted-foreground"
        )}
      >
        {format(date, "d")}
      </div>
      <div className="space-y-0.5 mt-1">
        {events.slice(0, 3).map((event) => (
          <DraggableEvent
            key={event.id}
            event={event}
            onClick={() => onEventClick(event)}
          />
        ))}
        {events.length > 3 && (
          <div className="text-xs text-muted-foreground px-1">
            +{events.length - 3} more
          </div>
        )}
      </div>
    </div>
  )
}

export function MonthView({
  currentDate,
  events,
  onDateClick,
  onEventClick,
}: MonthViewProps) {
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calendarStart = startOfWeek(monthStart)
    const calendarEnd = endOfWeek(monthEnd)

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }, [currentDate])

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden">
      <div className="grid grid-cols-7 bg-muted/50">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-muted-foreground border-b border-r border-border/30"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((date) => {
          const dayEvents = events.filter((e) =>
            isSameDay(parseISO(e.start), date)
          )
          return (
            <DroppableDay
              key={date.toISOString()}
              date={date}
              isCurrentMonth={isSameMonth(date, currentDate)}
              events={dayEvents}
              onDateClick={onDateClick}
              onEventClick={onEventClick}
            />
          )
        })}
      </div>
    </div>
  )
}
