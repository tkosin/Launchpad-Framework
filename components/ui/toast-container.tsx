"use client"

import { Toast, type ToastProps } from "./toast" // Correctly imports the Toast component

interface ToastContainerProps {
  toasts: ToastProps[]
}

export function ToastContainer({ toasts }: ToastContainerProps) {
  if (!toasts || toasts.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 w-80">
      {toasts.map((toast) => (
        // Each 'toast' object already contains the 'onClose' handler
        // (which is 'removeToast' from the context) as part of its props.
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  )
}
