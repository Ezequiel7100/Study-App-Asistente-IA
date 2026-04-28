import { NextResponse } from "next/server"

interface Task {
  id: string
  title: string
  dueDate: string
  priority: "high" | "medium" | "low"
  estimatedHours: number
  completed: boolean
}

export async function POST(request: Request) {
  const { tasks } = await request.json() as { tasks: Task[] }

  // AI prioritization algorithm
  const now = new Date()
  const prioritizedTasks = tasks
    .filter((task) => !task.completed)
    .map((task) => {
      const dueDate = new Date(task.dueDate)
      const daysUntilDue = Math.max(0, Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

      // Calculate AI score
      let score = task.priority === "high" ? 40 : task.priority === "medium" ? 25 : 10

      // Urgency
      if (daysUntilDue <= 1) score += 40
      else if (daysUntilDue <= 3) score += 30
      else if (daysUntilDue <= 7) score += 20
      else if (daysUntilDue <= 14) score += 10

      // Time efficiency
      if (daysUntilDue <= 2 && task.estimatedHours <= 2) score += 20
      else if (task.estimatedHours <= 1) score += 10

      return {
        ...task,
        aiScore: Math.min(100, score),
        recommendation: score >= 80
          ? "Do this first - urgent and high priority"
          : score >= 60
          ? "Schedule soon - approaching deadline"
          : score >= 40
          ? "Plan this week"
          : "Can wait - lower priority",
      }
    })
    .sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0))

  return NextResponse.json({
    prioritizedTasks,
    topRecommendation: prioritizedTasks[0]
      ? `Focus on "${prioritizedTasks[0].title}" first - it has the highest priority score of ${prioritizedTasks[0].aiScore}.`
      : "All tasks completed!",
  })
}
