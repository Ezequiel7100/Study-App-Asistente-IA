"use client"

import { create } from "zustand"

export interface Task {
  id: string
  title: string
  subject: string
  dueDate: string
  priority: "high" | "medium" | "low"
  completed: boolean
}

export interface Exam {
  id: string
  subject: string
  date: string
  daysUntil: number
}

export interface DashboardStats {
  weeklyStudyHours: number
  weeklyStudyChange: number
  upcomingExams: Exam[]
  pendingTasks: Task[]
  tasksDueToday: number
  productivityScore: number
  productivityChange: number
  weeklyGoalHours: number
  weeklyGoalProgress: number
}

export interface Recommendation {
  id: string
  type: "exam_prep" | "spaced_repetition" | "weekly_goal" | "break_reminder" | "focus_session"
  title: string
  description: string
  action: string
  priority: "high" | "medium" | "low"
  metadata?: {
    subject?: string
    daysUntil?: number
    hoursRemaining?: number
    progressPercent?: number
  }
}

interface DashboardState {
  stats: DashboardStats | null
  recommendations: Recommendation[]
  isLoadingStats: boolean
  isLoadingRecommendations: boolean
  error: string | null
  
  // Actions
  fetchStats: () => Promise<void>
  fetchRecommendations: () => Promise<void>
  completeTask: (taskId: string) => Promise<void>
  dismissRecommendation: (recId: string) => void
  refreshAll: () => Promise<void>
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  stats: null,
  recommendations: [],
  isLoadingStats: false,
  isLoadingRecommendations: false,
  error: null,

  fetchStats: async () => {
    set({ isLoadingStats: true, error: null })
    try {
      const response = await fetch("/api/dashboard")
      if (!response.ok) throw new Error("Failed to fetch dashboard stats")
      const data = await response.json()
      set({ stats: data, isLoadingStats: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoadingStats: false })
    }
  },

  fetchRecommendations: async () => {
    set({ isLoadingRecommendations: true, error: null })
    try {
      const response = await fetch("/api/recommendations")
      if (!response.ok) throw new Error("Failed to fetch recommendations")
      const data = await response.json()
      set({ recommendations: data.recommendations, isLoadingRecommendations: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoadingRecommendations: false })
    }
  },

  completeTask: async (taskId: string) => {
    const { stats } = get()
    if (!stats) return

    // Optimistic update
    const updatedTasks = stats.pendingTasks.map((task) =>
      task.id === taskId ? { ...task, completed: true } : task
    )
    const tasksDueToday = updatedTasks.filter(
      (t) => !t.completed && t.dueDate === new Date().toISOString().split("T")[0]
    ).length

    set({
      stats: {
        ...stats,
        pendingTasks: updatedTasks,
        tasksDueToday,
      },
    })

    // API call would go here in production
    // For now, we just keep the optimistic update
  },

  dismissRecommendation: (recId: string) => {
    const { recommendations } = get()
    set({
      recommendations: recommendations.filter((r) => r.id !== recId),
    })
  },

  refreshAll: async () => {
    const { fetchStats, fetchRecommendations } = get()
    await Promise.all([fetchStats(), fetchRecommendations()])
  },
}))
