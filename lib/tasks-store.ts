"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  subjectId: string
  subjectName: string
  priority: "high" | "medium" | "low"
  estimatedHours: number
  completed: boolean
  status: "todo" | "in-progress" | "done"
  createdAt: string
  updatedAt: string
  aiScore?: number // AI prioritization score
}

export type ViewMode = "list" | "kanban" | "calendar"
export type SortBy = "dueDate" | "priority" | "subject" | "aiScore"
export type FilterPriority = "all" | "high" | "medium" | "low"
export type FilterStatus = "all" | "todo" | "in-progress" | "done"

interface TasksState {
  tasks: Task[]
  isLoading: boolean
  error: string | null
  selectedTask: Task | null
  viewMode: ViewMode
  sortBy: SortBy
  filterPriority: FilterPriority
  filterStatus: FilterStatus
  filterSubject: string | null
  searchQuery: string
  showCompleted: boolean

  // Actions
  fetchTasks: () => Promise<void>
  createTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "status" | "aiScore">) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleComplete: (id: string) => void
  setStatus: (id: string, status: Task["status"]) => void
  setSelectedTask: (task: Task | null) => void
  setViewMode: (mode: ViewMode) => void
  setSortBy: (sort: SortBy) => void
  setFilterPriority: (priority: FilterPriority) => void
  setFilterStatus: (status: FilterStatus) => void
  setFilterSubject: (subjectId: string | null) => void
  setSearchQuery: (query: string) => void
  toggleShowCompleted: () => void
  reorderTasks: (activeId: string, overId: string) => void
  moveTaskToStatus: (taskId: string, newStatus: Task["status"]) => void
  getAIPrioritization: () => Promise<void>
}

// Start with empty array - data comes from Supabase
const initialTasks: Task[] = []

export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: initialTasks,
      isLoading: false,
      error: null,
      selectedTask: null,
      viewMode: "list",
      sortBy: "dueDate",
      filterPriority: "all",
      filterStatus: "all",
      filterSubject: null,
      searchQuery: "",
      showCompleted: true,

      fetchTasks: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch("/api/tasks")
          if (!response.ok) throw new Error("Failed to fetch tasks")
          const data = await response.json()
          set({ tasks: data.tasks, isLoading: false })
        } catch {
          set({ isLoading: false })
        }
      },

      createTask: async (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: crypto.randomUUID(),
          status: "todo",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }))
        // Recalculate AI scores
        get().getAIPrioritization()
      },

      updateTask: async (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date().toISOString() }
              : task
          ),
          selectedTask:
            state.selectedTask?.id === id
              ? { ...state.selectedTask, ...updates, updatedAt: new Date().toISOString() }
              : state.selectedTask,
        }))
      },

      deleteTask: async (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
          selectedTask: state.selectedTask?.id === id ? null : state.selectedTask,
        }))
      },

      toggleComplete: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  completed: !task.completed,
                  status: !task.completed ? "done" : "todo",
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        }))
      },

      setStatus: (id, status) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  status,
                  completed: status === "done",
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        }))
      },

      setSelectedTask: (task) => {
        set({ selectedTask: task })
      },

      setViewMode: (mode) => {
        set({ viewMode: mode })
      },

      setSortBy: (sort) => {
        set({ sortBy: sort })
      },

      setFilterPriority: (priority) => {
        set({ filterPriority: priority })
      },

      setFilterStatus: (status) => {
        set({ filterStatus: status })
      },

      setFilterSubject: (subjectId) => {
        set({ filterSubject: subjectId })
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query })
      },

      toggleShowCompleted: () => {
        set((state) => ({ showCompleted: !state.showCompleted }))
      },

      reorderTasks: (activeId, overId) => {
        set((state) => {
          const oldIndex = state.tasks.findIndex((t) => t.id === activeId)
          const newIndex = state.tasks.findIndex((t) => t.id === overId)
          if (oldIndex === -1 || newIndex === -1) return state

          const newTasks = [...state.tasks]
          const [removed] = newTasks.splice(oldIndex, 1)
          newTasks.splice(newIndex, 0, removed)
          return { tasks: newTasks }
        })
      },

      moveTaskToStatus: (taskId, newStatus) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status: newStatus,
                  completed: newStatus === "done",
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        }))
      },

      getAIPrioritization: async () => {
        const { tasks } = get()
        // Calculate AI scores based on due date, priority, and estimated hours
        const now = new Date()
        const updatedTasks = tasks.map((task) => {
          if (task.completed) return { ...task, aiScore: 0 }

          const dueDate = new Date(task.dueDate)
          const daysUntilDue = Math.max(0, Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

          // Base score from priority
          let score = task.priority === "high" ? 40 : task.priority === "medium" ? 25 : 10

          // Urgency based on due date (max 40 points)
          if (daysUntilDue <= 1) score += 40
          else if (daysUntilDue <= 3) score += 30
          else if (daysUntilDue <= 7) score += 20
          else if (daysUntilDue <= 14) score += 10

          // Time investment consideration (max 20 points)
          // Prefer tasks that can be completed quickly when time is short
          if (daysUntilDue <= 2 && task.estimatedHours <= 2) score += 20
          else if (task.estimatedHours <= 1) score += 10

          return { ...task, aiScore: Math.min(100, score) }
        })

set({ tasks: updatedTasks })
      },
      
      clearTasks: () => {
        set({ tasks: [], selectedTask: null })
      },
    }),
    {
      name: "studysync-tasks",
    }
  )
)
