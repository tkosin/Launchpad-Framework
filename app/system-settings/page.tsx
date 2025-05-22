"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import SystemSettingsApp from "@/apps/system-settings/index"
import { ChatbotWidget } from "@/components/chatbot-widget"

export default function SystemSettingsPage() {
  const { user } = useAuth()
  const router = useRouter()

  // Check if user is admin, if not redirect to dashboard
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/")
    }
  }, [user, router])

  // If no user or loading, show nothing
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 chatbot-adjustable-content transition-all duration-300">
        <div className="mb-4">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-facgure-blue hover:underline flex items-center gap-1"
          >
            ← {user.language === "en" ? "Back to Dashboard" : "กลับไปยังแดชบอร์ด"}
          </button>
        </div>

        <div className="h-[calc(100vh-150px)]">
          <SystemSettingsApp />
        </div>
      </main>

      {/* Add the ChatbotWidget */}
      <ChatbotWidget />
    </div>
  )
}
