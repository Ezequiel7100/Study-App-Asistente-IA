"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type Locale = "en" | "es" | "pt"

type Translations = {
  [key: string]: string
}

const translations: Record<Locale, Translations> = {
  en: {
    // Common
    "common.loading": "Loading...",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.create": "Create",
    "common.search": "Search",
    "common.settings": "Settings",
    "common.logout": "Log out",
    "common.profile": "Profile",
    
    // Auth
    "auth.login": "Sign in",
    "auth.signup": "Sign up",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.confirmPassword": "Confirm password",
    "auth.firstName": "First name",
    "auth.lastName": "Last name",
    "auth.welcomeBack": "Welcome back",
    "auth.createAccount": "Create an account",
    "auth.enterCredentials": "Enter your credentials to access your account",
    "auth.enterDetails": "Enter your details to get started",
    "auth.noAccount": "Don't have an account?",
    "auth.hasAccount": "Already have an account?",
    "auth.signingIn": "Signing in...",
    "auth.creatingAccount": "Creating account...",
    "auth.continueWithGoogle": "Continue with Google",
    "auth.orContinueWith": "Or continue with",
    "auth.passwordMismatch": "Passwords do not match",
    "auth.passwordTooShort": "Password must be at least 6 characters",
    "auth.checkEmail": "Check your email",
    "auth.confirmationSent": "We've sent you a confirmation email. Please check your inbox and click the link to verify your account.",
    "auth.backToLogin": "Back to login",
    
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.calendar": "Calendar",
    "nav.subjects": "Subjects",
    "nav.tasks": "Tasks",
    "nav.aiTutor": "AI Tutor",
    "nav.analytics": "Analytics",
    "nav.driveSync": "Drive Sync",
    "nav.settings": "Settings",
    "nav.askAI": "Ask AI",
    
    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.weeklyStudyHours": "Weekly Study Hours",
    "dashboard.upcomingExams": "Upcoming Exams",
    "dashboard.pendingTasks": "Pending Tasks",
    "dashboard.productivityScore": "Productivity Score",
    "dashboard.aiRecommendations": "AI Recommendations",
    "dashboard.yourAcademicCopilot": "Your Academic Copilot",
    
    // AI Tutor
    "aiTutor.title": "AI Tutor",
    "aiTutor.yourCopilot": "Your academic copilot",
    "aiTutor.welcome": "Welcome to AI Tutor",
    "aiTutor.welcomeDesc": "I'm your personal study assistant. Ask me anything about your coursework, and I'll help you learn effectively.",
    "aiTutor.placeholder": "Ask me anything about your studies...",
    "aiTutor.enterToSend": "Press Enter to send, Shift+Enter for new line",
    "aiTutor.messages": "messages",
    "aiTutor.thinking": "Thinking...",
    "aiTutor.buildStudyPlan": "Build Study Plan",
    "aiTutor.explainTopic": "Explain Topic",
    "aiTutor.quizMe": "Quiz Me",
    "aiTutor.solveProblem": "Solve Problem",
    "aiTutor.summarizeNotes": "Summarize Notes",
    "aiTutor.studyTips": "Study Tips",
    
    // Calendar
    "calendar.title": "Calendar",
    "calendar.today": "Today",
    "calendar.week": "Week",
    "calendar.month": "Month",
    "calendar.day": "Day",
    "calendar.addEvent": "Add Event",
    
    // Subjects
    "subjects.title": "Subjects",
    "subjects.addSubject": "Add Subject",
    "subjects.activeSubjects": "Active Subjects",
    "subjects.archivedSubjects": "Archived Subjects",
    
    // Tasks
    "tasks.title": "Tasks",
    "tasks.addTask": "Add Task",
    "tasks.allTasks": "All Tasks",
    "tasks.completed": "Completed",
    "tasks.pending": "Pending",
    "tasks.highPriority": "High Priority",
    
    // Drive Sync
    "driveSync.title": "Drive Sync",
    "driveSync.connectManage": "Connect and manage your cloud storage",
    "driveSync.syncNow": "Sync Now",
    "driveSync.syncing": "Syncing...",
    "driveSync.connected": "Connected",
    "driveSync.notConnected": "Not connected",
    "driveSync.connect": "Connect",
    "driveSync.recentFiles": "Recent Files",
    "driveSync.storageOverview": "Storage Overview",
    "driveSync.quickActions": "Quick Actions",
    "driveSync.uploadFiles": "Upload Files",
    "driveSync.createFolder": "Create Folder",
    "driveSync.shareFiles": "Share Files",
    
    // Settings
    "settings.title": "Settings",
    "settings.account": "Account",
    "settings.appearance": "Appearance",
    "settings.notifications": "Notifications",
    "settings.language": "Language",
    "settings.english": "English",
    "settings.spanish": "Spanish",
    "settings.portuguese": "Portuguese",
    
    // Branding
    "brand.name": "StudySync",
    "brand.tagline": "AI-Powered",
    "brand.fullName": "StudySync AI",
    "brand.academicCopilot": "Your AI-Powered Academic Copilot",
    "brand.description": "Organize your studies, track your progress, and get personalized AI recommendations to help you succeed.",
    
    // Features
    "features.aiRecommendations": "AI-powered study recommendations",
    "features.smartCalendar": "Smart calendar with scheduling",
    "features.progressTracking": "Progress tracking & analytics",
    "features.interactiveAI": "Interactive AI tutor",
    "features.freeStart": "Free to get started - no credit card required",
  },
  es: {
    // Common
    "common.loading": "Cargando...",
    "common.save": "Guardar",
    "common.cancel": "Cancelar",
    "common.delete": "Eliminar",
    "common.edit": "Editar",
    "common.create": "Crear",
    "common.search": "Buscar",
    "common.settings": "Configuración",
    "common.logout": "Cerrar sesión",
    "common.profile": "Perfil",
    
    // Auth
    "auth.login": "Iniciar sesión",
    "auth.signup": "Registrarse",
    "auth.email": "Correo electrónico",
    "auth.password": "Contraseña",
    "auth.confirmPassword": "Confirmar contraseña",
    "auth.firstName": "Nombre",
    "auth.lastName": "Apellido",
    "auth.welcomeBack": "Bienvenido de nuevo",
    "auth.createAccount": "Crear una cuenta",
    "auth.enterCredentials": "Ingresa tus credenciales para acceder a tu cuenta",
    "auth.enterDetails": "Ingresa tus datos para comenzar",
    "auth.noAccount": "¿No tienes una cuenta?",
    "auth.hasAccount": "¿Ya tienes una cuenta?",
    "auth.signingIn": "Iniciando sesión...",
    "auth.creatingAccount": "Creando cuenta...",
    "auth.continueWithGoogle": "Continuar con Google",
    "auth.orContinueWith": "O continuar con",
    "auth.passwordMismatch": "Las contraseñas no coinciden",
    "auth.passwordTooShort": "La contraseña debe tener al menos 6 caracteres",
    "auth.checkEmail": "Revisa tu correo",
    "auth.confirmationSent": "Te hemos enviado un correo de confirmación. Revisa tu bandeja de entrada y haz clic en el enlace para verificar tu cuenta.",
    "auth.backToLogin": "Volver al inicio de sesión",
    
    // Navigation
    "nav.dashboard": "Panel",
    "nav.calendar": "Calendario",
    "nav.subjects": "Materias",
    "nav.tasks": "Tareas",
    "nav.aiTutor": "Tutor IA",
    "nav.analytics": "Análisis",
    "nav.driveSync": "Sincronización",
    "nav.settings": "Configuración",
    "nav.askAI": "Preguntar a IA",
    
    // Dashboard
    "dashboard.title": "Panel",
    "dashboard.weeklyStudyHours": "Horas de Estudio Semanales",
    "dashboard.upcomingExams": "Próximos Exámenes",
    "dashboard.pendingTasks": "Tareas Pendientes",
    "dashboard.productivityScore": "Puntuación de Productividad",
    "dashboard.aiRecommendations": "Recomendaciones de IA",
    "dashboard.yourAcademicCopilot": "Tu Copiloto Académico",
    
    // AI Tutor
    "aiTutor.title": "Tutor IA",
    "aiTutor.yourCopilot": "Tu copiloto académico",
    "aiTutor.welcome": "Bienvenido al Tutor IA",
    "aiTutor.welcomeDesc": "Soy tu asistente de estudio personal. Pregúntame cualquier cosa sobre tus cursos y te ayudaré a aprender eficazmente.",
    "aiTutor.placeholder": "Pregúntame lo que quieras sobre tus estudios...",
    "aiTutor.enterToSend": "Presiona Enter para enviar, Shift+Enter para nueva línea",
    "aiTutor.messages": "mensajes",
    "aiTutor.thinking": "Pensando...",
    "aiTutor.buildStudyPlan": "Crear Plan de Estudio",
    "aiTutor.explainTopic": "Explicar Tema",
    "aiTutor.quizMe": "Hazme un Quiz",
    "aiTutor.solveProblem": "Resolver Problema",
    "aiTutor.summarizeNotes": "Resumir Notas",
    "aiTutor.studyTips": "Consejos de Estudio",
    
    // Calendar
    "calendar.title": "Calendario",
    "calendar.today": "Hoy",
    "calendar.week": "Semana",
    "calendar.month": "Mes",
    "calendar.day": "Día",
    "calendar.addEvent": "Agregar Evento",
    
    // Subjects
    "subjects.title": "Materias",
    "subjects.addSubject": "Agregar Materia",
    "subjects.activeSubjects": "Materias Activas",
    "subjects.archivedSubjects": "Materias Archivadas",
    
    // Tasks
    "tasks.title": "Tareas",
    "tasks.addTask": "Agregar Tarea",
    "tasks.allTasks": "Todas las Tareas",
    "tasks.completed": "Completadas",
    "tasks.pending": "Pendientes",
    "tasks.highPriority": "Alta Prioridad",
    
    // Drive Sync
    "driveSync.title": "Sincronización",
    "driveSync.connectManage": "Conecta y administra tu almacenamiento en la nube",
    "driveSync.syncNow": "Sincronizar",
    "driveSync.syncing": "Sincronizando...",
    "driveSync.connected": "Conectado",
    "driveSync.notConnected": "No conectado",
    "driveSync.connect": "Conectar",
    "driveSync.recentFiles": "Archivos Recientes",
    "driveSync.storageOverview": "Resumen de Almacenamiento",
    "driveSync.quickActions": "Acciones Rápidas",
    "driveSync.uploadFiles": "Subir Archivos",
    "driveSync.createFolder": "Crear Carpeta",
    "driveSync.shareFiles": "Compartir Archivos",
    
    // Settings
    "settings.title": "Configuración",
    "settings.account": "Cuenta",
    "settings.appearance": "Apariencia",
    "settings.notifications": "Notificaciones",
    "settings.language": "Idioma",
    "settings.english": "Ingles",
    "settings.spanish": "Espanol",
    "settings.portuguese": "Portugues",
    
    // Branding
    "brand.name": "StudySync",
    "brand.tagline": "Con IA",
    "brand.fullName": "StudySync AI",
    "brand.academicCopilot": "Tu Copiloto Académico con IA",
    "brand.description": "Organiza tus estudios, rastrea tu progreso y obtén recomendaciones personalizadas de IA para ayudarte a tener éxito.",
    
    // Features
    "features.aiRecommendations": "Recomendaciones de estudio con IA",
    "features.smartCalendar": "Calendario inteligente con programación",
    "features.progressTracking": "Seguimiento de progreso y análisis",
    "features.interactiveAI": "Tutor de IA interactivo",
    "features.freeStart": "Gratis para comenzar - sin tarjeta de crédito",
  },
  pt: {
    // Common
    "common.loading": "Carregando...",
    "common.save": "Salvar",
    "common.cancel": "Cancelar",
    "common.delete": "Excluir",
    "common.edit": "Editar",
    "common.create": "Criar",
    "common.search": "Buscar",
    "common.settings": "Configurações",
    "common.logout": "Sair",
    "common.profile": "Perfil",
    
    // Auth
    "auth.login": "Entrar",
    "auth.signup": "Cadastrar",
    "auth.email": "E-mail",
    "auth.password": "Senha",
    "auth.confirmPassword": "Confirmar senha",
    "auth.firstName": "Nome",
    "auth.lastName": "Sobrenome",
    "auth.welcomeBack": "Bem-vindo de volta",
    "auth.createAccount": "Criar uma conta",
    "auth.enterCredentials": "Digite suas credenciais para acessar sua conta",
    "auth.enterDetails": "Digite seus dados para começar",
    "auth.noAccount": "Não tem uma conta?",
    "auth.hasAccount": "Já tem uma conta?",
    "auth.signingIn": "Entrando...",
    "auth.creatingAccount": "Criando conta...",
    "auth.continueWithGoogle": "Continuar com Google",
    "auth.orContinueWith": "Ou continuar com",
    "auth.passwordMismatch": "As senhas não coincidem",
    "auth.passwordTooShort": "A senha deve ter pelo menos 6 caracteres",
    "auth.checkEmail": "Verifique seu e-mail",
    "auth.confirmationSent": "Enviamos um e-mail de confirmação. Verifique sua caixa de entrada e clique no link para verificar sua conta.",
    "auth.backToLogin": "Voltar ao login",
    
    // Navigation
    "nav.dashboard": "Painel",
    "nav.calendar": "Calendário",
    "nav.subjects": "Matérias",
    "nav.tasks": "Tarefas",
    "nav.aiTutor": "Tutor IA",
    "nav.analytics": "Análises",
    "nav.driveSync": "Sincronização",
    "nav.settings": "Configurações",
    "nav.askAI": "Perguntar à IA",
    
    // Dashboard
    "dashboard.title": "Painel",
    "dashboard.weeklyStudyHours": "Horas de Estudo Semanais",
    "dashboard.upcomingExams": "Próximas Provas",
    "dashboard.pendingTasks": "Tarefas Pendentes",
    "dashboard.productivityScore": "Pontuação de Produtividade",
    "dashboard.aiRecommendations": "Recomendações de IA",
    "dashboard.yourAcademicCopilot": "Seu Copiloto Acadêmico",
    
    // AI Tutor
    "aiTutor.title": "Tutor IA",
    "aiTutor.yourCopilot": "Seu copiloto acadêmico",
    "aiTutor.welcome": "Bem-vindo ao Tutor IA",
    "aiTutor.welcomeDesc": "Sou seu assistente de estudos pessoal. Pergunte-me qualquer coisa sobre seus cursos e vou ajudá-lo a aprender efetivamente.",
    "aiTutor.placeholder": "Pergunte-me qualquer coisa sobre seus estudos...",
    "aiTutor.enterToSend": "Pressione Enter para enviar, Shift+Enter para nova linha",
    "aiTutor.messages": "mensagens",
    "aiTutor.thinking": "Pensando...",
    "aiTutor.buildStudyPlan": "Criar Plano de Estudos",
    "aiTutor.explainTopic": "Explicar Tópico",
    "aiTutor.quizMe": "Faça um Quiz",
    "aiTutor.solveProblem": "Resolver Problema",
    "aiTutor.summarizeNotes": "Resumir Anotações",
    "aiTutor.studyTips": "Dicas de Estudo",
    
    // Calendar
    "calendar.title": "Calendário",
    "calendar.today": "Hoje",
    "calendar.week": "Semana",
    "calendar.month": "Mês",
    "calendar.day": "Dia",
    "calendar.addEvent": "Adicionar Evento",
    
    // Subjects
    "subjects.title": "Matérias",
    "subjects.addSubject": "Adicionar Matéria",
    "subjects.activeSubjects": "Matérias Ativas",
    "subjects.archivedSubjects": "Matérias Arquivadas",
    
    // Tasks
    "tasks.title": "Tarefas",
    "tasks.addTask": "Adicionar Tarefa",
    "tasks.allTasks": "Todas as Tarefas",
    "tasks.completed": "Concluídas",
    "tasks.pending": "Pendentes",
    "tasks.highPriority": "Alta Prioridade",
    
    // Drive Sync
    "driveSync.title": "Sincronização",
    "driveSync.connectManage": "Conecte e gerencie seu armazenamento em nuvem",
    "driveSync.syncNow": "Sincronizar",
    "driveSync.syncing": "Sincronizando...",
    "driveSync.connected": "Conectado",
    "driveSync.notConnected": "Não conectado",
    "driveSync.connect": "Conectar",
    "driveSync.recentFiles": "Arquivos Recentes",
    "driveSync.storageOverview": "Visão Geral do Armazenamento",
    "driveSync.quickActions": "Ações Rápidas",
    "driveSync.uploadFiles": "Enviar Arquivos",
    "driveSync.createFolder": "Criar Pasta",
    "driveSync.shareFiles": "Compartilhar Arquivos",
    
    // Settings
    "settings.title": "Configurações",
    "settings.account": "Conta",
    "settings.appearance": "Aparência",
    "settings.notifications": "Notificações",
    "settings.language": "Idioma",
    "settings.english": "Inglês",
    "settings.spanish": "Espanhol",
    "settings.portuguese": "Português",
    
    // Branding
    "brand.name": "StudySync",
    "brand.tagline": "Com IA",
    "brand.fullName": "StudySync AI",
    "brand.academicCopilot": "Seu Copiloto Acadêmico com IA",
    "brand.description": "Organize seus estudos, acompanhe seu progresso e obtenha recomendações personalizadas de IA para ajudá-lo a ter sucesso.",
    
    // Features
    "features.aiRecommendations": "Recomendações de estudo com IA",
    "features.smartCalendar": "Calendário inteligente com agendamento",
    "features.progressTracking": "Acompanhamento de progresso e análises",
    "features.interactiveAI": "Tutor de IA interativo",
    "features.freeStart": "Grátis para começar - sem cartão de crédito",
  },
}

type I18nContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en")
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Mark as hydrated
    setIsHydrated(true)
    
    // Load from localStorage on mount
    const savedLocale = localStorage.getItem("studysync-locale") as Locale
    if (savedLocale && (savedLocale === "en" || savedLocale === "es" || savedLocale === "pt")) {
      setLocale(savedLocale)
    } else {
      // Detect browser language
      const browserLang = navigator.language.toLowerCase()
      if (browserLang.startsWith("es")) {
        setLocale("es")
        localStorage.setItem("studysync-locale", "es")
      }
    }
  }, [])

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    localStorage.setItem("studysync-locale", newLocale)
  }

  // Use English on server and first render, then switch to saved locale
  const effectiveLocale = isHydrated ? locale : "en"
  
  const t = (key: string): string => {
    return translations[effectiveLocale][key] || key
  }

  return (
    <I18nContext.Provider value={{ locale: effectiveLocale, setLocale: handleSetLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
