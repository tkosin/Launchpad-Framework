"use client"

import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCheckCircle,
  faExclamationTriangle,
  faInfoCircle,
  faTimesCircle,
  faXmark,
} from "@fortawesome/free-solid-svg-icons"

export type ToastType = "success" | "error" | "warning" | "info"

export interface ToastProps {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
}

const toastIcons = {
  success: faCheckCircle,
  error: faTimesCircle,
  warning: faExclamationTriangle,
  info: faInfoCircle,
}

const toastColors = {
  success: "border-green-500 bg-green-50 text-green-800",
  error: "border-red-500 bg-red-50 text-red-800",
  warning: "border-yellow-500 bg-yellow-50 text-yellow-800",
  info: "border-blue-500 bg-blue-50 text-blue-800",
}

const iconColors = {
  success: "text-green-500",
  error: "text-red-500",
  warning: "text-yellow-500",
  info: "text-blue-500",
}

export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose(id)
    }, 300) // Animation duration
  }

  if (!isVisible) return null

  return (
    <div
      className={`
        relative p-4 rounded-lg border-l-4 shadow-lg transition-all duration-300 ease-in-out
        ${toastColors[type]}
        ${isExiting ? "opacity-0 transform translate-x-full" : "opacity-100 transform translate-x-0"}
      `}
    >
      <div className="flex items-start gap-3">
        <FontAwesomeIcon icon={toastIcons[type]} className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColors[type]}`} />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">{title}</p>
          {message && <p className="text-sm mt-1 opacity-90">{message}</p>}
        </div>
        <button onClick={handleClose} className="flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors">
          <FontAwesomeIcon icon={faXmark} className="w-4 h-4 opacity-60" />
        </button>
      </div>
    </div>
  )
}
