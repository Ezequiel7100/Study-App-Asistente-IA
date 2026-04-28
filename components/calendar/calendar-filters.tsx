"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  EventCategory,
  categoryColors,
  categoryLabels,
  useCalendarStore,
} from "@/lib/calendar-store"
import { Search, X, Filter, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const categories: EventCategory[] = ["class", "study", "work", "gym", "exam", "personal"]

export function CalendarFilters() {
  const {
    searchQuery,
    setSearchQuery,
    activeFilters,
    toggleFilter,
    clearFilters,
    generateAISuggestions,
    isLoading,
  } = useCalendarStore()

  const hasActiveFilters = activeFilters.length > 0 || searchQuery.trim()

  return (
    <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 text-xs gap-1"
            >
              <X className="h-3 w-3" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-xl"
          />
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Categories</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const colors = categoryColors[category]
              const isActive = activeFilters.includes(category)
              return (
                <Badge
                  key={category}
                  variant={isActive ? "default" : "outline"}
                  onClick={() => toggleFilter(category)}
                  className={cn(
                    "cursor-pointer transition-all hover:scale-105",
                    isActive && colors.bg
                  )}
                >
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full mr-1.5",
                      isActive ? "bg-white/50" : colors.bg
                    )}
                  />
                  {categoryLabels[category]}
                </Badge>
              )
            })}
          </div>
        </div>

        <div className="pt-2 border-t border-border/50">
          <Button
            variant="outline"
            className="w-full gap-2 rounded-xl"
            onClick={() => generateAISuggestions()}
            disabled={isLoading}
          >
            <Sparkles className="h-4 w-4" />
            {isLoading ? "Generating..." : "AI Study Suggestions"}
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Auto-schedule study sessions based on upcoming exams
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
