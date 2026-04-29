import { create } from "zustand"
import { createClient } from "@/lib/supabase/client"
import type { Locale } from "@/lib/i18n"

export interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  avatar_url: string | null
  career: string | null
  semester: number | null
  university: string | null
  academic_level: string
  work_schedule: Array<{ day: string; start: string; end: string }>
  activities: Array<{ name: string; hours: number }>
  study_preferences: {
    preferred_hours: "morning" | "afternoon" | "evening" | "night"
    session_duration: number
    break_duration: number
  }
  language: Locale
  theme: "dark" | "light" | "system"
  timezone: string
  notifications: {
    email: boolean
    push: boolean
    reminders: boolean
  }
  ai_preferences: {
    memory_enabled: boolean
    personality: "friendly" | "professional" | "concise"
  }
  created_at: string
  updated_at: string
}

interface ProfileState {
  profile: Profile | null
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchProfile: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
  updateLanguage: (language: Locale) => Promise<void>
  updateTheme: (theme: "dark" | "light" | "system") => Promise<void>
  clearProfile: () => void
}

const defaultProfile: Omit<Profile, "id" | "email" | "created_at" | "updated_at"> = {
  first_name: null,
  last_name: null,
  avatar_url: null,
  career: null,
  semester: null,
  university: null,
  academic_level: "undergraduate",
  work_schedule: [],
  activities: [],
  study_preferences: {
    preferred_hours: "morning",
    session_duration: 45,
    break_duration: 15,
  },
  language: "es",
  theme: "dark",
  timezone: "America/New_York",
  notifications: {
    email: true,
    push: true,
    reminders: true,
  },
  ai_preferences: {
    memory_enabled: true,
    personality: "friendly",
  },
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        set({ profile: null, isLoading: false })
        return
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (error) {
        // If profile doesn't exist, create one
        if (error.code === "PGRST116") {
          const newProfile = {
            id: user.id,
            email: user.email,
            ...defaultProfile,
          }
          
          const { data: createdProfile, error: createError } = await supabase
            .from("profiles")
            .insert(newProfile)
            .select()
            .single()

          if (createError) throw createError
          
          set({ profile: createdProfile, isLoading: false })
          
          // Sync language to localStorage
          if (createdProfile?.language) {
            localStorage.setItem("studysync-locale", createdProfile.language)
          }
          return
        }
        throw error
      }

      set({ profile: data, isLoading: false })
      
      // Sync language to localStorage
      if (data?.language) {
        localStorage.setItem("studysync-locale", data.language)
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to fetch profile", 
        isLoading: false 
      })
    }
  },

  updateProfile: async (updates) => {
    const { profile } = get()
    if (!profile) return

    set({ isLoading: true, error: null })

    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from("profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id)
        .select()
        .single()

      if (error) throw error

      set({ profile: data, isLoading: false })
      
      // Sync language to localStorage if updated
      if (updates.language) {
        localStorage.setItem("studysync-locale", updates.language)
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to update profile", 
        isLoading: false 
      })
    }
  },

  updateLanguage: async (language) => {
    await get().updateProfile({ language })
  },

  updateTheme: async (theme) => {
    await get().updateProfile({ theme })
  },

  clearProfile: () => {
    set({ profile: null, isLoading: false, error: null })
  },
}))
