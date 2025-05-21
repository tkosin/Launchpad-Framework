"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faXmark, faInfoCircle, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons"
import { useState, useEffect } from "react"

export type ToastType = "success" | "error" | "info" | "warning"

export interface ToastProps {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
}

export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const startTime = Date.now()
    const endTime = startTime + duration

    const timer = setInterval(() => {
      const now = Date.now()
      const remaining = endTime - now
      const newProgress = (remaining / duration) * 100

      if (remaining <= 0) {
        clearInterval(timer)
        setIsVisible(false)
        setTimeout(() => onClose(id), 300) // Allow time for exit animation
      } else {
        setProgress(newProgress)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [id, duration, onClose])

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return {
          icon: faCheck,
          bgColor: "bg-green-600",
          borderColor: "border-green-600",
          textColor: "text-green-700",
          progressColor: "bg-green-600",
        }
      case "error":
        return {
          icon: faXmark,
          bgColor: "bg-red-500",
          borderColor: "border-red-600",
          textColor: "text-red-700",
          progressColor: "bg-red-600",
        }
      case "warning":
        return {
          icon: faExclamationTriangle,
          bgColor: "bg-amber-500",
          borderColor: "border-amber-600",
          textColor: "text-amber-700",
          progressColor: "bg-amber-600",
        }
      case "info":
      default:
        return {
          icon: faInfoCircle,
          bgColor: "bg-facgure-blue",
          borderColor: "border-facgure-blue",
          textColor: "text-facgure-blue",
          progressColor: "bg-facgure-blue",
        }
    }
  }

  const styles = getToastStyles()

  return (
    <div
      className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto border-l-4 ${styles.borderColor} overflow-hidden transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <div className="p-4 relative">
        <div className="flex items-start">
          <div className={`flex-shrink-0 ${styles.bgColor} rounded-full p-1`}>
            <FontAwesomeIcon icon={styles.icon} className="h-3 w-3 text-white" />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900">{title}</p>
            {message && <p className="mt-1 text-sm text-gray-500">{message}</p>}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={() => {
                setIsVisible(false)
                setTimeout(() => onClose(id), 300)
              }}
            >
              <span className="sr-only">Close</span>
              <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full bg-gray-200 absolute bottom-0 left-0">
          <div
            className={`h-full ${styles.progressColor} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
