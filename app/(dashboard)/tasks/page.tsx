"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Filter,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  ListTodo,
  Search,
  LayoutGrid,
  List,
  Calendar,
  Sparkles,
  SortAsc,
  Eye,
  EyeOff,
} from "lucide-react"
import { useTasksStore, Task, ViewMode } from "@/lib/tasks-store"
import { useSubjectsStore } from "@/lib/subjects-store"
import { TaskModal } from "@/components/tasks/task-modal"
import { KanbanBoard } from "@/components/tasks/kanban-board"

const priorityColors = {
  high: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  low: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
}

export default function TasksPage() {
  const {
    tasks,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    filterPriority,
    setFilterPriority,
    filterSubject,
    setFilterSubject,
    searchQuery,
    setSearchQuery,
    showCompleted,
    toggleShowCompleted,
    toggleComplete,
    getAIPrioritization,
  } = useTasksStore()

  const { subjects } = useSubjectsStore()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  // Calculate AI prioritization on mount
  useEffect(() => {
    getAIPrioritization()
  }, [])

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks]

    // Filter by completion
    if (!showCompleted) {
      result = result.filter((task) => !task.completed)
    }

    // Filter by priority
    if (filterPriority !== "all") {
      result = result.filter((task) => task.priority === filterPriority)
    }

    // Filter by subject
    if (filterSubject) {
      result = result.filter((task) => task.subjectId === filterSubject)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.subjectName.toLowerCase().includes(query)
      )
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "dueDate") {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      }
      if (sortBy === "priority") {
        const priorityOrder = { high: 0, medium: 1, low: 2 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      }
      if (sortBy === "subject") {
        return a.subjectName.localeCompare(b.subjectName)
      }
      if (sortBy === "aiScore") {
        return (b.aiScore || 0) - (a.aiScore || 0)
      }
      return 0
    })

    return result
  }, [tasks, showCompleted, filterPriority, filterSubject, searchQuery, sortBy])

  // Stats
  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
    highPriority: tasks.filter((t) => t.priority === "high" && !t.completed).length,
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  const handleAddTask = () => {
    setEditingTask(null)
    setModalOpen(true)
  }

  const handleAIPrioritize = async () => {
    setAiLoading(true)
    await getAIPrioritization()
    setSortBy("aiScore")
    setAiLoading(false)
  }

  // Get top AI recommendation
  const topRecommendation = useMemo(() => {
    const pendingTasks = tasks.filter((t) => !t.completed && t.aiScore)
    if (pendingTasks.length === 0) return null
    return pendingTasks.sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0))[0]
  }, [tasks])

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Manage your assignments and deadlines</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleAIPrioritize}
            variant="outline"
            className="gap-2 rounded-xl"
            disabled={aiLoading}
          >
            <Sparkles className={`h-4 w-4 ${aiLoading ? "animate-spin" : ""}`} />
            AI Prioritize
          </Button>
          <Button onClick={handleAddTask} className="gap-2 rounded-xl">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      {topRecommendation && (
        <Card className="rounded-2xl border-primary/30 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">AI Recommendation</p>
                <p className="text-sm text-muted-foreground">
                  Focus on <span className="font-semibold text-foreground">{`"${topRecommendation.title}"`}</span> first
                  - Priority score: {topRecommendation.aiScore}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg"
                onClick={() => handleEditTask(topRecommendation)}
              >
                View Task
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
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

      {/* Progress */}
      <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">
              {stats.completed} / {stats.total} tasks completed
            </span>
          </div>
          <Progress value={(stats.completed / stats.total) * 100} className="h-2" />
        </CardContent>
      </Card>

      {/* Filters and View Toggle */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-[200px] rounded-xl"
            />
          </div>

          <Select value={filterPriority} onValueChange={(v) => setFilterPriority(v as typeof filterPriority)}>
            <SelectTrigger className="w-[130px] rounded-xl">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterSubject || "all"} onValueChange={(v) => setFilterSubject(v === "all" ? null : v)}>
            <SelectTrigger className="w-[150px] rounded-xl">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects
                .filter((s) => !s.archived)
                .map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.code}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="w-[130px] rounded-xl">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="subject">Subject</SelectItem>
              <SelectItem value="aiScore">AI Score</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            className="rounded-xl"
            onClick={toggleShowCompleted}
            title={showCompleted ? "Hide completed" : "Show completed"}
          >
            {showCompleted ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
        </div>

        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
          <TabsList className="rounded-xl">
            <TabsTrigger value="list" className="rounded-lg gap-2">
              <List className="h-4 w-4" />
              List
            </TabsTrigger>
            <TabsTrigger value="kanban" className="rounded-lg gap-2">
              <LayoutGrid className="h-4 w-4" />
              Kanban
            </TabsTrigger>
            <TabsTrigger value="calendar" className="rounded-lg gap-2">
              <Calendar className="h-4 w-4" />
              Calendar
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Task Views */}
      {viewMode === "list" && (
        <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="space-y-2">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 hover:bg-muted/50 cursor-pointer ${
                    task.completed ? "opacity-60" : ""
                  }`}
                  onClick={() => handleEditTask(task)}
                >
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleComplete(task.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-5 w-5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span>{task.subjectName}</span>
                      <span>-</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {task.estimatedHours}h
                      </span>
                      {task.aiScore && task.aiScore >= 70 && (
                        <>
                          <span>-</span>
                          <span className="flex items-center gap-1 text-primary">
                            <Sparkles className="h-3 w-3" />
                            {task.aiScore}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className={priorityColors[task.priority]}>
                    {task.priority}
                  </Badge>
                  <div className="text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {filteredTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <ListTodo className="h-12 w-12 mb-4" />
                  <p>No tasks found</p>
                  <Button onClick={handleAddTask} variant="outline" className="mt-4 rounded-xl">
                    <Plus className="h-4 w-4 mr-2" />
                    Add a task
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === "kanban" && <KanbanBoard onEditTask={handleEditTask} />}

      {viewMode === "calendar" && (
        <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <TaskCalendarView tasks={filteredTasks} onEditTask={handleEditTask} />
          </CardContent>
        </Card>
      )}

      {/* Task Modal */}
      <TaskModal open={modalOpen} onOpenChange={setModalOpen} task={editingTask} />
    </div>
  )
}

// Calendar view component
function TaskCalendarView({ tasks, onEditTask }: { tasks: Task[]; onEditTask: (task: Task) => void }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" })

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => i)

  const getTasksForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return tasks.filter((task) => task.dueDate === dateStr)
  }

  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{monthName}</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-lg" onClick={goToPrevMonth}>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="rounded-lg" onClick={goToNextMonth}>
            Next
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}

        {paddingDays.map((_, i) => (
          <div key={`pad-${i}`} className="h-24" />
        ))}

        {days.map((day) => {
          const dayTasks = getTasksForDay(day)
          const isToday =
            new Date().toDateString() ===
            new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()

          return (
            <div
              key={day}
              className={`h-24 p-1 border rounded-lg overflow-hidden ${
                isToday ? "border-primary bg-primary/5" : "border-border/50"
              }`}
            >
              <div className={`text-xs font-medium mb-1 ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                {day}
              </div>
              <div className="space-y-1">
                {dayTasks.slice(0, 2).map((task) => (
                  <div
                    key={task.id}
                    className={`text-xs p-1 rounded cursor-pointer truncate ${
                      task.completed
                        ? "bg-muted text-muted-foreground line-through"
                        : task.priority === "high"
                        ? "bg-rose-500/20 text-rose-500"
                        : task.priority === "medium"
                        ? "bg-amber-500/20 text-amber-500"
                        : "bg-emerald-500/20 text-emerald-500"
                    }`}
                    onClick={() => onEditTask(task)}
                  >
                    {task.title}
                  </div>
                ))}
                {dayTasks.length > 2 && (
                  <div className="text-xs text-muted-foreground">+{dayTasks.length - 2} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
