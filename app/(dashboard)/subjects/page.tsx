"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  BookOpen,
  FileText,
  Clock,
  TrendingUp,
  Search,
  MoreVertical,
  Archive,
  ArchiveRestore,
  Pencil,
  Trash2,
  Calendar,
  GraduationCap,
} from "lucide-react"
import { useSubjectsStore, Subject } from "@/lib/subjects-store"
import { SubjectModal } from "@/components/subjects/subject-modal"

const difficultyColors = {
  easy: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  hard: "bg-rose-500/10 text-rose-500 border-rose-500/20",
}

export default function SubjectsPage() {
  const {
    subjects,
    showArchived,
    toggleShowArchived,
    archiveSubject,
    restoreSubject,
    deleteSubject,
    setSelectedSubject,
    selectedSubject,
  } = useSubjectsStore()

  const [modalOpen, setModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)

  // Filter subjects
  const filteredSubjects = subjects.filter((subject) => {
    if (!showArchived && subject.archived) return false
    if (showArchived && !subject.archived) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        subject.title.toLowerCase().includes(query) ||
        subject.code.toLowerCase().includes(query) ||
        subject.professor.toLowerCase().includes(query)
      )
    }
    return true
  })

  // Calculate stats
  const activeSubjects = subjects.filter((s) => !s.archived)
  const totalCredits = activeSubjects.reduce((acc, s) => acc + s.credits, 0)
  const totalHoursStudied = activeSubjects.reduce((acc, s) => acc + s.hoursStudied, 0)
  const avgGpa = 3.65 // Mock GPA

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject)
    setModalOpen(true)
  }

  const handleAddSubject = () => {
    setEditingSubject(null)
    setModalOpen(true)
  }

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Subjects</h1>
          <p className="text-muted-foreground">Track your courses and study progress</p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={showArchived ? "archived" : "active"} className="w-auto">
            <TabsList className="rounded-xl">
              <TabsTrigger value="active" className="rounded-lg" onClick={() => showArchived && toggleShowArchived()}>
                Active
              </TabsTrigger>
              <TabsTrigger value="archived" className="rounded-lg" onClick={() => !showArchived && toggleShowArchived()}>
                Archived
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={handleAddSubject} className="gap-2 rounded-xl">
            <Plus className="h-4 w-4" />
            Add Subject
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search subjects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 rounded-xl"
        />
      </div>

      {/* Subject Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSubjects.map((subject) => (
          <Card
            key={subject.id}
            className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={() => handleEditSubject(subject)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl ${subject.color} flex items-center justify-center`}>
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                      {subject.title}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">{subject.code}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditSubject(subject); }}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    {subject.archived ? (
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); restoreSubject(subject.id); }}>
                        <ArchiveRestore className="h-4 w-4 mr-2" />
                        Restore
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); archiveSubject(subject.id); }}>
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={(e) => { e.stopPropagation(); deleteSubject(subject.id); }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                {subject.grade && (
                  <Badge variant="secondary" className="font-semibold">
                    {subject.grade}
                  </Badge>
                )}
                <Badge variant="outline" className={difficultyColors[subject.difficulty]}>
                  {subject.difficulty}
                </Badge>
                <Badge variant="outline">{subject.credits} credits</Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{subject.completionPercentage}%</span>
                </div>
                <Progress value={subject.completionPercentage} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{subject.materials.length} materials</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{subject.hoursStudied}h studied</span>
                </div>
              </div>

              {subject.examDates.length > 0 && (
                <div className="pt-2 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-rose-500" />
                    <span className="text-muted-foreground">Next exam:</span>
                    <span className="font-medium">
                      {new Date(subject.examDates[0].date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}

              {subject.nextClass && (
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Next:</span>
                  <span className="font-medium">{subject.nextClass}</span>
                </div>
              )}

              {subject.professor && (
                <p className="text-xs text-muted-foreground">Prof. {subject.professor}</p>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredSubjects.length === 0 && (
          <div className="col-span-full">
            <Card className="rounded-2xl border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  {searchQuery ? "No subjects match your search" : showArchived ? "No archived subjects" : "No subjects yet"}
                </p>
                {!searchQuery && !showArchived && (
                  <Button onClick={handleAddSubject} variant="outline" className="mt-4 rounded-xl">
                    <Plus className="h-4 w-4 mr-2" />
                    Add your first subject
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Overall Stats */}
      <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Overall Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{avgGpa.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Current GPA</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{activeSubjects.length}</p>
              <p className="text-sm text-muted-foreground">Active Courses</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{totalHoursStudied}</p>
              <p className="text-sm text-muted-foreground">Hours Studied</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{totalCredits}</p>
              <p className="text-sm text-muted-foreground">Total Credits</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject Modal */}
      <SubjectModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        subject={editingSubject}
      />
    </div>
  )
}
