"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { ToastContainer } from "@/components/ui/toast-container"
import type { ToastProps, ToastType } from "@/components/ui/toast"

interface ToastContextType {
  showToast: (type: ToastType, title: string, message?: string, duration?: number) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (type: ToastType, title: string, message?: string, duration = 5000) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const newToast: ToastProps = {
        id,
        type,
        title,
        message,
        duration,
        onClose: removeToast,
      }
      setToasts((prevToasts) => [...prevToasts, newToast])
    },
    [removeToast],
  )

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
