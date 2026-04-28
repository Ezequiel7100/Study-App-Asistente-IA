"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, BookOpen, FileText, Video, Clock, TrendingUp } from "lucide-react"

const subjects = [
  {
    id: 1,
    name: "Data Structures & Algorithms",
    code: "CS201",
    progress: 72,
    grade: "A-",
    color: "bg-primary",
    nextClass: "Tomorrow 9:00 AM",
    materials: 24,
    hoursStudied: 45,
  },
  {
    id: 2,
    name: "Calculus II",
    code: "MATH202",
    progress: 58,
    grade: "B+",
    color: "bg-emerald-500",
    nextClass: "Wed 2:00 PM",
    materials: 18,
    hoursStudied: 32,
  },
  {
    id: 3,
    name: "Physics I",
    code: "PHYS101",
    progress: 85,
    grade: "A",
    color: "bg-amber-500",
    nextClass: "Thu 11:00 AM",
    materials: 31,
    hoursStudied: 52,
  },
  {
    id: 4,
    name: "Technical Writing",
    code: "ENG105",
    progress: 40,
    grade: "B",
    color: "bg-rose-500",
    nextClass: "Fri 3:00 PM",
    materials: 12,
    hoursStudied: 18,
  },
  {
    id: 5,
    name: "Chemistry",
    code: "CHEM101",
    progress: 65,
    grade: "B+",
    color: "bg-cyan-500",
    nextClass: "Mon 10:00 AM",
    materials: 22,
    hoursStudied: 38,
  },
  {
    id: 6,
    name: "Linear Algebra",
    code: "MATH203",
    progress: 50,
    grade: "B",
    color: "bg-violet-500",
    nextClass: "Tue 1:00 PM",
    materials: 15,
    hoursStudied: 28,
  },
]

export default function SubjectsPage() {
  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Subjects</h1>
          <p className="text-muted-foreground">Track your courses and study progress</p>
        </div>
        <Button className="gap-2 rounded-xl">
          <Plus className="h-4 w-4" />
          Add Subject
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map(subject => (
          <Card
            key={subject.id}
            className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl ${subject.color} flex items-center justify-center`}>
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                      {subject.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">{subject.code}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="font-semibold">
                  {subject.grade}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{subject.progress}%</span>
                </div>
                <Progress value={subject.progress} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{subject.materials} materials</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{subject.hoursStudied}h studied</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border/50">
                <div className="flex items-center gap-2 text-sm">
                  <Video className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Next:</span>
                  <span className="font-medium">{subject.nextClass}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
              <p className="text-3xl font-bold text-primary">3.65</p>
              <p className="text-sm text-muted-foreground">Current GPA</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">6</p>
              <p className="text-sm text-muted-foreground">Active Courses</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">213</p>
              <p className="text-sm text-muted-foreground">Hours Studied</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-500">+12%</p>
              <p className="text-sm text-muted-foreground">vs Last Semester</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
