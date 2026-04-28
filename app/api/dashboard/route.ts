import { NextResponse } from "next/server"

// Mock data generator for dashboard stats
function generateDashboardStats() {
  const today = new Date()
  
  const exams = [
    {
      id: "exam-1",
      subject: "Algebra II",
      date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      daysUntil: 7,
    },
    {
      id: "exam-2",
      subject: "Physics",
      date: new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      daysUntil: 12,
    },
    {
      id: "exam-3",
      subject: "History",
      date: new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      daysUntil: 21,
    },
  ]

  const tasks = [
    {
      id: "task-1",
      title: "Complete Calculus Problem Set",
      subject: "Mathematics",
      dueDate: today.toISOString().split("T")[0],
      priority: "high" as const,
      completed: false,
    },
    {
      id: "task-2",
      title: "Read Chapter 5 - Thermodynamics",
      subject: "Physics",
      dueDate: today.toISOString().split("T")[0],
      priority: "medium" as const,
      completed: false,
    },
    {
      id: "task-3",
      title: "Essay Draft - Civil War",
      subject: "History",
      dueDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      priority: "high" as const,
      completed: false,
    },
    {
      id: "task-4",
      title: "Lab Report - Chemical Reactions",
      subject: "Chemistry",
      dueDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      priority: "medium" as const,
      completed: false,
    },
    {
      id: "task-5",
      title: "French Vocabulary Quiz Prep",
      subject: "French",
      dueDate: today.toISOString().split("T")[0],
      priority: "low" as const,
      completed: false,
    },
    {
      id: "task-6",
      title: "Review Algebra Notes",
      subject: "Mathematics",
      dueDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      priority: "medium" as const,
      completed: false,
    },
    {
      id: "task-7",
      title: "Programming Assignment #4",
      subject: "Computer Science",
      dueDate: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      priority: "high" as const,
      completed: false,
    },
    {
      id: "task-8",
      title: "Study Group Meeting Notes",
      subject: "General",
      dueDate: today.toISOString().split("T")[0],
      priority: "low" as const,
      completed: false,
    },
    {
      id: "task-9",
      title: "Biology Diagram Labels",
      subject: "Biology",
      dueDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      priority: "medium" as const,
      completed: false,
    },
    {
      id: "task-10",
      title: "Statistics Homework",
      subject: "Mathematics",
      dueDate: today.toISOString().split("T")[0],
      priority: "medium" as const,
      completed: false,
    },
    {
      id: "task-11",
      title: "English Literature Analysis",
      subject: "English",
      dueDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      priority: "low" as const,
      completed: false,
    },
    {
      id: "task-12",
      title: "Art History Presentation",
      subject: "Art History",
      dueDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      priority: "medium" as const,
      completed: false,
    },
  ]

  const tasksDueToday = tasks.filter(
    (t) => t.dueDate === today.toISOString().split("T")[0] && !t.completed
  ).length

  return {
    weeklyStudyHours: 24.5,
    weeklyStudyChange: 12,
    upcomingExams: exams,
    pendingTasks: tasks,
    tasksDueToday,
    productivityScore: 87,
    productivityChange: 5,
    weeklyGoalHours: 25,
    weeklyGoalProgress: 85,
  }
}

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))
  
  const stats = generateDashboardStats()
  return NextResponse.json(stats)
}
