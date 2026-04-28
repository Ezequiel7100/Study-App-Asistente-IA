"use client"

import { type ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw, AlertCircle, Inbox } from "lucide-react"

interface DashboardWidgetProps {
  title: string
  icon?: ReactNode
  children: ReactNode
  isLoading?: boolean
  isEmpty?: boolean
  error?: string | null
  onRefresh?: () => void
  headerAction?: ReactNode
  className?: string
  emptyMessage?: string
  emptyDescription?: string
}

export function DashboardWidget({
  title,
  icon,
  children,
  isLoading = false,
  isEmpty = false,
  error = null,
  onRefresh,
  headerAction,
  className = "",
  emptyMessage = "No data available",
  emptyDescription = "Check back later for updates.",
}: DashboardWidgetProps) {
  return (
    <Card className={`rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                {icon}
              </div>
            )}
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {headerAction}
            {onRefresh && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <WidgetError message={error} onRetry={onRefresh} />
        ) : isEmpty && !isLoading ? (
          <WidgetEmpty message={emptyMessage} description={emptyDescription} />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  )
}

function WidgetError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="rounded-full bg-destructive/10 p-3 mb-3">
        <AlertCircle className="h-6 w-6 text-destructive" />
      </div>
      <p className="text-sm font-medium mb-1">Something went wrong</p>
      <p className="text-xs text-muted-foreground mb-3">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="h-3 w-3 mr-1" />
          Try Again
        </Button>
      )}
    </div>
  )
}

function WidgetEmpty({ message, description }: { message: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="rounded-full bg-muted p-3 mb-3">
        <Inbox className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium mb-1">{message}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
}

// Reusable skeleton patterns for widgets
export function WidgetListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
          <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function WidgetChartSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between h-32 gap-2">
        {[...Array(7)].map((_, i) => (
          <Skeleton 
            key={i} 
            className="flex-1 rounded-t"
            style={{ height: `${Math.random() * 60 + 40}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between">
        {[...Array(7)].map((_, i) => (
          <Skeleton key={i} className="h-3 w-8" />
        ))}
      </div>
    </div>
  )
}

export function WidgetStatSkeleton() {
  return (
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-11 w-11 rounded-xl" />
    </div>
  )
}
