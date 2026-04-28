import { NextResponse } from "next/server"

export async function GET() {
  // In production, this would fetch from a database
  const events = [
    {
      id: "1",
      title: "Data Structures Lecture",
      description: "Weekly lecture on algorithms and data structures",
      start: "2026-04-28T09:00:00",
      end: "2026-04-28T10:30:00",
      category: "class",
      isRecurring: true,
      recurrenceRule: { frequency: "weekly", interval: 1 },
    },
    {
      id: "2",
      title: "Physics Study Block",
      description: "Review quantum mechanics chapters",
      start: "2026-04-28T11:00:00",
      end: "2026-04-28T13:00:00",
      category: "study",
      isRecurring: false,
    },
    {
      id: "3",
      title: "Team Project Meeting",
      start: "2026-04-28T14:00:00",
      end: "2026-04-28T15:00:00",
      category: "work",
      isRecurring: false,
    },
    {
      id: "4",
      title: "Gym Session",
      start: "2026-04-28T17:00:00",
      end: "2026-04-28T18:30:00",
      category: "gym",
      isRecurring: true,
      recurrenceRule: { frequency: "weekly", interval: 1 },
    },
    {
      id: "5",
      title: "Algorithm Practice",
      start: "2026-04-29T16:00:00",
      end: "2026-04-29T18:00:00",
      category: "study",
      isRecurring: false,
    },
    {
      id: "6",
      title: "Calculus Exam",
      description: "Final exam - Chapters 8-12",
      start: "2026-04-30T10:00:00",
      end: "2026-04-30T12:00:00",
      category: "exam",
      isRecurring: false,
    },
  ]

  return NextResponse.json({ events })
}

export async function POST(request: Request) {
  try {
    const event = await request.json()
    
    // In production, this would save to a database
    const newEvent = {
      ...event,
      id: crypto.randomUUID(),
    }

    return NextResponse.json({ event: newEvent }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
