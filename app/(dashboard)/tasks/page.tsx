"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Plus, Filter, CheckCircle2, Circle, Clock, AlertCircle, ListTodo } from "lucide-react"

type Task = {
  id: number
  title: string
  subject: string
  dueDate: string
  priority: "high" | "medium" | "low"
  completed: boolean
  estimatedTime: string
}

const initialTasks: Task[] = [
  { id: 1, title: "Complete Algorithm Problem Set #5", subject: "CS201", dueDate: "Today", priority: "high", completed: false, estimatedTime: "2h" },
  { id: 2, title: "Read Chapter 12 - Integration", subject: "MATH202", dueDate: "Tomorrow", priority: "medium", completed: false, estimatedTime: "1.5h" },
  { id: 3, title: "Physics Lab Report", subject: "PHYS101", dueDate: "Apr 30", priority: "high", completed: false, estimatedTime: "3h" },
  { id: 4, title: "Essay Draft - Technical Communication", subject: "ENG105", dueDate: "May 1", priority: "medium", completed: false, estimatedTime: "4h" },
  { id: 5, title: "Review Organic Chemistry Notes", subject: "CHEM101", dueDate: "Apr 29", priority: "low", completed: true, estimatedTime: "1h" },
  { id: 6, title: "Linear Algebra Quiz Prep", subject: "MATH203", dueDate: "May 2", priority: "medium", completed: false, estimatedTime: "2h" },
  { id: 7, title: "Watch Lecture Recording - Trees", subject: "CS201", dueDate: "Apr 28", priority: "low", completed: true, estimatedTime: "1h" },
  { id: 8, title: "Complete Practice Problems", subject: "MATH202", dueDate: "May 3", priority: "low", completed: false, estimatedTime: "1.5h" },
]

const priorityColors = {
  high: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  low: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
}

export default function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks)
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all")

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === "pending") return !task.completed
    if (filter === "completed") return task.completed
    return true
  })

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    highPriority: tasks.filter(t => t.priority === "high" && !t.completed).length,
  }

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Manage your assignments and deadlines</p>
        </div>
        <Button className="gap-2 rounded-xl">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <ListTodo className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Circle className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-rose-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.highPriority}</p>
                <p className="text-xs text-muted-foreground">High Priority</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-primary" />
            Task List
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              className="rounded-lg"
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              size="sm"
              className="rounded-lg"
              onClick={() => setFilter("pending")}
            >
              Pending
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "outline"}
              size="sm"
              className="rounded-lg"
              onClick={() => setFilter("completed")}
            >
              Completed
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredTasks.map(task => (
              <div
                key={task.id}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 hover:bg-muted/50 ${
                  task.completed ? "opacity-60" : ""
                }`}
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="h-5 w-5"
                />
                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span>{task.subject}</span>
                    <span>-</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {task.estimatedTime}
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className={priorityColors[task.priority]}>
                  {task.priority}
                </Badge>
                <div className="text-sm text-muted-foreground whitespace-nowrap">
                  {task.dueDate}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
