"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface ExamDate {
  id: string
  date: string
  title: string
}

export interface Material {
  id: string
  name: string
  type: "pdf" | "video" | "link" | "note"
  uploadedAt: string
  url?: string
}

export interface Subject {
  id: string
  title: string
  code: string
  professor: string
  difficulty: "easy" | "medium" | "hard"
  credits: number
  notes: string
  examDates: ExamDate[]
  materials: Material[]
  completionPercentage: number
  color: string
  grade?: string
  hoursStudied: number
  nextClass?: string
  archived: boolean
  createdAt: string
  updatedAt: string
}

interface SubjectsState {
  subjects: Subject[]
  isLoading: boolean
  error: string | null
  selectedSubject: Subject | null
  showArchived: boolean

  // Actions
  fetchSubjects: () => Promise<void>
  createSubject: (subject: Omit<Subject, "id" | "createdAt" | "updatedAt" | "archived">) => Promise<void>
  updateSubject: (id: string, updates: Partial<Subject>) => Promise<void>
  deleteSubject: (id: string) => Promise<void>
  archiveSubject: (id: string) => Promise<void>
  restoreSubject: (id: string) => Promise<void>
  setSelectedSubject: (subject: Subject | null) => void
  toggleShowArchived: () => void
  addMaterial: (subjectId: string, material: Omit<Material, "id" | "uploadedAt">) => void
  removeMaterial: (subjectId: string, materialId: string) => void
  addExamDate: (subjectId: string, exam: Omit<ExamDate, "id">) => void
  removeExamDate: (subjectId: string, examId: string) => void
}

const initialSubjects: Subject[] = [
  {
    id: "1",
    title: "Data Structures & Algorithms",
    code: "CS201",
    professor: "Dr. Sarah Chen",
    difficulty: "hard",
    credits: 4,
    notes: "Focus on trees and graphs for final exam",
    examDates: [
      { id: "e1", date: "2026-05-15", title: "Midterm Exam" },
      { id: "e2", date: "2026-06-10", title: "Final Exam" },
    ],
    materials: [
      { id: "m1", name: "Lecture Slides Week 1-8", type: "pdf", uploadedAt: "2026-03-01" },
      { id: "m2", name: "Algorithm Visualization Tool", type: "link", uploadedAt: "2026-03-15" },
    ],
    completionPercentage: 72,
    color: "bg-primary",
    grade: "A-",
    hoursStudied: 45,
    nextClass: "Tomorrow 9:00 AM",
    archived: false,
    createdAt: "2026-01-15",
    updatedAt: "2026-04-20",
  },
  {
    id: "2",
    title: "Calculus II",
    code: "MATH202",
    professor: "Prof. Michael Torres",
    difficulty: "medium",
    credits: 3,
    notes: "Practice integration techniques daily",
    examDates: [
      { id: "e3", date: "2026-05-20", title: "Final Exam" },
    ],
    materials: [
      { id: "m3", name: "Textbook PDF", type: "pdf", uploadedAt: "2026-02-01" },
    ],
    completionPercentage: 58,
    color: "bg-emerald-500",
    grade: "B+",
    hoursStudied: 32,
    nextClass: "Wed 2:00 PM",
    archived: false,
    createdAt: "2026-01-15",
    updatedAt: "2026-04-18",
  },
  {
    id: "3",
    title: "Physics I",
    code: "PHYS101",
    professor: "Dr. Emily Watson",
    difficulty: "medium",
    credits: 4,
    notes: "Lab reports due every Friday",
    examDates: [
      { id: "e4", date: "2026-05-12", title: "Lab Practical" },
      { id: "e5", date: "2026-06-05", title: "Final Exam" },
    ],
    materials: [
      { id: "m4", name: "Lab Manual", type: "pdf", uploadedAt: "2026-01-20" },
      { id: "m5", name: "Physics Simulations", type: "link", uploadedAt: "2026-02-10" },
    ],
    completionPercentage: 85,
    color: "bg-amber-500",
    grade: "A",
    hoursStudied: 52,
    nextClass: "Thu 11:00 AM",
    archived: false,
    createdAt: "2026-01-15",
    updatedAt: "2026-04-22",
  },
  {
    id: "4",
    title: "Technical Writing",
    code: "ENG105",
    professor: "Prof. James Miller",
    difficulty: "easy",
    credits: 2,
    notes: "Focus on clarity and conciseness",
    examDates: [],
    materials: [
      { id: "m6", name: "Style Guide", type: "pdf", uploadedAt: "2026-01-25" },
    ],
    completionPercentage: 40,
    color: "bg-rose-500",
    grade: "B",
    hoursStudied: 18,
    nextClass: "Fri 3:00 PM",
    archived: false,
    createdAt: "2026-01-15",
    updatedAt: "2026-04-15",
  },
  {
    id: "5",
    title: "Chemistry",
    code: "CHEM101",
    professor: "Dr. Lisa Park",
    difficulty: "medium",
    credits: 4,
    notes: "Review organic chemistry concepts",
    examDates: [
      { id: "e6", date: "2026-05-18", title: "Final Exam" },
    ],
    materials: [
      { id: "m7", name: "Periodic Table Reference", type: "pdf", uploadedAt: "2026-01-18" },
      { id: "m8", name: "Lab Safety Video", type: "video", uploadedAt: "2026-01-20" },
    ],
    completionPercentage: 65,
    color: "bg-cyan-500",
    grade: "B+",
    hoursStudied: 38,
    nextClass: "Mon 10:00 AM",
    archived: false,
    createdAt: "2026-01-15",
    updatedAt: "2026-04-19",
  },
  {
    id: "6",
    title: "Linear Algebra",
    code: "MATH203",
    professor: "Prof. David Kim",
    difficulty: "hard",
    credits: 3,
    notes: "Matrix operations and eigenvalues",
    examDates: [
      { id: "e7", date: "2026-05-25", title: "Final Exam" },
    ],
    materials: [
      { id: "m9", name: "Practice Problems Set", type: "pdf", uploadedAt: "2026-02-05" },
    ],
    completionPercentage: 50,
    color: "bg-violet-500",
    grade: "B",
    hoursStudied: 28,
    nextClass: "Tue 1:00 PM",
    archived: false,
    createdAt: "2026-01-15",
    updatedAt: "2026-04-17",
  },
]

