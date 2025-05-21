"use client"

import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faXmark,
  faSpinner,
  faBell,
  faUser,
  faCircleQuestion,
  faRightFromBracket,
  faGear,
  faPlus,
  faMagnifyingGlass,
  faDownload,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons"
import ReactMarkdown from "react-markdown"
import Image from "next/image"
import { ColorPalette } from "./color-palette"
import type { AppType } from "@/types/app"

interface UnifiedSidebarProps {
  isOpen: boolean
  onClose: () => void
  activeSection: "help" | "notifications" | "profile" | "appstore" | null
  notifications: Array<{
    id: number
    appId: number
    app: string
    message: string
    timestamp: string
  }>
  clearNotification: (id: number) => void
  clearAllNotifications: () => void
  userAvatar: string
  userEmail: string
  userName: string
  userCompany: string
  onAvatarChangeClick: () => void
  navbarColor: string
  onNavbarColorChange: (color: string) => void
  availableApps: AppType[]
  installedApps: AppType[]
  onInstallApp: (app: AppType) => void
  language: "en" | "th"
  t: (key: string) => string
}

export function UnifiedSidebar({
  isOpen,
  onClose,
  activeSection,
  notifications,
  clearNotification,
  clearAllNotifications,
  userAvatar,
  userEmail,
  userName,
  userCompany,
  onAvatarChangeClick,
  navbarColor,
  onNavbarColorChange,
  availableApps,
  installedApps,
  onInstallApp,
  language,
  t,
}: UnifiedSidebarProps) {
  const [helpContent, setHelpContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [appCategory, setAppCategory] = useState<string>("all")

  useEffect(() => {
    if (isOpen && activeSection === "help") {
      fetchHelpContent()
    }
  }, [isOpen, activeSection])

  useEffect(() => {
    // Reset search and category when opening app store
    if (isOpen && activeSection === "appstore") {
      setSearchQuery("")
      setAppCategory("all")
    }
  }, [isOpen, activeSection])

  const fetchHelpContent = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Use mock data instead of fetching from GitHub
      const mockHelpContent =
        language === "en"
          ? `
# Facgure System Help

## Getting Started

Welcome to the Facgure Procurement System. This guide will help you navigate and use the system effectively.

### Main Features

1. **ERC** - Energy Regulatory Commission related tasks
2. **RE Procurement** - Renewable Energy procurement management
3. **Profile** - Manage your profile and settings
4. **Power Purchase** - Manage power purchase agreements

## Common Tasks

### Managing Your Profile
- Click on your profile picture to access settings
- Update your information in the profile section
- Change your avatar by clicking on your profile picture

### Working with Applications
- Click on any application icon to open it
- Long-press on an app to delete it from your workspace
- Configure your workspace by adding new applications

### Notifications
- Click the bell icon to view all notifications
- Clear individual notifications by clicking the X button
- Clear all notifications using the "Clear all" button

## Need More Help?

Contact support at support@facgure.com or call +66 2 123 4567.
      `
          : `
# วิธีใช้ระบบ Facgure

## เริ่มต้นใช้งาน

ยินดีต้อนรับสู่ระบบจัดซื้อจัดจ้าง Facgure คู่มือนี้จะช่วยให้คุณนำทางและใช้ระบบได้อย่างมีประสิทธิภาพ

### คุณสมบัติหลัก

1. **ERC** - งานที่เกี่ยวข้องกับคณะกรรมการกำกับกิจการพลังงาน
2. **RE Procurement** - การจัดการจัดซื้อพลังงานหมุนเวียน
3. **Profile** - จัดการโปรไฟล์และการตั้งค่าของคุณ
4. **Power Purchase** - จัดการสัญญาซื้อขายไฟฟ้า

## งานทั่วไป

### การจัดการโปรไฟล์ของคุณ
- คลิกที่รูปโปรไฟล์เพื่อเข้าถึงการตั้งค่า
- อัปเดตข้อมูลของคุณในส่วนโปรไฟล์
- เปลี่ยนอวตารโดยคลิกที่รูปโปรไฟล์ของคุณ

### การทำงานกับแอพพลิเคชัน
- คลิกที่ไอคอนแอพพลิเคชันเพื่อเปิด
- กดค้างที่แอพเพื่อลบออกจากพื้นที่ทำงานของคุณ
- กำหนดค่าพื้นที่ทำงานของคุณโดยเพิ่มแอพพลิเคชันใหม่

### การแจ้งเตือน
- คลิกที่ไอคอนระฆังเพื่อดูการแจ้งเตือนทั้งหมด
- ล้างการแจ้งเตือนแต่ละรายการโดยคลิกที่ปุ่ม X
- ล้างการแจ้งเตือนทั้งหมดโดยใช้ปุ่ม "ล้างทั้งหมด"

## ต้องการความช่วยเหลือเพิ่มเติม?

ติดต่อฝ่ายสนับสนุนที่ support@facgure.com หรือโทร +66 2 123 4567
      `

      setHelpContent(mockHelpContent)
    } catch (err) {
      console.error("Error loading help content:", err)
      setError("Failed to load help content. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const renderSectionIcon = () => {
    switch (activeSection) {
      case "help":
        return <FontAwesomeIcon icon={faCircleQuestion} className="h-5 w-5 text-white" />
      case "notifications":
        return <FontAwesomeIcon icon={faBell} className="h-5 w-5 text-white" />
      case "profile":
        return <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-white" />
      case "appstore":
        return <FontAwesomeIcon icon={faPlus} className="h-5 w-5 text-white" />
      default:
        return null
    }
  }

  const renderSectionTitle = () => {
    switch (activeSection) {
      case "help":
        return t("systemHelp")
      case "notifications":
        return t("notifications")
      case "profile":
        return t("userProfile")
      case "appstore":
        return t("appStore")
      default:
        return ""
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case "help":
        return renderHelpContent()
      case "notifications":
        return renderNotificationsContent()
      case "profile":
        return renderProfileContent()
      case "appstore":
        return renderAppStoreContent()
      default:
        return null
    }
  }

  const renderHelpContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <FontAwesomeIcon icon={faSpinner} className="h-8 w-8 text-facgure-blue animate-spin mb-2" />
          <p className="text-gray-500">Loading help content...</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <button
            onClick={fetchHelpContent}
            className="px-4 py-2 bg-facgure-blue text-white rounded-md hover:bg-opacity-90 transition-colors"
          >
            Try Again
          </button>
        </div>
      )
    }

    return (
      <div className={`prose prose-sm max-w-none p-6 ${language === "en" ? "font-en" : "font-th"}`}>
        <ReactMarkdown>{helpContent}</ReactMarkdown>
      </div>
    )
  }

  const renderNotificationsContent = () => {
    // Function to format timestamp
    const formatTimestamp = (timestamp: string) => {
      const date = new Date(timestamp)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMins / 60)
      const diffDays = Math.floor(diffHours / 24)

      if (diffMins < 1) return language === "en" ? "just now" : "เมื่อสักครู่"
      if (diffMins < 60) return `${diffMins} ${language === "en" ? "min ago" : "นาทีที่แล้ว"}`
      if (diffHours < 24) return `${diffHours} ${language === "en" ? "hours ago" : "ชั่วโมงที่แล้ว"}`
      if (diffDays === 1) return language === "en" ? "yesterday" : "เมื่อวาน"
      return `${diffDays} ${language === "en" ? "days ago" : "วันที่แล้ว"}`
    }

    // Find app color and icon for each notification
    const getAppInfo = (appId: number) => {
      const app = installedApps.find((app) => app.id === appId)
      return {
        color: app?.color || "#002b41",
        icon: app?.icon || faFileLines,
      }
    }

    return (
      <div className="h-full flex flex-col">
        <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-white">
          <h3 className="font-medium">{t("allNotifications")}</h3>
          <button
            className="text-facgure-blue hover:text-opacity-80 text-sm"
            onClick={clearAllNotifications}
            disabled={notifications.length === 0}
          >
            {t("clearAll")}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 flex flex-col items-center">
              <FontAwesomeIcon icon={faBell} className="h-12 w-12 text-gray-300 mb-2" />
              <p>{t("noNotifications")}</p>
              <p className="text-sm text-gray-400">{t("allCaughtUp")}</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const appInfo = getAppInfo(notification.appId)
              return (
                <div
                  key={notification.id}
                  className="p-4 border-b border-gray-100 flex justify-between hover:bg-gray-50"
                >
                  <div className="flex gap-3">
                    <div
                      className="w-10 h-10 rounded-md flex-shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: appInfo.color }}
                    >
                      <FontAwesomeIcon icon={appInfo.icon} className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{notification.app}</p>
                        <span className="text-xs text-gray-400">{formatTimestamp(notification.timestamp)}</span>
                      </div>
                      <p className="text-gray-600 text-sm">{notification.message}</p>
                    </div>
                  </div>
                  <button
                    className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0"
                    onClick={() => clearNotification(notification.id)}
                  >
                    <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>
    )
  }

  const renderProfileContent = () => {
    return (
      <div className="h-full flex flex-col">
        <div className="p-6 flex flex-col items-center border-b border-gray-200">
          <div
            className="h-24 w-24 rounded-full overflow-hidden relative border-4 border-white shadow-md mb-4 cursor-pointer"
            onClick={onAvatarChangeClick}
          >
            <Image src={userAvatar || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
          </div>
          <h3 className="font-medium text-lg">{userName}</h3>
          <p className="text-gray-600">{userCompany}</p>
          <p className="text-gray-500 text-sm">{userEmail}</p>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            <button
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-2"
              onClick={onAvatarChangeClick}
            >
              <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-facgure-blue" />
              <span>{t("changeAvatar")}</span>
            </button>

            <ColorPalette currentColor={navbarColor} onColorChange={onNavbarColorChange} language={language} t={t} />

            <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-2">
              <FontAwesomeIcon icon={faGear} className="w-5 h-5 text-facgure-blue" />
              <span>{t("accountSettings")}</span>
            </button>
            <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-2">
              <FontAwesomeIcon icon={faRightFromBracket} className="w-5 h-5 text-facgure-blue" />
              <span>{t("logout")}</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderAppStoreContent = () => {
    const categories = ["all", "utilities", "finance", "productivity", "communication"]

    // Filter apps based on search and category
    const filteredApps = availableApps.filter((app) => {
      const matchesSearch =
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = appCategory === "all" || app.category === appCategory
      return matchesSearch && matchesCategory
    })

    const isAppInstalled = (app: AppType) => {
      return installedApps.some((installedApp) => installedApp.id === app.id)
    }

    return (
      <div className="h-full flex flex-col">
        <div className="p-3 border-b border-gray-200 bg-white">
          <div className="relative mb-3">
            <input
              type="text"
              placeholder={t("searchApps")}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-facgure-blue focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
                  appCategory === category
                    ? "bg-facgure-blue text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setAppCategory(category)}
              >
                {t(category)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {filteredApps.length === 0 ? (
            <div className="p-8 text-center text-gray-500 flex flex-col items-center">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="h-12 w-12 text-gray-300 mb-2" />
              <p>{t("noAppsFound")}</p>
              <p className="text-sm text-gray-400">{t("tryDifferentSearch")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-12 h-12 rounded-md flex-shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: app.color }}
                    >
                      <FontAwesomeIcon icon={app.icon} className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900">{app.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{app.description}</p>
                    </div>
                    <button
                      className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${
                        isAppInstalled(app)
                          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                          : "bg-facgure-blue text-white hover:bg-opacity-90"
                      }`}
                      onClick={() => !isAppInstalled(app) && onInstallApp(app)}
                      disabled={isAppInstalled(app)}
                    >
                      {isAppInstalled(app) ? (
                        t("installed")
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faDownload} className="w-4 h-4" />
                          <span>{t("install")}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (!isOpen || !activeSection) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />

      {/* Sidebar */}
      <div className="fixed right-0 h-full w-80 md:w-96 bg-white shadow-xl flex flex-col animate-in slide-in-from-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-facgure-blue text-white">
          <div className="flex items-center gap-2">
            {renderSectionIcon()}
            <h2 className="text-lg font-medium">{renderSectionTitle()}</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10">
            <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">{renderContent()}</div>
      </div>
    </div>
  )
}
