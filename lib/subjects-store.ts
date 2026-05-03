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

// Start with empty array - data comes from Supabase
const initialSubjects: Subject[] = []

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
      
      clearSubjects: () => {
        set({ subjects: [], selectedSubject: null })
      },
    }),
    {
      name: "studysync-subjects",
    }
  )
)
