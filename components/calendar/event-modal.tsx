"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  CalendarEvent,
  EventCategory,
  categoryLabels,
  categoryColors,
  useCalendarStore,
} from "@/lib/calendar-store"
import { format } from "date-fns"
import { Trash2 } from "lucide-react"

interface EventModalProps {
  open: boolean
  onClose: () => void
  event?: CalendarEvent | null
  defaultDate?: Date
}

export function EventModal({ open, onClose, event, defaultDate }: EventModalProps) {
  const { addEvent, updateEvent, deleteEvent } = useCalendarStore()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endDate, setEndDate] = useState("")
  const [endTime, setEndTime] = useState("")
  const [category, setCategory] = useState<EventCategory>("class")
  const [isRecurring, setIsRecurring] = useState(false)
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">("weekly")
  const [interval, setInterval] = useState(1)

  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setDescription(event.description || "")
      const start = new Date(event.start)
      const end = new Date(event.end)
      setStartDate(format(start, "yyyy-MM-dd"))
      setStartTime(format(start, "HH:mm"))
      setEndDate(format(end, "yyyy-MM-dd"))
      setEndTime(format(end, "HH:mm"))
      setCategory(event.category)
      setIsRecurring(event.isRecurring)
      if (event.recurrenceRule) {
        setFrequency(event.recurrenceRule.frequency)
        setInterval(event.recurrenceRule.interval)
      }
    } else if (defaultDate) {
      const dateStr = format(defaultDate, "yyyy-MM-dd")
      setStartDate(dateStr)
      setEndDate(dateStr)
      setStartTime("09:00")
      setEndTime("10:00")
      setTitle("")
      setDescription("")
      setCategory("class")
      setIsRecurring(false)
    }
  }, [event, defaultDate, open])

  const handleSubmit = () => {
    const start = new Date(`${startDate}T${startTime}:00`)
    const end = new Date(`${endDate}T${endTime}:00`)

    const eventData = {
      title,
      description: description || undefined,
      start: start.toISOString(),
      end: end.toISOString(),
      category,
      isRecurring,
      recurrenceRule: isRecurring
        ? { frequency, interval }
        : undefined,
    }

    if (event) {
      updateEvent(event.id, eventData)
    } else {
      addEvent(eventData)
    }

    onClose()
  }

  const handleDelete = () => {
    if (event) {
      deleteEvent(event.id)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Create Event"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              className="rounded-xl resize-none"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as EventCategory)}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(categoryLabels) as EventCategory[]).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${categoryColors[cat].bg}`} />
                      {categoryLabels[cat]}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="recurring"
              checked={isRecurring}
              onCheckedChange={(checked) => setIsRecurring(checked === true)}
            />
            <Label htmlFor="recurring" className="cursor-pointer">
              Recurring event
            </Label>
          </div>

          {isRecurring && (
            <div className="grid grid-cols-2 gap-4 pl-6">
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select value={frequency} onValueChange={(v) => setFrequency(v as typeof frequency)}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Every</Label>
                <Input
                  type="number"
                  min={1}
                  value={interval}
                  onChange={(e) => setInterval(parseInt(e.target.value) || 1)}
                  className="rounded-xl"
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          {event && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="gap-2 rounded-xl mr-auto"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="rounded-xl" disabled={!title.trim()}>
              {event ? "Save Changes" : "Create Event"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