export const useSubjectsStore = create<SubjectsState>()(
  persist(
    (set, get) => ({
      subjects: initialSubjects,
      isLoading: false,
      error: null,
      selectedSubject: null,
      showArchived: false,

      fetchSubjects: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch("/api/subjects")
          if (!response.ok) throw new Error("Failed to fetch subjects")
          const data = await response.json()
          set({ subjects: data.subjects, isLoading: false })
        } catch {
          // Use local data on error
          set({ isLoading: false })
        }
      },

      createSubject: async (subjectData) => {
        const newSubject: Subject = {
          ...subjectData,
          id: crypto.randomUUID(),
          archived: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({
          subjects: [...state.subjects, newSubject],
        }))
      },

      updateSubject: async (id, updates) => {
        set((state) => ({
          subjects: state.subjects.map((subject) =>
            subject.id === id
              ? { ...subject, ...updates, updatedAt: new Date().toISOString() }
              : subject
          ),
          selectedSubject:
            state.selectedSubject?.id === id
              ? { ...state.selectedSubject, ...updates, updatedAt: new Date().toISOString() }
              : state.selectedSubject,
        }))
      },

      deleteSubject: async (id) => {
        set((state) => ({
          subjects: state.subjects.filter((subject) => subject.id !== id),
          selectedSubject: state.selectedSubject?.id === id ? null : state.selectedSubject,
        }))
      },

      archiveSubject: async (id) => {
        set((state) => ({
          subjects: state.subjects.map((subject) =>
            subject.id === id
              ? { ...subject, archived: true, updatedAt: new Date().toISOString() }
              : subject
          ),
        }))
      },

      restoreSubject: async (id) => {
        set((state) => ({
          subjects: state.subjects.map((subject) =>
            subject.id === id
              ? { ...subject, archived: false, updatedAt: new Date().toISOString() }
              : subject
          ),
        }))
      },

      setSelectedSubject: (subject) => {
        set({ selectedSubject: subject })
      },

      toggleShowArchived: () => {
        set((state) => ({ showArchived: !state.showArchived }))
      },

      addMaterial: (subjectId, material) => {
        const newMaterial: Material = {
          ...material,
          id: crypto.randomUUID(),
          uploadedAt: new Date().toISOString(),
        }
        set((state) => ({
          subjects: state.subjects.map((subject) =>
            subject.id === subjectId
              ? { ...subject, materials: [...subject.materials, newMaterial] }
              : subject
          ),
        }))
      },

      removeMaterial: (subjectId, materialId) => {
        set((state) => ({
          subjects: state.subjects.map((subject) =>
            subject.id === subjectId
              ? { ...subject, materials: subject.materials.filter((m) => m.id !== materialId) }
              : subject
          ),
        }))
      },

      addExamDate: (subjectId, exam) => {
        const newExam: ExamDate = {
          ...exam,
          id: crypto.randomUUID(),
        }
        set((state) => ({
          subjects: state.subjects.map((subject) =>
            subject.id === subjectId
              ? { ...subject, examDates: [...subject.examDates, newExam] }
              : subject
          ),
        }))
      },

      removeExamDate: (subjectId, examId) => {
        set((state) => ({
          subjects: state.subjects.map((subject) =>
            subject.id === subjectId
              ? { ...subject, examDates: subject.examDates.filter((e) => e.id !== examId) }
              : subject
          ),
        }))
      },
    }),
    {
      name: "studysync-subjects",
    }
  )
)
