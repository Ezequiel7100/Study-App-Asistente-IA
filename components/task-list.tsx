"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ListTodo, Plus } from "lucide-react"

const tasks = [
  {
    id: 1,
    title: "Complete Calculus Problem Set 5",
    subject: "Math",
    due: "Today",
    priority: "high",
    completed: false,
  },
  {
    id: 2,
    title: "Read Physics Chapter 12",
    subject: "Physics",
    due: "Today",
    priority: "medium",
    completed: false,
  },
  {
    id: 3,
    title: "Submit Lab Report Draft",
    subject: "Chemistry",
    due: "Tomorrow",
    priority: "high",
    completed: false,
  },
  {
    id: 4,
    title: "Review Data Structures Notes",
    subject: "CS",
    due: "Apr 30",
    priority: "low",
    completed: true,
  },
  {
    id: 5,
    title: "Practice Algorithm Problems",
    subject: "CS",
    due: "May 1",
    priority: "medium",
    completed: false,
  },
]

const priorityColors = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  low: "bg-chart-2/10 text-chart-2 border-chart-2/20",
}

export function TaskList() {
  return (
    <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-4/10">
            <ListTodo className="h-4 w-4 text-chart-4" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Tasks</CardTitle>
            <p className="text-xs text-muted-foreground">5 pending tasks</p>
          </div>
        </div>
        <Button size="sm" className="h-8 rounded-lg gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Add Task
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-start gap-3 rounded-xl p-3 transition-all duration-200 hover:bg-muted/50 ${
              task.completed ? "opacity-50" : ""
            }`}
          >
            <Checkbox
              checked={task.completed}
              className="mt-0.5 h-5 w-5 rounded-md border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium ${
                  task.completed ? "line-through text-muted-foreground" : ""
                }`}
              >
                {task.title}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge
                  variant="outline"
                  className="text-[10px] h-5 rounded-md border-border/50"
                >
                  {task.subject}
                </Badge>
                <Badge
                  variant="outline"
                  className={`text-[10px] h-5 rounded-md ${
                    priorityColors[task.priority as keyof typeof priorityColors]
                  }`}
                >
                  {task.priority}
                </Badge>
                <span className="text-[10px] text-muted-foreground">{task.due}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
