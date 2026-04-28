"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  attachments?: { name: string; type: string; url: string }[]
}

export type Conversation = {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  isPinned: boolean
}

type ChatStore = {
  conversations: Conversation[]
  activeConversationId: string | null
  searchQuery: string
  
  // Actions
  setSearchQuery: (query: string) => void
  createConversation: () => string
  deleteConversation: (id: string) => void
  setActiveConversation: (id: string | null) => void
  togglePin: (id: string) => void
  renameConversation: (id: string, title: string) => void
  addMessage: (conversationId: string, message: Omit<Message, "id" | "timestamp">) => void
  updateMessage: (conversationId: string, messageId: string, content: string) => void
  getActiveConversation: () => Conversation | null
  getFilteredConversations: () => { pinned: Conversation[]; recent: Conversation[] }
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      searchQuery: "",

      setSearchQuery: (query) => set({ searchQuery: query }),

      createConversation: () => {
        const id = `conv-${Date.now()}`
        const newConversation: Conversation = {
          id,
          title: "New Chat",
          messages: [
            {
              id: `msg-${Date.now()}`,
              role: "assistant",
              content: "Hello! I'm your AI Study Assistant. I can help you:\n\n- **Build study plans** tailored to your schedule\n- **Summarize notes** and extract key concepts\n- **Explain complex topics** in simple terms\n- **Generate quizzes** to test your knowledge\n- **Optimize your schedule** for peak productivity\n- **Recommend breaks** using the Pomodoro technique\n\nWhat would you like to work on today?",
              timestamp: new Date(),
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
          isPinned: false,
        }
        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          activeConversationId: id,
        }))
        return id
      },

      deleteConversation: (id) => {
        set((state) => {
          const newConversations = state.conversations.filter((c) => c.id !== id)
          const newActiveId = state.activeConversationId === id 
            ? (newConversations[0]?.id || null)
            : state.activeConversationId
          return {
            conversations: newConversations,
            activeConversationId: newActiveId,
          }
        })
      },

      setActiveConversation: (id) => set({ activeConversationId: id }),

      togglePin: (id) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, isPinned: !c.isPinned } : c
          ),
        }))
      },

      renameConversation: (id, title) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, title } : c
          ),
        }))
      },

      addMessage: (conversationId, message) => {
        const newMessage: Message = {
          ...message,
          id: `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          timestamp: new Date(),
        }
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id === conversationId) {
              // Auto-title based on first user message
              const isFirstUserMessage = c.messages.length === 1 && message.role === "user"
              const newTitle = isFirstUserMessage 
                ? message.content.slice(0, 40) + (message.content.length > 40 ? "..." : "")
                : c.title
              return {
                ...c,
                title: newTitle,
                messages: [...c.messages, newMessage],
                updatedAt: new Date(),
              }
            }
            return c
          }),
        }))
      },

      updateMessage: (conversationId, messageId, content) => {
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id === conversationId) {
              return {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === messageId ? { ...m, content } : m
                ),
                updatedAt: new Date(),
              }
            }
            return c
          }),
        }))
      },

      getActiveConversation: () => {
        const state = get()
        return state.conversations.find((c) => c.id === state.activeConversationId) || null
      },

      getFilteredConversations: () => {
        const state = get()
        const query = state.searchQuery.toLowerCase()
        const filtered = state.conversations.filter(
          (c) =>
            c.title.toLowerCase().includes(query) ||
            c.messages.some((m) => m.content.toLowerCase().includes(query))
        )
        return {
          pinned: filtered.filter((c) => c.isPinned).sort((a, b) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          ),
          recent: filtered.filter((c) => !c.isPinned).sort((a, b) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          ),
        }
      },
    }),
    {
      name: "studysync-chat-storage",
      partialize: (state) => ({
        conversations: state.conversations,
        activeConversationId: state.activeConversationId,
      }),
    }
  )
)
