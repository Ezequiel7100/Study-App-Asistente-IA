"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ListTodo, Plus, RefreshCw, Inbox } from "lucide-react"
import { useDashboardStore, type Task } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/lib/i18n"

const priorityColors = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  low: "bg-chart-2/10 text-chart-2 border-chart-2/20",
}

function TaskSkeleton() {
  return (
    <div className="flex items-start gap-3 rounded-xl p-3 bg-muted/30">
      <Skeleton className="h-5 w-5 rounded-md mt-0.5" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-12 rounded-md" />
          <Skeleton className="h-5 w-14 rounded-md" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  )
}

function EmptyTasks() {
  const { locale } = useI18n()
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="rounded-full bg-muted p-3 mb-3">
        <Inbox className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium mb-1">
        {locale === "es" ? "Aun no hay tareas" : locale === "pt" ? "Ainda nao ha tarefas" : "No tasks yet"}
      </p>
      <p className="text-xs text-muted-foreground">
        {locale === "es" ? "Agrega tu primera tarea para comenzar." : locale === "pt" ? "Adicione sua primeira tarefa para comecar." : "Add your first task to get started."}
      </p>
    </div>
  )
}

function formatDueDate(dateString: string): string {
  const today = new Date()
  const dueDate = new Date(dateString)
  const todayStr = today.toISOString().split("T")[0]
  const tomorrowStr = new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  
  if (dateString === todayStr) return "Today"
  if (dateString === tomorrowStr) return "Tomorrow"
  
  return dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function TaskItem({ task }: { task: Task }) {
  const { completeTask } = useDashboardStore()
  const { toast } = useToast()

  const handleComplete = () => {
    completeTask(task.id)
    toast({
      title: task.completed ? "Task reopened" : "Task completed",
      description: task.title,
    })
  }

  return (
    <div
      className={`flex items-start gap-3 rounded-xl p-3 transition-all duration-200 hover:bg-muted/50 ${
        task.completed ? "opacity-50" : ""
      }`}
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={handleComplete}
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
        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          <Badge
            variant="outline"
            className="text-[10px] h-5 rounded-md border-border/50"
          >
            {task.subject}
          </Badge>
          <Badge
            variant="outline"
            className={`text-[10px] h-5 rounded-md ${priorityColors[task.priority]}`}
          >
            {task.priority}
          </Badge>
          <span className="text-[10px] text-muted-foreground">
            {formatDueDate(task.dueDate)}
          </span>
        </div>
      </div>
    </div>
  )
}

export function TaskList() {
  const { t, locale } = useI18n()
  const { stats, isLoadingStats, fetchStats } = useDashboardStore()
  const { toast } = useToast()

  const tasks = stats?.pendingTasks ?? []
  const pendingCount = tasks.filter(t => !t.completed).length

  const handleAddTask = () => {
    toast({
      title: t("tasks.addTask"),
      description: locale === "es" ? "El modal de creacion de tareas se abriria aqui." : locale === "pt" ? "O modal de criacao de tarefas abriria aqui." : "Task creation modal would open here.",
    })
  }

  return (
    <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-4/10">
            <ListTodo className="h-4 w-4 text-chart-4" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">{t("tasks.title")}</CardTitle>
            <p className="text-xs text-muted-foreground">
              {isLoadingStats 
                ? t("common.loading") 
                : locale === "es" 
                  ? `${pendingCount} tareas pendientes`
                  : locale === "pt"
                  ? `${pendingCount} tarefas pendentes`
                  : `${pendingCount} pending tasks`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={fetchStats}
            disabled={isLoadingStats}
          >
            <RefreshCw className={`h-4 w-4 ${isLoadingStats ? "animate-spin" : ""}`} />
          </Button>
          <Button size="sm" className="h-8 rounded-lg gap-1.5" onClick={handleAddTask}>
            <Plus className="h-3.5 w-3.5" />
            {t("tasks.addTask")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
        {isLoadingStats ? (
          <>
            <TaskSkeleton />
            <TaskSkeleton />
            <TaskSkeleton />
            <TaskSkeleton />
            <TaskSkeleton />
          </>
        ) : tasks.length === 0 ? (
          <EmptyTasks />
        ) : (
          tasks.map((task) => <TaskItem key={task.id} task={task} />)
        )}
      </CardContent>
    </Card>
  )
}
