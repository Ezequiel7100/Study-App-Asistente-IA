"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  CheckSquare,
  Bot,
  BarChart3,
  Cloud,
  Settings,
  GraduationCap,
  Sparkles,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useI18n } from "@/lib/i18n"
import { useProfileStore } from "@/lib/profile-store"

export function AppSidebar() {
  const pathname = usePathname()
  const { t, locale } = useI18n()
  const { profile } = useProfileStore()

  const navItems = [
    { titleKey: "nav.dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { titleKey: "nav.calendar", icon: Calendar, href: "/calendar" },
    { titleKey: "nav.subjects", icon: BookOpen, href: "/subjects" },
    { titleKey: "nav.tasks", icon: CheckSquare, href: "/tasks" },
    { titleKey: "nav.aiTutor", icon: Bot, href: "/ai-tutor" },
    { titleKey: "nav.analytics", icon: BarChart3, href: "/analytics" },
    { titleKey: "nav.driveSync", icon: Cloud, href: "/drive-sync" },
    { titleKey: "nav.settings", icon: Settings, href: "/settings" },
  ]

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-6">
        <Link href="/dashboard" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold tracking-tight">{t("brand.name")}</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {t("brand.tagline")}
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.titleKey}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="h-11 rounded-xl transition-all duration-200 hover:bg-sidebar-accent data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{t(item.titleKey)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-xl bg-sidebar-accent/50 p-3 transition-colors hover:bg-sidebar-accent"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback>
              {profile?.first_name?.charAt(0) || "U"}{profile?.last_name?.charAt(0) || ""}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {profile?.first_name && profile?.last_name 
                ? `${profile.first_name} ${profile.last_name}`
                : profile?.first_name || (locale === "es" ? "Usuario" : locale === "pt" ? "Usuario" : "User")}
            </span>
            <span className="text-xs text-muted-foreground">
              {profile?.career || (locale === "es" ? "Estudiante" : locale === "pt" ? "Estudante" : "Student")}
            </span>
          </div>
        </Link>
      </SidebarFooter>
    </Sidebar>
  )
}
