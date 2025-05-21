"use client"

import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBell,
  faCircleQuestion,
  faHome,
  faFileLines,
  faUser,
  faChartColumn,
  faCalendar,
  faFileExcel,
  faEnvelope,
  faCommentDots,
  faGear,
  faBolt,
  faDatabase,
  faFileAlt,
  faBriefcase,
  faChartPie,
  faUsers,
  faCreditCard,
  faXmark,
  faPlus,
  faFlag,
  faChevronDown, // Added import for faChevronDown
} from "@fortawesome/free-solid-svg-icons"
import { useState, useEffect } from "react"
import { AvatarChangeModal } from "@/components/avatar-change-modal"
import { AppIcon } from "@/components/app-icon"
import { UnifiedSidebar } from "@/components/unified-sidebar"
import { useLanguage } from "@/contexts/language-context"
import type { AppType } from "@/types/app"

// This could come from an API or configuration
const defaultApps = [
  {
    id: 1,
    name: "ERC",
    icon: faHome,
    color: "#002b41",
    description: "Energy Regulatory Commission dashboard and tools",
    category: "utilities",
  },
  {
    id: 2,
    name: "RE Procurement",
    icon: faFileLines,
    color: "#002b41",
    description: "Renewable Energy procurement management system",
    category: "finance",
  },
  {
    id: 3,
    name: "Profile",
    icon: faUser,
    color: "#002b41",
    description: "User profile and account management",
    category: "utilities",
  },
  {
    id: 4,
    name: "Power Purchase",
    icon: faBell,
    color: "#002b41",
    description: "Power purchase agreements and notifications",
    category: "finance",
  },
]

// Available apps in the app store
const storeApps: AppType[] = [
  {
    id: 5,
    name: "Analytics Dashboard",
    icon: faChartColumn,
    color: "#002b41",
    description: "Comprehensive analytics and reporting dashboard for energy consumption and production",
    category: "productivity",
  },
  {
    id: 6,
    name: "Calendar",
    icon: faCalendar,
    color: "#002b41",
    description: "Schedule meetings and manage events related to energy projects",
    category: "productivity",
  },
  {
    id: 7,
    name: "Document Manager",
    icon: faFileExcel,
    color: "#002b41",
    description: "Organize and manage all your energy-related documents in one place",
    category: "utilities",
  },
  {
    id: 8,
    name: "Messaging",
    icon: faCommentDots,
    color: "#002b41",
    description: "Secure messaging platform for team communication",
    category: "communication",
  },
  {
    id: 9,
    name: "Email Client",
    icon: faEnvelope,
    color: "#002b41",
    description: "Integrated email client for all your correspondence needs",
    category: "communication",
  },
  {
    id: 10,
    name: "System Settings",
    icon: faGear,
    color: "#002b41",
    description: "Configure system settings and preferences",
    category: "utilities",
  },
  {
    id: 11,
    name: "Energy Optimizer",
    icon: faBolt,
    color: "#002b41",
    description: "AI-powered tool to optimize energy usage and reduce costs",
    category: "utilities",
  },
  {
    id: 12,
    name: "Database Explorer",
    icon: faDatabase,
    color: "#002b41",
    description: "Access and query energy databases with an intuitive interface",
    category: "productivity",
  },
  {
    id: 13,
    name: "Contract Management",
    icon: faFileAlt,
    color: "#002b41",
    description: "Create, manage, and track energy contracts and agreements",
    category: "finance",
  },
  {
    id: 14,
    name: "Project Tracker",
    icon: faBriefcase,
    color: "#002b41",
    description: "Track progress of energy projects and initiatives",
    category: "productivity",
  },
  {
    id: 15,
    name: "Financial Reports",
    icon: faChartPie,
    color: "#002b41",
    description: "Generate and analyze financial reports for energy investments",
    category: "finance",
  },
  {
    id: 16,
    name: "Team Management",
    icon: faUsers,
    color: "#002b41",
    description: "Manage team members and their access to energy resources",
    category: "communication",
  },
  {
    id: 17,
    name: "Payment Portal",
    icon: faCreditCard,
    color: "#002b41",
    description: "Process payments and manage billing for energy services",
    category: "finance",
  },
]

