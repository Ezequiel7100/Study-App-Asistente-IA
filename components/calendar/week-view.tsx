"use client"

import { useMemo } from "react"
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isToday,
  parseISO,
  isSameDay,
  getHours,
  getMinutes,
  differenceInMinutes,
} from "date-fns"
import {
  CalendarEvent,
  categoryColors,
} from "@/lib/calendar-store"
import { useDraggable, useDroppable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"
import { Repeat } from "lucide-react"

interface WeekViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onTimeSlotClick: (date: Date, hour: number) => void
  onEventClick: (event: CalendarEvent) => void
}

const hours = Array.from({ length: 14 }, (_, i) => i + 7) // 7 AM to 8 PM

interface DraggableWeekEventProps {
  event: CalendarEvent
  onClick: () => void
  style: React.CSSProperties
}

function DraggableWeekEvent({ event, onClick, style }: DraggableWeekEventProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: event.id,
    data: { event },
  })

  const colors = categoryColors[event.category]
  const startTime = format(parseISO(event.start), "h:mm a")

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      style={style}
      className={cn(
        "absolute inset-x-1 rounded-lg p-1.5 text-xs cursor-grab active:cursor-grabbing overflow-hidden transition-all",
        colors.bg,
        colors.text,
        isDragging && "opacity-50 scale-95 z-50",
        event.isAISuggested && "ring-2 ring-primary ring-offset-1"
      )}
    >
      <div className="flex items-center gap-1">
        <span className="font-medium truncate">{event.title}</span>
        {event.isRecurring && <Repeat className="h-3 w-3 flex-shrink-0 opacity-70" />}
      </div>
      <span className="opacity-80">{startTime}</span>
    </div>
  )
}

interface DroppableTimeSlotProps {
  date: Date
  hour: number
  onClick: () => void
}

function DroppableTimeSlot({ date, hour, onClick }: DroppableTimeSlotProps) {
  const slotDate = new Date(date)
  slotDate.setHours(hour, 0, 0, 0)
  const slotId = slotDate.toISOString()

  const { setNodeRef, isOver } = useDroppable({
    id: slotId,
    data: { date: slotDate, hour },
  })

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={cn(
        "h-14 border-b border-border/30 cursor-pointer hover:bg-muted/30 transition-colors",
        isOver && "bg-primary/10"
      )}
    />
  )
}

export function WeekView({
  currentDate,
  events,
  onTimeSlotClick,
  onEventClick,
}: WeekViewProps) {
  const days = useMemo(() => {
    const weekStart = startOfWeek(currentDate)
    const weekEnd = endOfWeek(currentDate)
    return eachDayOfInterval({ start: weekStart, end: weekEnd })
  }, [currentDate])

  const getEventStyle = (event: CalendarEvent): React.CSSProperties => {
    const start = parseISO(event.start)
    const end = parseISO(event.end)
    const startHour = getHours(start)
    const startMinute = getMinutes(start)
    const duration = differenceInMinutes(end, start)

    const top = ((startHour - 7) * 56) + (startMinute / 60) * 56
    const height = (duration / 60) * 56

    return {
      top: `${top}px`,
      height: `${Math.max(height, 28)}px`,
    }
  }

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden">
      <div className="grid grid-cols-8 bg-muted/50 border-b border-border/30">
        <div className="p-2 text-center text-sm font-medium text-muted-foreground border-r border-border/30" />
        {days.map((date) => (
          <div
            key={date.toISOString()}
            className={cn(
              "p-2 text-center border-r border-border/30",
              isToday(date) && "bg-primary/5"
            )}
          >
            <div className="text-xs text-muted-foreground">
              {format(date, "EEE")}
            </div>
            <div
              className={cn(
                "text-lg font-semibold w-8 h-8 mx-auto flex items-center justify-center rounded-full",
                isToday(date) && "bg-primary text-primary-foreground"
              )}
            >
              {format(date, "d")}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-8 max-h-[600px] overflow-y-auto custom-scrollbar">
        <div className="border-r border-border/30">
          {hours.map((hour) => (
            <div
              key={hour}
              className="h-14 border-b border-border/30 text-right pr-2 text-xs text-muted-foreground pt-1"
            >
              {format(new Date().setHours(hour, 0), "h a")}
            </div>
          ))}
        </div>

        {days.map((date) => {
          const dayEvents = events.filter((e) => isSameDay(parseISO(e.start), date))
          return (
            <div key={date.toISOString()} className="relative border-r border-border/30">
              {hours.map((hour) => (
                <DroppableTimeSlot
                  key={hour}
                  date={date}
                  hour={hour}
                  onClick={() => onTimeSlotClick(date, hour)}
                />
              ))}
              {dayEvents.map((event) => (
                <DraggableWeekEvent
                  key={event.id}
                  event={event}
                  onClick={() => onEventClick(event)}
                  style={getEventStyle(event)}
                />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
