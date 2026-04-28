"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
} from "lucide-react"
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core"
import {
  useCalendarStore,
  CalendarView,
  CalendarEvent,
  filterEvents,
  categoryColors,
} from "@/lib/calendar-store"
import { MonthView } from "@/components/calendar/month-view"
import { WeekView } from "@/components/calendar/week-view"
import { DayView } from "@/components/calendar/day-view"
import { EventModal } from "@/components/calendar/event-modal"
import { UpcomingEvents } from "@/components/calendar/upcoming-events"
import { CalendarFilters } from "@/components/calendar/calendar-filters"
import {
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  parseISO,
  differenceInMinutes,
} from "date-fns"

export default function CalendarPage() {
  const {
    events,
    selectedDate,
    setSelectedDate,
    view,
    setView,
    searchQuery,
    activeFilters,
    moveEvent,
  } = useCalendarStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [modalDefaultDate, setModalDefaultDate] = useState<Date | undefined>()
  const [activeDragEvent, setActiveDragEvent] = useState<CalendarEvent | null>(null)

  const currentDate = useMemo(() => parseISO(selectedDate), [selectedDate])

  const filteredEvents = useMemo(
    () => filterEvents(events, activeFilters, searchQuery),
    [events, activeFilters, searchQuery]
  )

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const navigatePrev = useCallback(() => {
    let newDate: Date
    if (view === "month") {
      newDate = subMonths(currentDate, 1)
    } else if (view === "week") {
      newDate = subWeeks(currentDate, 1)
    } else {
      newDate = subDays(currentDate, 1)
    }
    setSelectedDate(newDate.toISOString())
  }, [view, currentDate, setSelectedDate])

  const navigateNext = useCallback(() => {
    let newDate: Date
    if (view === "month") {
      newDate = addMonths(currentDate, 1)
    } else if (view === "week") {
      newDate = addWeeks(currentDate, 1)
    } else {
      newDate = addDays(currentDate, 1)
    }
    setSelectedDate(newDate.toISOString())
  }, [view, currentDate, setSelectedDate])

  const goToToday = useCallback(() => {
    setSelectedDate(new Date(2026, 3, 28).toISOString()) // Demo "today"
  }, [setSelectedDate])

  const handleDateClick = useCallback((date: Date) => {
    setSelectedDate(date.toISOString())
    if (view === "month") {
      setView("day")
    }
  }, [setSelectedDate, setView, view])

  const handleTimeSlotClick = useCallback((date: Date, hour: number) => {
    const newDate = new Date(date)
    newDate.setHours(hour, 0, 0, 0)
    setModalDefaultDate(newDate)
    setSelectedEvent(null)
    setIsModalOpen(true)
  }, [])

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event)
    setModalDefaultDate(undefined)
    setIsModalOpen(true)
  }, [])

  const handleQuickAdd = useCallback(() => {
    setSelectedEvent(null)
    setModalDefaultDate(currentDate)
    setIsModalOpen(true)
  }, [currentDate])

  const handleDragStart = useCallback((event: { active: { data: { current?: { event?: CalendarEvent } } } }) => {
    const draggedEvent = event.active.data.current?.event
    if (draggedEvent) {
      setActiveDragEvent(draggedEvent)
    }
  }, [])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveDragEvent(null)
    const { active, over } = event
    if (!over || !active.data.current?.event) return

    const draggedEvent = active.data.current.event as CalendarEvent
    const overData = over.data.current as { date?: Date; hour?: number } | undefined

    if (overData?.date) {
      const originalStart = parseISO(draggedEvent.start)
      const originalEnd = parseISO(draggedEvent.end)
      const duration = differenceInMinutes(originalEnd, originalStart)

      let newStart: Date
      if (overData.hour !== undefined) {
        newStart = new Date(overData.date)
        newStart.setHours(overData.hour, 0, 0, 0)
      } else {
        newStart = new Date(overData.date)
        newStart.setHours(originalStart.getHours(), originalStart.getMinutes(), 0, 0)
      }

      const newEnd = new Date(newStart.getTime() + duration * 60 * 1000)

      moveEvent(draggedEvent.id, newStart.toISOString(), newEnd.toISOString())
    }
  }, [moveEvent])

  const getHeaderTitle = () => {
    if (view === "month") return format(currentDate, "MMMM yyyy")
    if (view === "week") {
      const weekStart = format(currentDate, "MMM d")
      const weekEnd = format(addDays(currentDate, 6), "MMM d, yyyy")
      return `${weekStart} - ${weekEnd}`
    }
    return format(currentDate, "MMMM d, yyyy")
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="container max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Calendar</h1>
            <p className="text-muted-foreground">
              Manage your schedule and deadlines
            </p>
          </div>
          <Button onClick={handleQuickAdd} className="gap-2 rounded-xl">
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <Card className="lg:col-span-3 rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
              <div className="flex items-center gap-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  {getHeaderTitle()}
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                    onClick={navigatePrev}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-lg px-3"
                    onClick={goToToday}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                    onClick={navigateNext}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Tabs
                value={view}
                onValueChange={(v) => setView(v as CalendarView)}
              >
                <TabsList className="rounded-xl">
                  <TabsTrigger value="month" className="rounded-lg">
                    Month
                  </TabsTrigger>
                  <TabsTrigger value="week" className="rounded-lg">
                    Week
                  </TabsTrigger>
                  <TabsTrigger value="day" className="rounded-lg">
                    Day
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              {view === "month" && (
                <MonthView
                  currentDate={currentDate}
                  events={filteredEvents}
                  onDateClick={handleDateClick}
                  onEventClick={handleEventClick}
                />
              )}
              {view === "week" && (
                <WeekView
                  currentDate={currentDate}
                  events={filteredEvents}
                  onTimeSlotClick={handleTimeSlotClick}
                  onEventClick={handleEventClick}
                />
              )}
              {view === "day" && (
                <DayView
                  currentDate={currentDate}
                  events={filteredEvents}
                  onTimeSlotClick={handleTimeSlotClick}
                  onEventClick={handleEventClick}
                />
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <CalendarFilters />
            <UpcomingEvents
              events={filteredEvents}
              onEventClick={handleEventClick}
            />
          </div>
        </div>
      </div>

      <EventModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedEvent(null)
          setModalDefaultDate(undefined)
        }}
        event={selectedEvent}
        defaultDate={modalDefaultDate}
      />

      <DragOverlay>
        {activeDragEvent && (
          <div
            className={`rounded-lg px-2 py-1 text-xs text-white shadow-lg ${
              categoryColors[activeDragEvent.category].bg
            }`}
          >
            {activeDragEvent.title}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
