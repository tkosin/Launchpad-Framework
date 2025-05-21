"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell, faCircleQuestion, faFlag, faChevronDown, faPlus } from "@fortawesome/free-solid-svg-icons"
import { useState, useEffect, useRef } from "react"
import { AvatarChangeModal } from "@/components/avatar-change-modal"
import { AppIcon } from "@/components/app-icon"
import { UnifiedSidebar } from "@/components/unified-sidebar"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/contexts/toast-context"
import { useAuth } from "@/contexts/auth-context"
import { loadApps, convertToAppType } from "@/utils/app-loader"
import { LogoImage } from "@/components/logo-image"
import type { AppWithIcon } from "@/types/app-manifest"
import type { AppType } from "@/types/app-manifest"

export default function Dashboard() {
  const { t, language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const { user, canImportApps, canDeleteApps } = useAuth()
  const [allApps, setAllApps] = useState<AppWithIcon[]>([])
  const [installedApps, setInstalledApps] = useState<AppType[]>([])
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      appId: 1, // ERC app id
      app: "ERC",
      message: "New document available for review",
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
    {
      id: 2,
      appId: 2, // RE Procurement app id
      app: "RE Procurement",
      message: "Procurement request approved by management",
      timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    },
    {
      id: 3,
      appId: 4, // Power Purchase app id
      app: "Power Purchase",
      message: "New power purchase agreement requires attention",
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
  ])
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [userAvatar, setUserAvatar] = useState(user?.avatar || "/diverse-group.png")
  const [navbarColor, setNavbarColor] = useState("#002b41") // Default Facgure blue
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  const languageDropdownRef = useRef<HTMLDivElement>(null)
  const [logoLoaded, setLogoLoaded] = useState(true)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setLanguageDropdownOpen(false)
      }
    }

    // Add event listener when dropdown is open
    if (languageDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    // Clean up event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [languageDropdownOpen])

  // Unified sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSidebarSection, setActiveSidebarSection] = useState<
    "help" | "notifications" | "profile" | "appstore" | null
  >(null)

  // Load apps and set default installed apps
  useEffect(() => {
    const apps = loadApps()
    setAllApps(apps)

    // Set default installed apps (system apps)
    const defaultApps = apps.filter((app) => app.isSystem).map((app) => convertToAppType(app))

    setInstalledApps(defaultApps)
  }, [])

  // Store navbar color in localStorage
  useEffect(() => {
    const storedColor = localStorage.getItem("navbarColor")
    if (storedColor) {
      setNavbarColor(storedColor)
    }
  }, [])

  // Show welcome message based on time of day
  useEffect(() => {
    if (user) {
      const hour = new Date().getHours()
      let welcomeMessage = ""

      if (hour >= 5 && hour < 12) {
        welcomeMessage = language === "en" ? "Good morning" : "สวัสดีตอนเช้า"
      } else if (hour >= 12 && hour < 18) {
        welcomeMessage = language === "en" ? "Good afternoon" : "สวัสดีตอนบ่าย"
      } else {
        welcomeMessage = language === "en" ? "Good evening" : "สวัสดีตอนเย็น"
      }

      // Add user's name if available
      if (user.name) {
        welcomeMessage += `, ${user.name}`
      }

      // Show welcome toast
      setTimeout(() => {
        showToast(
          "success",
          welcomeMessage,
          language === "en" ? "Welcome back to Facgure Portal" : "ยินดีต้อนรับกลับสู่พอร์ทัล Facgure",
          5000,
        )
      }, 1000)
    }
  }, [user, language, showToast])

  // Update avatar when user changes
  useEffect(() => {
    if (user?.avatar) {
      setUserAvatar(user.avatar)
    }
  }, [user])

  const handleNavbarColorChange = (color: string) => {
    setNavbarColor(color)
    localStorage.setItem("navbarColor", color)
  }

  const handleOpenAppStore = () => {
    setActiveSidebarSection("appstore")
    setSidebarOpen(true)
  }

  const handleInstallApp = (app: AppType) => {
    // Check if app is already installed
    if (!installedApps.some((installedApp) => installedApp.id === app.id)) {
      setInstalledApps([...installedApps, app])

      // Add a notification about the new app
      const newNotification = {
        id: Date.now(),
        appId: app.id,
        app: "Application Directory",
        message: `${app.name} has been installed successfully`,
        timestamp: new Date().toISOString(),
      }
      setNotifications([newNotification, ...notifications])

      // Show toast notification with properly formatted message
      showToast("success", t("appInstalled"), `${app.name} ${t("appInstalledMessage")}`)
    }
  }

  const handleDeleteApp = (id: number) => {
    // Check if user has permission to delete apps
    if (!canDeleteApps) {
      showToast(
        "error",
        language === "en" ? "Permission Denied" : "การเข้าถึงถูกปฏิเสธ",
        language === "en" ? "You don't have permission to delete applications" : "คุณไม่มีสิทธิ์ลบแอปพลิเคชัน",
      )
      return
    }

    // Find the app name before removing it
    const appToDelete = installedApps.find((app) => app.id === id)

    if (appToDelete) {
      setInstalledApps(installedApps.filter((app) => app.id !== id))

      // Show toast notification
      showToast("info", t("appRemoved"), `${appToDelete.name} ${t("appRemovedMessage")}`)
    }
  }

  const openSidebar = (section: "help" | "notifications" | "profile" | "appstore") => {
    setActiveSidebarSection(section)
    setSidebarOpen(true)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  const clearNotification = (id: number) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])

    // Show toast notification
    showToast("info", t("notificationsCleared"), t("notificationsClearedMessage"))
  }

  const handleAvatarChange = (newAvatarUrl: string) => {
    setUserAvatar(newAvatarUrl)

    // Show toast notification
    showToast("success", t("avatarUpdated"), t("avatarUpdatedMessage"))
  }

  // Determine if text should be white or black based on background color
  const getTextColor = (bgColor: string) => {
    // Convert hex to RGB
    const r = Number.parseInt(bgColor.slice(1, 3), 16)
    const g = Number.parseInt(bgColor.slice(3, 5), 16)
    const b = Number.parseInt(bgColor.slice(5, 7), 16)

    // Calculate luminance - a measure of how bright the color appears
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

    // Use white text for dark backgrounds, black text for light backgrounds
    return luminance > 0.5 ? "text-gray-900" : "text-white"
  }

  const textColorClass = getTextColor(navbarColor)

  // Get available apps that aren't already installed
  const getAvailableApps = () => {
    const installedIds = installedApps.map((app) => app.id)
    return allApps.filter((app) => !installedIds.includes(app.id)).map((app) => convertToAppType(app))
  }

  // Toggle language dropdown
  const toggleLanguageDropdown = () => {
    setLanguageDropdownOpen(!languageDropdownOpen)
  }

  // Handle language change
  const handleLanguageChange = (lang: "en" | "th") => {
    setLanguage(lang)
    setLanguageDropdownOpen(false)
  }

  // Add a function to count notifications per app
  const getNotificationCountForApp = (appId: number) => {
    return notifications.filter((notification) => notification.appId === appId).length
  }

  // Function to reset welcome message (for testing)
  const resetWelcomeMessage = () => {
    localStorage.removeItem("hasSeenWelcome")
    window.location.reload()
  }

  // Fallback logo as inline SVG
  const fallbackLogo = (
    <div className="h-10 flex items-center">
      <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 8H110V32H10V8Z" fill="#ffffff" />
        <text
          x="60"
          y="24"
          fontFamily="Arial"
          fontSize="16"
          fill={textColorClass === "text-white" ? "#002b41" : "#ffffff"}
          textAnchor="middle"
        >
          Facgure
        </text>
      </svg>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header with dynamic color */}
      <header
        className={`${textColorClass} py-2 px-4 flex justify-between items-center transition-colors duration-300 shadow-sm`}
        style={{ backgroundColor: navbarColor }}
      >
        <div className="h-10 w-40 relative">
          {logoLoaded ? (
            <LogoImage src="/facgure-logo-light.png" alt="Facgure Logo" fill onError={() => setLogoLoaded(false)} />
          ) : (
            fallbackLogo
          )}
        </div>
        <div className="flex items-center gap-4">
          {/* Custom language switcher directly in the header */}
          <div className="relative">
            <button
              className="flex items-center gap-1 p-1 rounded hover:bg-white/10"
              onClick={toggleLanguageDropdown}
              aria-expanded={languageDropdownOpen}
              aria-haspopup="true"
            >
              <FontAwesomeIcon icon={faFlag} className={`h-4 w-4 ${textColorClass}`} />
              <span className={`text-xs font-medium ${textColorClass}`}>{language === "en" ? "EN" : "TH"}</span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`h-3 w-3 ${textColorClass} transition-transform ${languageDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {languageDropdownOpen && (
              <div
                ref={languageDropdownRef}
                className="absolute right-0 mt-1 py-1 bg-white rounded-md shadow-md z-50 min-w-[120px] animate-in fade-in zoom-in-95 duration-100 border border-gray-200"
              >
                <button
                  className={`flex items-center gap-2 w-full px-3 py-2 text-left text-sm ${
                    language === "en" ? "bg-gray-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleLanguageChange("en")}
                >
                  <FontAwesomeIcon icon={faFlag} className="h-4 w-4 text-facgure-blue" />
                  <span className="font-en text-gray-800">English</span>
                </button>
                <button
                  className={`flex items-center gap-2 w-full px-3 py-2 text-left text-sm ${
                    language === "th" ? "bg-gray-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleLanguageChange("th")}
                >
                  <FontAwesomeIcon icon={faFlag} className="h-4 w-4 text-facgure-blue" />
                  <span className="font-th text-gray-800">ไทย</span>
                </button>
              </div>
            )}
          </div>

          <button className="p-1" onClick={() => openSidebar("help")}>
            <FontAwesomeIcon icon={faCircleQuestion} className={`w-5 h-5 ${textColorClass}`} />
          </button>
          <div className="relative">
            <button className="p-1" onClick={() => openSidebar("notifications")}>
              <FontAwesomeIcon icon={faBell} className={`w-5 h-5 ${textColorClass}`} />
            </button>
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-facgure-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </div>
          <div className="relative">
            <button className="flex items-center gap-2" onClick={() => openSidebar("profile")}>
              <div className="h-9 w-9 rounded-full overflow-hidden relative border-2 border-white shadow-sm cursor-pointer">
                <LogoImage
                  src={userAvatar || "/placeholder.svg"}
                  alt="Profile"
                  width={36}
                  height={36}
                  className="object-cover"
                />
              </div>
              <div className="text-sm">
                <p className={`font-medium ${textColorClass}`}>{user?.name || "อภิชาติ นิลมณีติ"}</p>
                <p className={`text-xs ${textColorClass === "text-white" ? "text-gray-300" : "text-gray-600"}`}>
                  {user?.company || "บริษัท โซลาร์เอเชีย.เท็ค จำกัด"}
                </p>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {/* Menu Icons */}
        <div className="mb-6">
          <div className="flex justify-end items-center mb-4">
            {canImportApps && (
              <button
                onClick={handleOpenAppStore}
                className="px-4 py-2 bg-facgure-blue text-white rounded-md text-sm hover:bg-opacity-90 transition-colors flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
                {t("importApps")}
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {installedApps.map((app) => (
              <AppIcon
                key={app.id}
                id={app.id}
                name={app.name}
                icon={app.icon}
                color={app.color}
                onDelete={handleDeleteApp}
                notificationCount={getNotificationCountForApp(app.id)}
              />
            ))}
          </div>
        </div>

        {/* Work Panel */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-800">{t("yourWork")}</h2>
              <button className="text-sm text-facgure-blue hover:text-opacity-80">View All</button>
            </div>
            <div className="p-16 flex flex-col items-center justify-center">
              <div className="w-16 h-16 mb-4 text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-16 h-16"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-center">{t("noCurrentTasks")}</p>
            </div>
          </div>
        </div>

        {/* For development/testing only - button to reset welcome message */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 text-center">
            <button
              onClick={resetWelcomeMessage}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition-colors"
            >
              Reset Welcome Message (Dev Only)
            </button>
          </div>
        )}
      </main>

      {/* Unified Sidebar */}
      <UnifiedSidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        activeSection={activeSidebarSection}
        notifications={notifications}
        clearNotification={clearNotification}
        clearAllNotifications={clearAllNotifications}
        userAvatar={userAvatar}
        userEmail={user?.email || "user@solarasia.tech"}
        userName={user?.name || "อภิชาติ นิลมณีติ"}
        userCompany={user?.company || "บริษัท โซลาร์เอเชีย.เท็ค จำกัด"}
        onAvatarChangeClick={() => setShowAvatarModal(true)}
        navbarColor={navbarColor}
        onNavbarColorChange={handleNavbarColorChange}
        availableApps={getAvailableApps()}
        installedApps={installedApps}
        onInstallApp={handleInstallApp}
        language={language}
        t={t}
      />

      {/* Avatar Change Modal */}
      <AvatarChangeModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        onAvatarChange={handleAvatarChange}
        currentAvatar={userAvatar}
        language={language}
        t={t}
      />
    </div>
  )
}
