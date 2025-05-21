"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"

interface AppIconProps {
  id: number
  name: string
  icon: IconDefinition
  color: string
  onDelete: (id: number) => void
  notificationCount?: number
}

export function AppIcon({ id, name, icon, color, onDelete, notificationCount = 0 }: AppIconProps) {
  const [isLongPressing, setIsLongPressing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const deleteTimer = useRef<NodeJS.Timeout | null>(null)

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) clearTimeout(longPressTimer.current)
      if (deleteTimer.current) clearTimeout(deleteTimer.current)
    }
  }, [])

  const handleMouseDown = () => {
    longPressTimer.current = setTimeout(() => {
      setIsLongPressing(true)
    }, 500) // 500ms for long press
  }

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  const handleMouseLeave = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }

    // Only reset long press if we're not in delete mode
    if (!isDeleting) {
      setIsLongPressing(false)
    }
  }

  const handleTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
      setIsLongPressing(true)
    }, 500)
  }

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDeleting(true)

    // Animate deletion
    deleteTimer.current = setTimeout(() => {
      onDelete(id)
    }, 300) // Match this with CSS animation duration
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative ${isDeleting ? "scale-0 opacity-0 transition-all duration-300" : ""}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`bg-white w-16 h-16 rounded-md shadow-sm border border-gray-200 flex items-center justify-center mb-2 transition-all ${
            isLongPressing ? "scale-95 animate-pulse" : "hover:shadow-md"
          }`}
        >
          <div className="p-2 rounded-md" style={{ backgroundColor: color }}>
            <FontAwesomeIcon icon={icon} className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Notification badge */}
        {notificationCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-facgure-orange text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 font-medium shadow-sm">
            {notificationCount > 99 ? "99+" : notificationCount}
          </div>
        )}

        {/* Delete button that appears on long press */}
        {isLongPressing && (
          <button
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md animate-in zoom-in-95"
            onClick={handleDelete}
          >
            <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
          </button>
        )}
      </div>
      <span className="text-gray-700 font-medium text-center text-sm">{name}</span>
    </div>
  )
}
