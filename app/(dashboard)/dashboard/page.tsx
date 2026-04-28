import { HeroSection } from "@/components/hero-section"
import { StatCards } from "@/components/stat-cards"
import { SmartCalendar } from "@/components/smart-calendar"
import { AIRecommendations } from "@/components/ai-recommendations"
import { ChatWidget } from "@/components/chat-widget"
import { UploadSection } from "@/components/upload-section"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { TaskList } from "@/components/task-list"

export default function DashboardPage() {
  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <HeroSection />
      <StatCards />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SmartCalendar />
        </div>
        <div className="space-y-6">
          <AIRecommendations />
          <UploadSection />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ChatWidget />
        </div>
        <div className="lg:col-span-2">
          <TaskList />
        </div>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4">Productivity Analytics</h2>
        <AnalyticsCharts />
      </section>
    </div>
  )
}
