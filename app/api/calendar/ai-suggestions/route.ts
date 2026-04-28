import { NextResponse } from "next/server"

interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  category: string
  isRecurring: boolean
}

export async function POST(request: Request) {
  try {
    const { events } = await request.json() as { events: CalendarEvent[] }
    
    // Find upcoming exams
    const now = new Date()
    const twoWeeksLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
    
    const upcomingExams = events.filter((event) => {
      const eventDate = new Date(event.start)
      return (
        event.category === "exam" &&
        eventDate > now &&
        eventDate <= twoWeeksLater
      )
    })

    const suggestions: CalendarEvent[] = []

    // Generate study session suggestions based on upcoming exams
    upcomingExams.forEach((exam) => {
      const examDate = new Date(exam.start)
      const daysUntilExam = Math.ceil((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      
      // Suggest study sessions 2-3 days before exam
      for (let i = 2; i <= Math.min(daysUntilExam - 1, 4); i++) {
        const studyDate = new Date(examDate)
        studyDate.setDate(studyDate.getDate() - i)
        
        // Only suggest if it's in the future
        if (studyDate > now) {
          // Find a free slot (try afternoon first)
          const startHour = 14 + (i % 3) * 2 // Varies between 14:00, 16:00, 18:00
          studyDate.setHours(startHour, 0, 0, 0)
          
          const endDate = new Date(studyDate)
          endDate.setHours(startHour + 2)
          
          // Check if slot is free
          const isSlotFree = !events.some((e) => {
            const eStart = new Date(e.start)
            const eEnd = new Date(e.end)
            return (
              (studyDate >= eStart && studyDate < eEnd) ||
              (endDate > eStart && endDate <= eEnd)
            )
          })

          if (isSlotFree) {
            const subjectName = exam.title.replace(/\s*(exam|test|final|midterm)/i, "").trim()
            suggestions.push({
              id: crypto.randomUUID(),
              title: `Study: ${subjectName}`,
              start: studyDate.toISOString(),
              end: endDate.toISOString(),
              category: "study",
              isRecurring: false,
              isAISuggested: true,
            } as CalendarEvent & { isAISuggested: boolean })
          }
        }
      }
    })

    return NextResponse.json({ suggestions })
  } catch {
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 })
  }
}
