"use client"

import {
  format,
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
import { Repeat, Clock, MapPin } from "lucide-react"

interface DayViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onTimeSlotClick: (date: Date, hour: number) => void
  onEventClick: (event: CalendarEvent) => void
}

const hours = Array.from({ length: 16 }, (_, i) => i + 6) // 6 AM to 9 PM

interface DraggableDayEventProps {
  event: CalendarEvent
  onClick: () => void
  style: React.CSSProperties
}

function DraggableDayEvent({ event, onClick, style }: DraggableDayEventProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: event.id,
    data: { event },
  })

  const colors = categoryColors[event.category]
  const startTime = format(parseISO(event.start), "h:mm a")
  const endTime = format(parseISO(event.end), "h:mm a")

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
        "absolute left-20 right-4 rounded-xl p-3 cursor-grab active:cursor-grabbing overflow-hidden transition-all shadow-sm",
        colors.bg,
        colors.text,
        isDragging && "opacity-50 scale-95 z-50",
        event.isAISuggested && "ring-2 ring-primary ring-offset-2"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{event.title}</span>
            {event.isRecurring && <Repeat className="h-4 w-4 opacity-70" />}
            {event.isAISuggested && (
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">AI</span>
            )}
          </div>
          {event.description && (
            <p className="text-sm opacity-80 mt-1">{event.description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 mt-2 text-sm opacity-80">
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {startTime} - {endTime}
        </div>
      </div>
    </div>
  )
}

interface DroppableHourSlotProps {
  date: Date
  hour: number
  onClick: () => void
}

function DroppableHourSlot({ date, hour, onClick }: DroppableHourSlotProps) {
  const slotDate = new Date(date)
  slotDate.setHours(hour, 0, 0, 0)
  const slotId = `day-${slotDate.toISOString()}`

  const { setNodeRef, isOver } = useDroppable({
    id: slotId,
    data: { date: slotDate, hour },
  })

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={cn(
        "h-16 border-b border-border/30 cursor-pointer hover:bg-muted/30 transition-colors flex",
        isOver && "bg-primary/10"
      )}
    >
      <div className="w-20 text-right pr-3 text-sm text-muted-foreground py-2 border-r border-border/30">
        {format(new Date().setHours(hour, 0), "h a")}
      </div>
      <div className="flex-1" />
    </div>
  )
}

export function DayView({
  currentDate,
  events,
  onTimeSlotClick,
  onEventClick,
}: DayViewProps) {
  const dayEvents = events.filter((e) => isSameDay(parseISO(e.start), currentDate))

  const getEventStyle = (event: CalendarEvent): React.CSSProperties => {
    const start = parseISO(event.start)
    const end = parseISO(event.end)
    const startHour = getHours(start)
    const startMinute = getMinutes(start)
    const duration = differenceInMinutes(end, start)

    const top = ((startHour - 6) * 64) + (startMinute / 60) * 64
    const height = (duration / 60) * 64

    return {
      top: `${top}px`,
      height: `${Math.max(height, 40)}px`,
    }
  }

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden">
      <div className="p-4 bg-muted/50 border-b border-border/30">
        <h2 className="text-xl font-semibold">
          {format(currentDate, "EEEE, MMMM d, yyyy")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {dayEvents.length} event{dayEvents.length !== 1 ? "s" : ""} scheduled
        </p>
      </div>

      <div className="relative max-h-[600px] overflow-y-auto custom-scrollbar">
        {hours.map((hour) => (
          <DroppableHourSlot
            key={hour}
            date={currentDate}
            hour={hour}
            onClick={() => onTimeSlotClick(currentDate, hour)}
          />
        ))}
        {dayEvents.map((event) => (
          <DraggableDayEvent
            key={event.id}
            event={event}
            onClick={() => onEventClick(event)}
            style={getEventStyle(event)}
          />
        ))}
      </div>
    </div>
  )
}
