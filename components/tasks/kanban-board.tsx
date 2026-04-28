"use client"

import { useCallback } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useTasksStore, Task } from "@/lib/tasks-store"
import { Clock, GripVertical, Sparkles } from "lucide-react"

const priorityColors = {
  high: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  low: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
}

const statusColumns = [
  { id: "todo", title: "To Do", color: "border-t-muted-foreground" },
  { id: "in-progress", title: "In Progress", color: "border-t-amber-500" },
  { id: "done", title: "Done", color: "border-t-emerald-500" },
] as const

interface SortableTaskCardProps {
  task: Task
  onEdit: (task: Task) => void
}

function SortableTaskCard({ task, onEdit }: SortableTaskCardProps) {
  const { toggleComplete } = useTasksStore()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: "task", task },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group ${isDragging ? "opacity-50" : ""}`}
    >
      <Card
        className={`rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer ${
          task.completed ? "opacity-60" : ""
        }`}
        onClick={() => onEdit(task)}
      >
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <button
              {...attributes}
              {...listeners}
              className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </button>
            <Checkbox
              checked={task.completed}
              onCheckedChange={(e) => {
                e.stopPropagation?.()
                toggleComplete(task.id)
              }}
              onClick={(e) => e.stopPropagation()}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium leading-tight ${
                  task.completed ? "line-through text-muted-foreground" : ""
                }`}
              >
                {task.title}
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {task.subjectName}
                </Badge>
                <Badge variant="outline" className={`text-xs ${priorityColors[task.priority]}`}>
                  {task.priority}
                </Badge>
                {task.aiScore && task.aiScore >= 70 && (
                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {task.aiScore}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {task.estimatedHours}h
                </span>
                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TaskCard({ task }: { task: Task }) {
  return (
    <Card className="rounded-xl border shadow-lg">
      <CardContent className="p-3">
        <p className="text-sm font-medium">{task.title}</p>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="text-xs">
            {task.subjectName}
          </Badge>
          <Badge variant="outline" className={`text-xs ${priorityColors[task.priority]}`}>
            {task.priority}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

interface KanbanBoardProps {
  onEditTask: (task: Task) => void
}

export function KanbanBoard({ onEditTask }: KanbanBoardProps) {
  const { tasks, moveTaskToStatus, filterPriority, filterSubject, searchQuery, showCompleted } = useTasksStore()
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (!showCompleted && task.completed) return false
    if (filterPriority !== "all" && task.priority !== filterPriority) return false
    if (filterSubject && task.subjectId !== filterSubject) return false
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const getTasksByStatus = useCallback(
    (status: Task["status"]) => filteredTasks.filter((task) => task.status === status),
    [filteredTasks]
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = tasks.find((t) => t.id === active.id)
    if (task) setActiveTask(task)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Check if dropping over a column
    const overColumn = statusColumns.find((col) => col.id === overId)
    if (overColumn) {
      const activeTask = tasks.find((t) => t.id === activeId)
      if (activeTask && activeTask.status !== overColumn.id) {
        moveTaskToStatus(activeId, overColumn.id)
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null)
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Check if dropping over a column
    const overColumn = statusColumns.find((col) => col.id === overId)
    if (overColumn) {
      moveTaskToStatus(activeId, overColumn.id)
      return
    }

    // Check if dropping over another task
    const overTask = tasks.find((t) => t.id === overId)
    if (overTask) {
      const activeTask = tasks.find((t) => t.id === activeId)
      if (activeTask && activeTask.status !== overTask.status) {
        moveTaskToStatus(activeId, overTask.status)
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {statusColumns.map((column) => {
          const columnTasks = getTasksByStatus(column.id)
          return (
            <div
              key={column.id}
              className={`rounded-2xl border-t-4 ${column.color} bg-card/50 backdrop-blur-sm`}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  {column.title}
                  <Badge variant="secondary" className="ml-2">
                    {columnTasks.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 min-h-[200px]">
                <SortableContext
                  items={columnTasks.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                  id={column.id}
                >
                  {columnTasks.map((task) => (
                    <SortableTaskCard key={task.id} task={task} onEdit={onEditTask} />
                  ))}
                </SortableContext>
                {columnTasks.length === 0 && (
                  <div className="flex items-center justify-center h-24 text-sm text-muted-foreground border-2 border-dashed rounded-xl">
                    Drop tasks here
                  </div>
                )}
              </CardContent>
            </div>
          )
        })}
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
