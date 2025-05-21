"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"

type Language = "en" | "th"

type TranslationsType = {
  [key: string]: {
    en: string
    th: string
  }
}

// Add translations for all text in the application with a more professional tone
const translations: TranslationsType = {
  applications: {
    en: "Applications",
    th: "แอปพลิเคชัน",
  },
  importApps: {
    en: "Import Applications",
    th: "นำเข้าแอปพลิเคชัน",
  },
  yourWork: {
    en: "Your Tasks",
    th: "งานของคุณ",
  },
  noCurrentTasks: {
    en: "No pending tasks at this time",
    th: "ไม่มีงานที่รอดำเนินการในขณะนี้",
  },
  congratulations: {
    en: "Registration Successful",
    th: "ลงทะเบียนสำเร็จ",
  },
  verificationComplete: {
    en: "Your account has been verified and activated",
    th: "บัญชีของคุณได้รับการยืนยันและเปิดใช้งานแล้ว",
  },
  systemHelp: {
    en: "Help Center",
    th: "ศูนย์ช่วยเหลือ",
  },
  notifications: {
    en: "Notifications",
    th: "การแจ้งเตือน",
  },
  userProfile: {
    en: "User Profile",
    th: "โปรไฟล์ผู้ใช้",
  },
  appStore: {
    en: "Application Directory",
    th: "ไดเรกทอรีแอปพลิเคชัน",
  },
  allNotifications: {
    en: "All Notifications",
    th: "การแจ้งเตือนทั้งหมด",
  },
  clearAll: {
    en: "Clear All",
    th: "ล้างทั้งหมด",
  },
  noNotifications: {
    en: "No Notifications",
    th: "ไม่พบการแจ้งเตือน",
  },
  allCaughtUp: {
    en: "You're up to date",
    th: "คุณได้รับข้อมูลล่าสุดแล้ว",
  },
  changeAvatar: {
    en: "Change Profile Picture",
    th: "เปลี่ยนรูปโปรไฟล์",
  },
  changeThemeColor: {
    en: "Customize Interface Color",
    th: "ปรับแต่งสีอินเทอร์เฟซ",
  },
  accountSettings: {
    en: "Account Settings",
    th: "การตั้งค่าบัญชี",
  },
  logout: {
    en: "Sign Out",
    th: "ออกจากระบบ",
  },
  searchApps: {
    en: "Search applications...",
    th: "ค้นหาแอปพลิเคชัน...",
  },
  noAppsFound: {
    en: "No applications found",
    th: "ไม่พบแอปพลิเคชัน",
  },
  tryDifferentSearch: {
    en: "Try different search criteria or category",
    th: "ลองใช้เกณฑ์การค้นหาหรือหมวดหมู่อื่น",
  },
  installed: {
    en: "Installed",
    th: "ติดตั้งแล้ว",
  },
  install: {
    en: "Install",
    th: "ติดตั้ง",
  },
  cancel: {
    en: "Cancel",
    th: "ยกเลิก",
  },
  apply: {
    en: "Apply",
    th: "นำไปใช้",
  },
  all: {
    en: "All",
    th: "ทั้งหมด",
  },
  utilities: {
    en: "Utilities",
    th: "ยูทิลิตี้",
  },
  finance: {
    en: "Finance",
    th: "การเงิน",
  },
  productivity: {
    en: "Productivity",
    th: "ประสิทธิภาพ",
  },
  communication: {
    en: "Communication",
    th: "การสื่อสาร",
  },
  // Add more translations as needed
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Initialize with browser language or default to English
  const [language, setLanguage] = useState<Language>("en")

  // Load saved language preference from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "th")) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("language", language)

    // Set the appropriate font class on the document body
    document.documentElement.classList.remove("font-en", "font-th")
    document.documentElement.classList.add(language === "en" ? "font-en" : "font-th")
  }, [language])

  // Translate function
  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key "${key}" not found.`)
      return key
    }
    return translations[key][language]
  }

  const value = {
    language,
    setLanguage,
    t,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
