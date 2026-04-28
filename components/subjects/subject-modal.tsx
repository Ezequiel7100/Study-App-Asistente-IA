"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSubjectsStore, Subject } from "@/lib/subjects-store"
import { Trash2 } from "lucide-react"

interface SubjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subject?: Subject | null
}

const colorOptions = [
  { value: "bg-primary", label: "Purple" },
  { value: "bg-emerald-500", label: "Emerald" },
  { value: "bg-amber-500", label: "Amber" },
  { value: "bg-rose-500", label: "Rose" },
  { value: "bg-cyan-500", label: "Cyan" },
  { value: "bg-violet-500", label: "Violet" },
  { value: "bg-blue-500", label: "Blue" },
  { value: "bg-pink-500", label: "Pink" },
]

export function SubjectModal({ open, onOpenChange, subject }: SubjectModalProps) {
  const { createSubject, updateSubject, deleteSubject } = useSubjectsStore()
  const isEditing = !!subject

  const [formData, setFormData] = useState({
    title: "",
    code: "",
    professor: "",
    difficulty: "medium" as "easy" | "medium" | "hard",
    credits: 3,
    notes: "",
    color: "bg-primary",
    grade: "",
    hoursStudied: 0,
    nextClass: "",
    completionPercentage: 0,
  })

  useEffect(() => {
    if (subject) {
      setFormData({
        title: subject.title,
        code: subject.code,
        professor: subject.professor,
        difficulty: subject.difficulty,
        credits: subject.credits,
        notes: subject.notes,
        color: subject.color,
        grade: subject.grade || "",
        hoursStudied: subject.hoursStudied,
        nextClass: subject.nextClass || "",
        completionPercentage: subject.completionPercentage,
      })
    } else {
      setFormData({
        title: "",
        code: "",
        professor: "",
        difficulty: "medium",
        credits: 3,
        notes: "",
        color: "bg-primary",
        grade: "",
        hoursStudied: 0,
        nextClass: "",
        completionPercentage: 0,
      })
    }
  }, [subject, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditing && subject) {
      updateSubject(subject.id, formData)
    } else {
      createSubject({
        ...formData,
        examDates: [],
        materials: [],
      })
    }
    onOpenChange(false)
  }

  const handleDelete = () => {
    if (subject) {
      deleteSubject(subject.id)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Subject" : "Add New Subject"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Subject Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Data Structures"
                required
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Course Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g., CS201"
                required
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="professor">Professor</Label>
            <Input
              id="professor"
              value={formData.professor}
              onChange={(e) => setFormData({ ...formData, professor: e.target.value })}
              placeholder="e.g., Dr. Sarah Chen"
              className="rounded-xl"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value: "easy" | "medium" | "hard") =>
                  setFormData({ ...formData, difficulty: value })
                }
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="credits">Credits</Label>
              <Input
                id="credits"
                type="number"
                min="1"
                max="6"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 3 })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Select
                value={formData.color}
                onValueChange={(value) => setFormData({ ...formData, color: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${color.value}`} />
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grade">Current Grade</Label>
              <Input
                id="grade"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                placeholder="e.g., A-"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="completion">Completion %</Label>
              <Input
                id="completion"
                type="number"
                min="0"
                max="100"
                value={formData.completionPercentage}
                onChange={(e) =>
                  setFormData({ ...formData, completionPercentage: parseInt(e.target.value) || 0 })
                }
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextClass">Next Class</Label>
            <Input
              id="nextClass"
              value={formData.nextClass}
              onChange={(e) => setFormData({ ...formData, nextClass: e.target.value })}
              placeholder="e.g., Tomorrow 9:00 AM"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any notes about this subject..."
              className="rounded-xl resize-none"
              rows={3}
            />
          </div>

          <DialogFooter className="flex gap-2">
            {isEditing && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="rounded-xl mr-auto"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl">
              {isEditing ? "Save Changes" : "Create Subject"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
