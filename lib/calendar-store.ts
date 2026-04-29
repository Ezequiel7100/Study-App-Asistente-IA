"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  parseISO,
  format,
} from "date-fns"

export type EventCategory = "class" | "study" | "work" | "gym" | "exam" | "personal"

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: string // ISO string
  end: string // ISO string
  category: EventCategory
  isRecurring: boolean
  recurrenceRule?: {
    frequency: "daily" | "weekly" | "monthly"
    interval: number
    endDate?: string
  }
  isAISuggested?: boolean
}

export type CalendarView = "month" | "week" | "day"

export const categoryColors: Record<EventCategory, { bg: string; text: string; border: string }> = {
  class: { bg: "bg-chart-1", text: "text-white", border: "border-chart-1" },
  study: { bg: "bg-chart-2", text: "text-white", border: "border-chart-2" },
  work: { bg: "bg-chart-4", text: "text-white", border: "border-chart-4" },
  gym: { bg: "bg-chart-3", text: "text-white", border: "border-chart-3" },
  exam: { bg: "bg-destructive", text: "text-destructive-foreground", border: "border-destructive" },
  personal: { bg: "bg-chart-5", text: "text-white", border: "border-chart-5" },
}

export const categoryLabels: Record<EventCategory, string> = {
  class: "Class",
  study: "Study",
  work: "Work",
  gym: "Gym",
  exam: "Exam",
  personal: "Personal",
}

interface CalendarState {
  events: CalendarEvent[]
  selectedDate: string // ISO date string
  view: CalendarView
  searchQuery: string
  activeFilters: EventCategory[]
  isLoading: boolean
  error: string | null

  // Actions
  setSelectedDate: (date: string) => void
  setView: (view: CalendarView) => void
  setSearchQuery: (query: string) => void
  toggleFilter: (category: EventCategory) => void
  clearFilters: () => void
  addEvent: (event: Omit<CalendarEvent, "id">) => void
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void
  deleteEvent: (id: string) => void
  moveEvent: (id: string, newStart: string, newEnd: string) => void
  fetchEvents: () => Promise<void>
  generateAISuggestions: () => Promise<void>
}

// Start with empty array - data comes from Supabase
const initialEvents: CalendarEvent[] = []

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      events: initialEvents,
      selectedDate: new Date(2026, 3, 28).toISOString(),
      view: "month",
      searchQuery: "",
      activeFilters: [],
      isLoading: false,
      error: null,

      setSelectedDate: (date) => set({ selectedDate: date }),
      setView: (view) => set({ view }),
      setSearchQuery: (query) => set({ searchQuery: query }),

      toggleFilter: (category) => {
        const { activeFilters } = get()
        if (activeFilters.includes(category)) {
          set({ activeFilters: activeFilters.filter((f) => f !== category) })
        } else {
          set({ activeFilters: [...activeFilters, category] })
        }
      },

      clearFilters: () => set({ activeFilters: [], searchQuery: "" }),

      addEvent: (event) => {
        const newEvent: CalendarEvent = {
          ...event,
          id: crypto.randomUUID(),
        }
        set((state) => ({ events: [...state.events, newEvent] }))
      },

      updateEvent: (id, updates) => {
        set((state) => ({
          events: state.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        }))
      },

      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        }))
      },

      moveEvent: (id, newStart, newEnd) => {
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, start: newStart, end: newEnd } : e
          ),
        }))
      },

      fetchEvents: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch("/api/calendar")
          if (!response.ok) throw new Error("Failed to fetch events")
          const data = await response.json()
          set({ events: data.events, isLoading: false })
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

generateAISuggestions: async () => {
        set({ isLoading: true })
        try {
          const { events } = get()
          const response = await fetch("/api/calendar/ai-suggestions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ events }),
          })
          if (!response.ok) throw new Error("Failed to generate suggestions")
          const data = await response.json()
          set((state) => ({
            events: [...state.events, ...data.suggestions],
            isLoading: false,
          }))
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },
      
      clearEvents: () => {
        set({ events: [], activeFilters: [], searchQuery: "" })
      },
    },
    {
      name: "studysync-calendar",
      partialize: (state) => ({
        events: state.events,
        view: state.view,
        activeFilters: state.activeFilters,
      }),
    }
  )
)

// Utility functions
export function getEventsForDate(events: CalendarEvent[], date: Date): CalendarEvent[] {
  return events.filter((event) => isSameDay(parseISO(event.start), date))
}

export function getEventsInRange(
  events: CalendarEvent[],
  start: Date,
  end: Date
): CalendarEvent[] {
  return events.filter((event) => {
    const eventStart = parseISO(event.start)
    return eventStart >= start && eventStart <= end
  })
}

export function filterEvents(
  events: CalendarEvent[],
  filters: EventCategory[],
  searchQuery: string
): CalendarEvent[] {
  let filtered = events

  if (filters.length > 0) {
    filtered = filtered.filter((e) => filters.includes(e.category))
  }

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase()
    filtered = filtered.filter(
      (e) =>
        e.title.toLowerCase().includes(query) ||
        e.description?.toLowerCase().includes(query)
    )
  }

  return filtered
}
