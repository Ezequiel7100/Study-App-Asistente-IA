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
import { Spinner } from "@/components/ui/spinner"
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
  Sun,
  Moon,
  Monitor,
} from "lucide-react"
import { useI18n, type Locale } from "@/lib/i18n"
import { useProfileStore } from "@/lib/profile-store"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function SettingsPage() {
  const { t, locale, setLocale } = useI18n()
  const { profile, fetchProfile, updateProfile, updateLanguage, updateTheme, isLoading: profileLoading } = useProfileStore()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("profile")
  const [isSaving, setIsSaving] = useState(false)

  // Form state for profile editing
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [career, setCareer] = useState("")
  const [university, setUniversity] = useState("")
  const [semester, setSemester] = useState<number | null>(null)

  // Notifications state
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    reminders: true,
  })

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "")
      setLastName(profile.last_name || "")
      setEmail(profile.email || "")
      setCareer(profile.career || "")
      setUniversity(profile.university || "")
      setSemester(profile.semester)
      setNotifications(profile.notifications || { email: true, push: true, reminders: true })
    }
  }, [profile])

  // Handle language change with Supabase persistence
  const handleLanguageChange = async (newLocale: Locale) => {
    setLocale(newLocale)
    if (profile) {
      await updateLanguage(newLocale)
    }
  }

  // Handle theme change with persistence
  const handleThemeChange = async (newTheme: "dark" | "light" | "system") => {
    setTheme(newTheme)
    if (profile) {
      await updateTheme(newTheme)
    }
  }

  // Save profile changes
  const handleSaveProfile = async () => {
    if (!profile) return
    setIsSaving(true)
    try {
      await updateProfile({
        first_name: firstName,
        last_name: lastName,
        career: career || null,
        university: university || null,
        semester: semester,
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Save notifications
  const handleSaveNotifications = async () => {
    if (!profile) return
    setIsSaving(true)
    try {
      await updateProfile({ notifications })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle logout
  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  // Get user initials
  const getInitials = () => {
    const first = firstName || profile?.first_name || ""
    const last = lastName || profile?.last_name || ""
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || "U"
  }

  const settingsSections = [
    { id: "profile", label: t("common.profile"), icon: User },
    { id: "notifications", label: t("settings.notifications"), icon: Bell },
    { id: "appearance", label: t("settings.appearance"), icon: Palette },
    { id: "language", label: t("settings.language"), icon: Languages },
    { id: "ai-settings", label: t("nav.aiTutor"), icon: Bot },
    { id: "calendar", label: t("nav.calendar"), icon: Calendar },
    { id: "integrations", label: t("nav.driveSync"), icon: Cloud },
    { id: "privacy", label: locale === "es" ? "Privacidad" : locale === "pt" ? "Privacidade" : "Privacy", icon: Shield },
    { id: "billing", label: locale === "es" ? "Facturacion" : locale === "pt" ? "Faturamento" : "Billing", icon: CreditCard },
  ]

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("settings.title")}</h1>
        <p className="text-muted-foreground">
          {locale === "es" ? "Administra tu cuenta y preferencias" : locale === "pt" ? "Gerencie sua conta e preferencias" : "Manage your account and preferences"}
        </p>
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
                {locale === "es" ? "Ayuda y Soporte" : locale === "pt" ? "Ajuda e Suporte" : "Help & Support"}
              </button>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-all"
              >
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
                <CardDescription>
                  {locale === "es" ? "Administra tu informacion personal" : locale === "pt" ? "Gerencie suas informacoes pessoais" : "Manage your personal information"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {profileLoading && !profile ? (
                  <div className="flex items-center justify-center py-12">
                    <Spinner className="h-8 w-8" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={profile?.avatar_url || undefined} />
                          <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
                        </Avatar>
                        <Button
                          size="icon"
                          className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {firstName || lastName ? `${firstName} ${lastName}`.trim() : locale === "es" ? "Usuario" : locale === "pt" ? "Usuario" : "User"}
                        </h3>
                        <p className="text-sm text-muted-foreground">{career || (locale === "es" ? "Sin carrera" : locale === "pt" ? "Sem carreira" : "No career set")}</p>
                        <Badge className="mt-2 bg-primary/10 text-primary border-primary/20">
                          {profile?.academic_level === "undergraduate" ? (locale === "es" ? "Pregrado" : locale === "pt" ? "Graduacao" : "Undergraduate") : 
                           profile?.academic_level === "graduate" ? (locale === "es" ? "Posgrado" : locale === "pt" ? "Pos-graduacao" : "Graduate") : 
                           (locale === "es" ? "Estudiante" : locale === "pt" ? "Estudante" : "Student")}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">{t("auth.firstName")}</Label>
                        <Input 
                          id="firstName" 
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder={locale === "es" ? "Tu nombre" : locale === "pt" ? "Seu nome" : "Your first name"}
                          className="rounded-xl" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">{t("auth.lastName")}</Label>
                        <Input 
                          id="lastName" 
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder={locale === "es" ? "Tu apellido" : locale === "pt" ? "Seu sobrenome" : "Your last name"}
                          className="rounded-xl" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t("auth.email")}</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="email" 
                            value={email}
                            disabled
                            className="rounded-xl pl-10 bg-muted/50" 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="career">{locale === "es" ? "Carrera" : locale === "pt" ? "Carreira" : "Career/Major"}</Label>
                        <div className="relative">
                          <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="career" 
                            value={career}
                            onChange={(e) => setCareer(e.target.value)}
                            placeholder={locale === "es" ? "Ej: Ingenieria de Software" : locale === "pt" ? "Ex: Engenharia de Software" : "e.g. Computer Science"}
                            className="rounded-xl pl-10" 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="university">{locale === "es" ? "Universidad" : locale === "pt" ? "Universidade" : "University"}</Label>
                        <Input 
                          id="university" 
                          value={university}
                          onChange={(e) => setUniversity(e.target.value)}
                          placeholder={locale === "es" ? "Nombre de tu universidad" : locale === "pt" ? "Nome da sua universidade" : "Your university name"}
                          className="rounded-xl" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="semester">{locale === "es" ? "Semestre" : locale === "pt" ? "Semestre" : "Semester"}</Label>
                        <Select 
                          value={semester?.toString() || ""} 
                          onValueChange={(v) => setSemester(v ? parseInt(v) : null)}
                        >
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder={locale === "es" ? "Seleccionar semestre" : locale === "pt" ? "Selecionar semestre" : "Select semester"} />
                          </SelectTrigger>
                          <SelectContent>
                            {[1,2,3,4,5,6,7,8,9,10,11,12].map((sem) => (
                              <SelectItem key={sem} value={sem.toString()}>
                                {locale === "es" ? `Semestre ${sem}` : locale === "pt" ? `Semestre ${sem}` : `Semester ${sem}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleSaveProfile} disabled={isSaving} className="rounded-xl">
                        {isSaving ? <Spinner className="h-4 w-4 mr-2" /> : null}
                        {t("common.save")}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {activeSection === "appearance" && (
            <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  {t("settings.appearance")}
                </CardTitle>
                <CardDescription>
                  {locale === "es" ? "Personaliza la apariencia de la aplicacion" : locale === "pt" ? "Personalize a aparencia do aplicativo" : "Customize the appearance of the application"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>{locale === "es" ? "Tema" : locale === "pt" ? "Tema" : "Theme"}</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => handleThemeChange("light")}
                      className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-all ${
                        theme === "light" 
                          ? "bg-primary/10 border-2 border-primary" 
                          : "bg-muted/50 hover:bg-muted border-2 border-transparent"
                      }`}
                    >
                      <div className="h-12 w-12 rounded-xl bg-white border flex items-center justify-center">
                        <Sun className="h-6 w-6 text-amber-500" />
                      </div>
                      <span className="text-sm font-medium">
                        {locale === "es" ? "Claro" : locale === "pt" ? "Claro" : "Light"}
                      </span>
                      {theme === "light" && (
                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleThemeChange("dark")}
                      className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-all ${
                        theme === "dark" 
                          ? "bg-primary/10 border-2 border-primary" 
                          : "bg-muted/50 hover:bg-muted border-2 border-transparent"
                      }`}
                    >
                      <div className="h-12 w-12 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                        <Moon className="h-6 w-6 text-blue-400" />
                      </div>
                      <span className="text-sm font-medium">
                        {locale === "es" ? "Oscuro" : locale === "pt" ? "Escuro" : "Dark"}
                      </span>
                      {theme === "dark" && (
                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleThemeChange("system")}
                      className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-all ${
                        theme === "system" 
                          ? "bg-primary/10 border-2 border-primary" 
                          : "bg-muted/50 hover:bg-muted border-2 border-transparent"
                      }`}
                    >
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-white to-zinc-900 border flex items-center justify-center">
                        <Monitor className="h-6 w-6 text-gray-500" />
                      </div>
                      <span className="text-sm font-medium">
                        {locale === "es" ? "Sistema" : locale === "pt" ? "Sistema" : "System"}
                      </span>
                      {theme === "system" && (
                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {locale === "es" 
                    ? "El tema se aplicara automaticamente en toda la aplicacion."
                    : locale === "pt"
                    ? "O tema sera aplicado automaticamente em todo o aplicativo."
                    : "Theme will be applied automatically throughout the app."}
                </p>
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
                        <p className="font-medium">{t("settings.portuguese")}</p>
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
                <CardDescription>
                  {locale === "es" ? "Configura como recibes las notificaciones" : locale === "pt" ? "Configure como voce recebe notificacoes" : "Configure how you receive notifications"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div>
                      <p className="font-medium">{locale === "es" ? "Notificaciones por Email" : locale === "pt" ? "Notificacoes por Email" : "Email Notifications"}</p>
                      <p className="text-sm text-muted-foreground">{locale === "es" ? "Recibe actualizaciones por email" : locale === "pt" ? "Receba atualizacoes por email" : "Receive updates via email"}</p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div>
                      <p className="font-medium">{locale === "es" ? "Notificaciones Push" : locale === "pt" ? "Notificacoes Push" : "Push Notifications"}</p>
                      <p className="text-sm text-muted-foreground">{locale === "es" ? "Recibe notificaciones push" : locale === "pt" ? "Receba notificacoes push" : "Receive push notifications"}</p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div>
                      <p className="font-medium">{locale === "es" ? "Recordatorios de Estudio" : locale === "pt" ? "Lembretes de Estudo" : "Study Reminders"}</p>
                      <p className="text-sm text-muted-foreground">{locale === "es" ? "Recibe recordatorios de sesiones de estudio" : locale === "pt" ? "Receba lembretes de sessoes de estudo" : "Get reminded about study sessions"}</p>
                    </div>
                    <Switch
                      checked={notifications.reminders}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, reminders: checked })}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSaveNotifications} disabled={isSaving} className="rounded-xl">
                    {isSaving ? <Spinner className="h-4 w-4 mr-2" /> : null}
                    {t("common.save")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection !== "profile" && activeSection !== "notifications" && activeSection !== "language" && activeSection !== "appearance" && (
            <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="py-12 text-center">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold">
                  {settingsSections.find(s => s.id === activeSection)?.label} {locale === "es" ? "Configuracion" : locale === "pt" ? "Configuracoes" : "Settings"}
                </h3>
                <p className="text-muted-foreground mt-2">
                  {locale === "es" 
                    ? `Configura tus preferencias de ${settingsSections.find(s => s.id === activeSection)?.label.toLowerCase()}`
                    : locale === "pt"
                    ? `Configure suas preferencias de ${settingsSections.find(s => s.id === activeSection)?.label.toLowerCase()}`
                    : `Configure your ${settingsSections.find(s => s.id === activeSection)?.label.toLowerCase()} preferences`}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
