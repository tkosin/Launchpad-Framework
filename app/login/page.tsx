"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGoogle, faMicrosoft } from "@fortawesome/free-brands-svg-icons"
import { faEye, faEyeSlash, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ForgotPasswordModal } from "@/components/forgot-password-modal"
import { DemoAccountModal } from "@/components/demo-account-modal"
import { LogoImage } from "@/components/logo-image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [error, setError] = useState("")
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showDemoAccounts, setShowDemoAccounts] = useState(false)
  const { login, loginWithGoogle, loginWithMicrosoft, isAuthenticated } = useAuth()
  const { t, language } = useLanguage()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoggingIn(true)

    try {
      const success = await login(email, password)
      if (success) {
        router.push("/")
      } else {
        setError(language === "en" ? "Invalid email or password" : "อีเมลหรือรหัสผ่านไม่ถูกต้อง")
      }
    } catch (err) {
      setError(language === "en" ? "An error occurred. Please try again." : "เกิดข้อผิดพลาด โปรดลองอีกครั้ง")
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError("")
    setIsLoggingIn(true)

    try {
      const success = await loginWithGoogle()
      if (success) {
        router.push("/")
      } else {
        setError(language === "en" ? "Google login failed" : "การเข้าสู่ระบบด้วย Google ล้มเหลว")
      }
    } catch (err) {
      setError(language === "en" ? "An error occurred. Please try again." : "เกิดข้อผิดพลาด โปรดลองอีกครั้ง")
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleMicrosoftLogin = async () => {
    setError("")
    setIsLoggingIn(true)

    try {
      const success = await loginWithMicrosoft()
      if (success) {
        router.push("/")
      } else {
        setError(language === "en" ? "Microsoft login failed" : "การเข้าสู่ระบบด้วย Microsoft ล้มเหลว")
      }
    } catch (err) {
      setError(language === "en" ? "An error occurred. Please try again." : "เกิดข้อผิดพลาด โปรดลองอีกครั้ง")
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleDemoAccountSelect = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setShowDemoAccounts(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-facgure-blue text-white py-2 px-4 flex justify-between items-center">
        <div className="h-10 w-40 relative">
          <LogoImage src="/facgure-logo-light.png" alt="Facgure Logo" fill />
        </div>
        <LanguageSwitcher />
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {language === "en" ? "Welcome to Facgure" : "ยินดีต้อนรับสู่ Facgure"}
              </h1>
              <p className="text-gray-600">
                {language === "en"
                  ? "Sign in to access your procurement portal"
                  : "เข้าสู่ระบบเพื่อเข้าถึงพอร์ทัลการจัดซื้อจัดจ้างของคุณ"}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {language === "en" ? "Email Address" : "ที่อยู่อีเมล"}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-facgure-blue focus:border-transparent"
                  placeholder={language === "en" ? "Enter your email" : "ป้อนอีเมลของคุณ"}
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    {language === "en" ? "Password" : "รหัสผ่าน"}
                  </label>
                  <button
                    type="button"
                    className="text-sm text-facgure-blue hover:text-opacity-80"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    {language === "en" ? "Forgot password?" : "ลืมรหัสผ่าน?"}
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-facgure-blue focus:border-transparent"
                    placeholder={language === "en" ? "Enter your password" : "ป้อนรหัสผ่านของคุณ"}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-facgure-blue text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-facgure-blue focus:ring-offset-2 transition-colors disabled:opacity-50"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin h-5 w-5 mx-auto" />
                ) : language === "en" ? (
                  "Sign In"
                ) : (
                  "เข้าสู่ระบบ"
                )}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    {language === "en" ? "Or continue with" : "หรือดำเนินการต่อด้วย"}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-facgure-blue"
                  disabled={isLoggingIn}
                >
                  <FontAwesomeIcon icon={faGoogle} className="h-5 w-5 text-red-500 mr-2" />
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={handleMicrosoftLogin}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-facgure-blue"
                  disabled={isLoggingIn}
                >
                  <FontAwesomeIcon icon={faMicrosoft} className="h-5 w-5 text-blue-500 mr-2" />
                  <span>Microsoft</span>
                </button>
              </div>
            </div>

            {/* Demo Account Link */}
            <div className="mt-6 text-center">
              <button onClick={() => setShowDemoAccounts(true)} className="text-sm text-facgure-blue hover:underline">
                {language === "en" ? "Try a demo account" : "ทดลองใช้บัญชีสาธิต"}
              </button>
            </div>
          </div>

          <p className="mt-4 text-center text-sm text-gray-600">
            {language === "en" ? "Don't have an account? " : "ไม่มีบัญชี? "}
            <a href="#" className="font-medium text-facgure-blue hover:text-opacity-80">
              {language === "en" ? "Contact your administrator" : "ติดต่อผู้ดูแลระบบของคุณ"}
            </a>
          </p>
        </div>
      </main>

      <footer className="py-4 px-6 text-center text-sm text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} Facgure. {language === "en" ? "All rights reserved." : "สงวนลิขสิทธิ์"}
        </p>
      </footer>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        language={language}
      />

      <DemoAccountModal
        isOpen={showDemoAccounts}
        onClose={() => setShowDemoAccounts(false)}
        language={language}
        onSelectAccount={handleDemoAccountSelect}
      />
    </div>
  )
}
