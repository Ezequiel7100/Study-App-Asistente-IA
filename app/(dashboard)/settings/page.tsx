"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Calendar,
  Bot,
  Cloud,
  CreditCard,
  HelpCircle,
  LogOut,
  Camera,
  Mail,
  GraduationCap,
  Languages,
  Check,
} from "lucide-react"
import { useI18n, type Locale } from "@/lib/i18n"
import { useProfileStore } from "@/lib/profile-store"

export default function SettingsPage() {
  const { t, locale, setLocale } = useI18n()
  const { profile, fetchProfile, updateLanguage, isLoading: profileLoading } = useProfileStore()
  const [activeSection, setActiveSection] = useState("profile")

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  // Handle language change with Supabase persistence
  const handleLanguageChange = async (newLocale: Locale) => {
    setLocale(newLocale)
    if (profile) {
      await updateLanguage(newLocale)
    }
  }
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    studyReminders: true,
    deadlineAlerts: true,
    weeklyReport: false,
    aiSuggestions: true,
  })

  const settingsSections = [
    { id: "profile", label: t("common.profile"), icon: User },
    { id: "notifications", label: t("settings.notifications"), icon: Bell },
    { id: "appearance", label: t("settings.appearance"), icon: Palette },
    { id: "language", label: t("settings.language"), icon: Languages },
    { id: "ai-settings", label: t("nav.aiTutor"), icon: Bot },
    { id: "calendar", label: t("nav.calendar"), icon: Calendar },
    { id: "integrations", label: t("nav.driveSync"), icon: Cloud },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
  ]

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("settings.title")}</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <Card className="lg:col-span-1 rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm h-fit">
          <CardContent className="p-4">
            <nav className="space-y-1">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <section.icon className="h-4 w-4" />
                  {section.label}
                </button>
              ))}
              <hr className="my-2 border-border/50" />
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                <HelpCircle className="h-4 w-4" />
                Help & Support
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-all">
                <LogOut className="h-4 w-4" />
                {t("common.logout")}
              </button>
            </nav>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          {activeSection === "profile" && (
            <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  {t("common.profile")}
                </CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Jane Doe</h3>
                    <p className="text-sm text-muted-foreground">Computer Science Major</p>
                    <Badge className="mt-2 bg-primary/10 text-primary border-primary/20">
                      Pro Plan
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t("auth.firstName")}</Label>
                    <Input id="firstName" defaultValue="Jane" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t("auth.lastName")}</Label>
                    <Input id="lastName" defaultValue="Doe" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("auth.email")}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="email" defaultValue="jane.doe@university.edu" className="rounded-xl pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="major">Major</Label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="major" defaultValue="Computer Science" className="rounded-xl pl-10" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="rounded-xl">{t("common.save")}</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "language" && (
            <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5 text-primary" />
                  {t("settings.language")}
                </CardTitle>
                <CardDescription>
                  {locale === "es" ? "Selecciona tu idioma preferido" : locale === "pt" ? "Selecione seu idioma preferido" : "Select your preferred language"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <button
                    onClick={() => handleLanguageChange("en")}
                    disabled={profileLoading}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                      locale === "en" 
                        ? "bg-primary/10 border-2 border-primary" 
                        : "bg-muted/50 hover:bg-muted border-2 border-transparent"
                    } ${profileLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇺🇸</span>
                      <div className="text-left">
                        <p className="font-medium">{t("settings.english")}</p>
                        <p className="text-sm text-muted-foreground">English (US)</p>
                      </div>
                    </div>
                    {locale === "en" && (
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleLanguageChange("es")}
                    disabled={profileLoading}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                      locale === "es" 
                        ? "bg-primary/10 border-2 border-primary" 
                        : "bg-muted/50 hover:bg-muted border-2 border-transparent"
                    } ${profileLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇪🇸</span>
                      <div className="text-left">
                        <p className="font-medium">{t("settings.spanish")}</p>
                        <p className="text-sm text-muted-foreground">Espanol</p>
                      </div>
                    </div>
                    {locale === "es" && (
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleLanguageChange("pt")}
                    disabled={profileLoading}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                      locale === "pt" 
                        ? "bg-primary/10 border-2 border-primary" 
                        : "bg-muted/50 hover:bg-muted border-2 border-transparent"
                    } ${profileLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇧🇷</span>
                      <div className="text-left">
                        <p className="font-medium">{locale === "pt" ? "Portugues" : locale === "es" ? "Portugues" : "Portuguese"}</p>
                        <p className="text-sm text-muted-foreground">Portugues (Brasil)</p>
                      </div>
                    </div>
                    {locale === "pt" && (
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {locale === "es" 
                    ? "El idioma se guardara automaticamente y se aplicara en toda la aplicacion."
                    : locale === "pt"
                    ? "O idioma sera salvo automaticamente e aplicado em todo o aplicativo."
                    : "Language will be saved automatically and applied throughout the app."}
                </p>
              </CardContent>
            </Card>
          )}

          {activeSection === "notifications" && (
            <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  {t("settings.notifications")}
                </CardTitle>
                <CardDescription>Configure how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive push notifications</p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div>
                      <p className="font-medium">Study Reminders</p>
                      <p className="text-sm text-muted-foreground">Get reminded about study sessions</p>
                    </div>
                    <Switch
                      checked={notifications.studyReminders}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, studyReminders: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div>
                      <p className="font-medium">Deadline Alerts</p>
                      <p className="text-sm text-muted-foreground">Get notified before deadlines</p>
                    </div>
                    <Switch
                      checked={notifications.deadlineAlerts}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, deadlineAlerts: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div>
                      <p className="font-medium">Weekly Report</p>
                      <p className="text-sm text-muted-foreground">Receive weekly progress summary</p>
                    </div>
                    <Switch
                      checked={notifications.weeklyReport}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReport: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div>
                      <p className="font-medium">AI Suggestions</p>
                      <p className="text-sm text-muted-foreground">Get AI-powered study recommendations</p>
                    </div>
                    <Switch
                      checked={notifications.aiSuggestions}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, aiSuggestions: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection !== "profile" && activeSection !== "notifications" && activeSection !== "language" && (
            <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="py-12 text-center">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold">
                  {settingsSections.find(s => s.id === activeSection)?.label} Settings
                </h3>
                <p className="text-muted-foreground mt-2">
                  Configure your {settingsSections.find(s => s.id === activeSection)?.label.toLowerCase()} preferences
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
