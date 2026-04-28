import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopNavbar } from "@/components/top-navbar"
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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <TopNavbar />
        <main className="flex-1 overflow-auto custom-scrollbar">
          <div className="container max-w-7xl mx-auto p-6 space-y-6">
            {/* Hero Section */}
            <HeroSection />

            {/* Stat Cards */}
            <StatCards />

            {/* Main Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Calendar - Takes 2 columns */}
              <div className="lg:col-span-2">
                <SmartCalendar />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <AIRecommendations />
                <UploadSection />
              </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Chat Widget */}
              <div className="lg:col-span-1">
                <ChatWidget />
              </div>

              {/* Task List */}
              <div className="lg:col-span-2">
                <TaskList />
              </div>
            </div>

            {/* Analytics Section */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Productivity Analytics</h2>
              <AnalyticsCharts />
            </section>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