export default function Dashboard() {
  const { t, language, setLanguage } = useLanguage()
  const [apps, setApps] = useState<AppType[]>(defaultApps)
  const [showNotification, setShowNotification] = useState(true)
  const [notifications, setNotifications] = useState([
    { id: 1, app: "ERC", message: "New document available for review" },
    { id: 2, app: "RE Procurement", message: "Procurement request approved by management" },
    { id: 3, app: "Power Purchase", message: "New power purchase agreement requires attention" },
  ])
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [userAvatar, setUserAvatar] = useState("/diverse-group.png")
  const [navbarColor, setNavbarColor] = useState("#002b41") // Default Facgure blue
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)

  // Unified sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSidebarSection, setActiveSidebarSection] = useState<
    "help" | "notifications" | "profile" | "appstore" | null
  >(null)

  // Store navbar color in localStorage
  useEffect(() => {
    const storedColor = localStorage.getItem("navbarColor")
    if (storedColor) {
      setNavbarColor(storedColor)
    }
  }, [])

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
    if (!apps.some((installedApp) => installedApp.id === app.id)) {
      setApps([...apps, app])

      // Add a notification about the new app
      const newNotification = {
        id: Date.now(),
        app: "Application Directory",
        message: `${app.name} has been installed successfully`,
      }
      setNotifications([newNotification, ...notifications])
    }
  }

  const handleDeleteApp = (id: number) => {
    setApps(apps.filter((app) => app.id !== id))
  }

  const handleDismissNotification = () => {
    setShowNotification(false)
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
  }

  const handleAvatarChange = (newAvatarUrl: string) => {
    setUserAvatar(newAvatarUrl)
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
    return [...storeApps, ...defaultApps.filter((app) => !apps.some((a) => a.id === app.id))]
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header with dynamic color */}
      <header
        className={`${textColorClass} py-2 px-4 flex justify-between items-center transition-colors duration-300 shadow-sm`}
        style={{ backgroundColor: navbarColor }}
      >
        <div className="h-10 w-40 relative">
          <Image src="/facgure-logo-light.png" alt="Facgure Logo" fill className="object-contain" />
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
              <div className="absolute right-0 mt-1 py-1 bg-white rounded-md shadow-md z-50 min-w-[120px] animate-in fade-in zoom-in-95 duration-100 border border-gray-200">
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
                <Image
                  src={userAvatar || "/placeholder.svg"}
                  alt="Profile"
                  width={36}
                  height={36}
                  className="object-cover"
                />
              </div>
              <div className="text-sm">
                <p className={`font-medium ${textColorClass}`}>อภิชาติ นิลมณีติ</p>
                <p className={`text-xs ${textColorClass === "text-white" ? "text-gray-300" : "text-gray-600"}`}>
                  บริษัท โซลาร์เอเชีย.เท็ค จำกัด
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
            <button
              onClick={handleOpenAppStore}
              className="px-4 py-2 bg-facgure-blue text-white rounded-md text-sm hover:bg-opacity-90 transition-colors flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
              {t("importApps")}
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {apps.map((app) => (
              <AppIcon
                key={app.id}
                id={app.id}
                name={app.name}
                icon={app.icon}
                color={app.color}
                onDelete={handleDeleteApp}
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
      </main>

      {/* Success Notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 z-50 bg-white rounded-md shadow-md p-3 pr-8 flex items-center gap-3 max-w-sm border-l-4 border-green-600">
          <div className="bg-green-600 rounded-full p-1 flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-800">{t("congratulations")}</p>
            <p className="text-gray-600 text-xs">{t("verificationComplete")}</p>
          </div>
          <button className="absolute top-2 right-2" onClick={handleDismissNotification}>
            <FontAwesomeIcon icon={faXmark} className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      )}

      {/* Unified Sidebar */}
      <UnifiedSidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        activeSection={activeSidebarSection}
        notifications={notifications}
        clearNotification={clearNotification}
        clearAllNotifications={clearAllNotifications}
        userAvatar={userAvatar}
        userEmail="user@solarasia.tech"
        userName="อภิชาติ นิลมณีติ"
        userCompany="บริษัท โซลาร์เอเชีย.เท็ค จำกัด"
        onAvatarChangeClick={() => setShowAvatarModal(true)}
        navbarColor={navbarColor}
        onNavbarColorChange={handleNavbarColorChange}
        availableApps={getAvailableApps()}
        installedApps={apps}
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
