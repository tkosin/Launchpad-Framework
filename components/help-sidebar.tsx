"use client"

import { useEffect, useState } from "react"
import { X, Loader2 } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface HelpSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function HelpSidebar({ isOpen, onClose }: HelpSidebarProps) {
  const [helpContent, setHelpContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchHelpContent()
    }
  }, [isOpen])

  const fetchHelpContent = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Use mock data instead of fetching from GitHub
      const mockHelpContent = `
# NNW System Help

## Getting Started

Welcome to the NNW Procurement System. This guide will help you navigate and use the system effectively.

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

Contact support at support@nnw.example.com or call +66 2 123 4567.
    `

      setHelpContent(mockHelpContent)
    } catch (err) {
      console.error("Error loading help content:", err)
      setError("Failed to load help content. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />

      {/* Sidebar */}
      <div className="fixed right-0 h-full w-80 md:w-96 bg-white shadow-xl flex flex-col animate-in slide-in-from-right">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">System Help</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="h-8 w-8 text-[#009ec9] animate-spin mb-2" />
              <p className="text-gray-500">Loading help content...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-red-500 mb-2">{error}</p>
              <button
                onClick={fetchHelpContent}
                className="px-4 py-2 bg-[#009ec9] text-white rounded-md hover:bg-[#008ab0] transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{helpContent}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
