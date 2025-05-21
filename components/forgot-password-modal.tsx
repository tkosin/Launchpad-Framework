"use client"

import type React from "react"

import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark, faSpinner, faEnvelope, faKey, faCheck } from "@fortawesome/free-solid-svg-icons"
import { useAuth } from "@/contexts/auth-context"

interface ForgotPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  language: "en" | "th"
}

type Step = "email" | "otp" | "reset" | "success"

export function ForgotPasswordModal({ isOpen, onClose, language }: ForgotPasswordModalProps) {
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { forgotPassword, verifyOTP, resetPassword } = useAuth()

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await forgotPassword(email)
      if (success) {
        setStep("otp")
      } else {
        setError(language === "en" ? "Failed to send OTP. Please try again." : "ไม่สามารถส่ง OTP โปรดลองอีกครั้ง")
      }
    } catch (err) {
      setError(language === "en" ? "An error occurred. Please try again." : "เกิดข้อผิดพลาด โปรดลองอีกครั้ง")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await verifyOTP(email, otp)
      if (success) {
        setStep("reset")
      } else {
        setError(language === "en" ? "Invalid OTP. Please try again." : "OTP ไม่ถูกต้อง โปรดลองอีกครั้ง")
      }
    } catch (err) {
      setError(language === "en" ? "An error occurred. Please try again." : "เกิดข้อผิดพลาด โปรดลองอีกครั้ง")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (newPassword !== confirmPassword) {
      setError(language === "en" ? "Passwords do not match." : "รหัสผ่านไม่ตรงกัน")
      return
    }

    if (newPassword.length < 8) {
      setError(language === "en" ? "Password must be at least 8 characters long." : "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร")
      return
    }

    setIsLoading(true)

    try {
      const success = await resetPassword(email, otp, newPassword)
      if (success) {
        setStep("success")
      } else {
        setError(language === "en" ? "Failed to reset password. Please try again." : "ไม่สามารถรีเซ็ตรหัสผ่าน โปรดลองอีกครั้ง")
      }
    } catch (err) {
      setError(language === "en" ? "An error occurred. Please try again." : "เกิดข้อผิดพลาด โปรดลองอีกครั้ง")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setStep("email")
    setEmail("")
    setOtp("")
    setNewPassword("")
    setConfirmPassword("")
    setError("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">
            {step === "email" && (language === "en" ? "Forgot Password" : "ลืมรหัสผ่าน")}
            {step === "otp" && (language === "en" ? "Enter OTP" : "ป้อนรหัส OTP")}
            {step === "reset" && (language === "en" ? "Reset Password" : "รีเซ็ตรหัสผ่าน")}
            {step === "success" && (language === "en" ? "Password Reset" : "รีเซ็ตรหัสผ่านแล้ว")}
          </h2>
          <button onClick={handleClose} className="p-1 rounded-full hover:bg-gray-100">
            <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
              <p>{error}</p>
            </div>
          )}

          {step === "email" && (
            <form onSubmit={handleRequestOTP} className="space-y-4">
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-1">
                  {language === "en" ? "Email Address" : "ที่อยู่อีเมล"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-facgure-blue focus:border-transparent"
                    placeholder={language === "en" ? "Enter your email" : "ป้อนอีเมลของคุณ"}
                    required
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {language === "en"
                    ? "We'll send a one-time password to your email."
                    : "เราจะส่งรหัสผ่านแบบใช้ครั้งเดียวไปยังอีเมลของคุณ"}
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="py-2 px-4 bg-facgure-blue text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-facgure-blue focus:ring-offset-2 transition-colors disabled:opacity-50 flex items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin h-5 w-5 mr-2" />
                  ) : (
                    <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 mr-2" />
                  )}
                  {language === "en" ? "Send OTP" : "ส่ง OTP"}
                </button>
              </div>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  {language === "en" ? "One-Time Password" : "รหัสผ่านแบบใช้ครั้งเดียว"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faKey} className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-facgure-blue focus:border-transparent"
                    placeholder={language === "en" ? "Enter OTP" : "ป้อนรหัส OTP"}
                    required
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {language === "en" ? `We've sent an OTP to ${email}` : `เราได้ส่ง OTP ไปยัง ${email} แล้ว`}
                </p>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-facgure-blue focus:ring-offset-2 transition-colors"
                >
                  {language === "en" ? "Back" : "ย้อนกลับ"}
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-facgure-blue text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-facgure-blue focus:ring-offset-2 transition-colors disabled:opacity-50 flex items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin h-5 w-5 mr-2" />
                  ) : (
                    <FontAwesomeIcon icon={faKey} className="h-5 w-5 mr-2" />
                  )}
                  {language === "en" ? "Verify OTP" : "ยืนยัน OTP"}
                </button>
              </div>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                  {language === "en" ? "New Password" : "รหัสผ่านใหม่"}
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-facgure-blue focus:border-transparent"
                  placeholder={language === "en" ? "Enter new password" : "ป้อนรหัสผ่านใหม่"}
                  required
                  minLength={8}
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                  {language === "en" ? "Confirm Password" : "ยืนยันรหัสผ่าน"}
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-facgure-blue focus:border-transparent"
                  placeholder={language === "en" ? "Confirm new password" : "ยืนยันรหัสผ่านใหม่"}
                  required
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep("otp")}
                  className="py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-facgure-blue focus:ring-offset-2 transition-colors"
                >
                  {language === "en" ? "Back" : "ย้อนกลับ"}
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-facgure-blue text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-facgure-blue focus:ring-offset-2 transition-colors disabled:opacity-50 flex items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin h-5 w-5 mr-2" />
                  ) : (
                    <FontAwesomeIcon icon={faKey} className="h-5 w-5 mr-2" />
                  )}
                  {language === "en" ? "Reset Password" : "รีเซ็ตรหัสผ่าน"}
                </button>
              </div>
            </form>
          )}

          {step === "success" && (
            <div className="text-center py-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <FontAwesomeIcon icon={faCheck} className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {language === "en" ? "Password Reset Successfully" : "รีเซ็ตรหัสผ่านสำเร็จแล้ว"}
              </h3>
              <p className="text-gray-500 mb-4">
                {language === "en"
                  ? "Your password has been reset successfully. You can now log in with your new password."
                  : "รหัสผ่านของคุณถูกรีเซ็ตเรียบร้อยแล้ว คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้แล้ว"}
              </p>
              <button
                onClick={handleClose}
                className="py-2 px-4 bg-facgure-blue text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-facgure-blue focus:ring-offset-2 transition-colors"
              >
                {language === "en" ? "Back to Login" : "กลับไปยังหน้าเข้าสู่ระบบ"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
