"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { UserRole } from "@/lib/db"

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  company?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  loginWithGoogle: () => Promise<boolean>
  loginWithMicrosoft: () => Promise<boolean>
  logout: () => void
  forgotPassword: (email: string) => Promise<boolean>
  verifyOTP: (email: string, otp: string) => Promise<boolean>
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<boolean>
  canImportApps: boolean
  canDeleteApps: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, you would check with your backend
        // For now, we'll just check localStorage
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
        }
      } catch (error) {
        console.error("Authentication error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Determine permissions based on user role
  const canImportApps = user?.role === "admin"
  const canDeleteApps = user?.role === "admin"

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      console.log("Login attempt:", { email, timestamp: new Date().toISOString() })

      // Simplified login logic for demo purposes
      let mockUser: User | null = null

      // Check if we're on the Vercel deployment
      const isVercelDeployment = typeof window !== "undefined" && window.location.hostname.includes("vercel.app")
      console.log("Is Vercel deployment:", isVercelDeployment)

      // Check for admin credentials
      if (email === "admin@facgure.com" && password === "admin123") {
        mockUser = {
          id: "admin-1",
          name: "Admin User",
          email: "admin@facgure.com",
          role: "admin",
          avatar: "/avatars/avatar-1.png",
          company: "Facgure Technologies",
        }
      }
      // Check for user credentials
      else if (email === "user@facgure.com" && password === "user123") {
        mockUser = {
          id: "user-1",
          name: "อภิชาติ นิลมณีติ",
          email: "user@facgure.com",
          role: "user",
          avatar: "/diverse-group.png",
          company: "บริษัท โซลาร์เอเชีย.เท็ค จำกัด",
        }
      }
      // Allow any email/password for demo purposes
      else if (email && password && password.length >= 4) {
        // For demo purposes, allow any login with valid email format and password at least 4 chars
        if (email.includes("@")) {
          mockUser = {
            id: `user-${Date.now()}`,
            name: email.split("@")[0],
            email: email,
            role: "user",
            avatar: "/diverse-group.png",
            company: "Demo Company",
          }
        } else {
          console.log("Login failed: Invalid email format")
          return false
        }
      } else {
        console.log("Login failed: Invalid credentials")
        return false
      }

      if (mockUser) {
        console.log("Login successful, setting user:", mockUser.email)

        try {
          localStorage.setItem("user", JSON.stringify(mockUser))
          console.log("User data saved to localStorage")
        } catch (storageError) {
          console.error("Error saving to localStorage:", storageError)
        }

        setUser(mockUser)

        // Add a small delay to ensure localStorage is updated
        await new Promise((resolve) => setTimeout(resolve, 500))

        console.log("Login process completed successfully")
        return true
      }

      console.log("Login failed: No matching user")
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true)
    try {
      // In a real app, you would integrate with Google OAuth
      // For demo purposes, we'll simulate a successful login
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const mockUser: User = {
        id: "google-user-1",
        name: "อภิชาติ นิลมณีติ",
        email: "user@gmail.com",
        role: "user", // Default role for social login
        avatar: "/diverse-group.png",
        company: "บริษัท โซลาร์เอเชีย.เท็ค จำกัด",
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))

      // Add a small delay to ensure localStorage is updated
      await new Promise((resolve) => setTimeout(resolve, 500))

      return true
    } catch (error) {
      console.error("Google login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithMicrosoft = async (): Promise<boolean> => {
    setIsLoading(true)
    try {
      // In a real app, you would integrate with Microsoft OAuth
      // For demo purposes, we'll simulate a successful login
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const mockUser: User = {
        id: "microsoft-user-1",
        name: "อภิชาติ นิลมณีติ",
        email: "user@outlook.com",
        role: "user", // Default role for social login
        avatar: "/diverse-group.png",
        company: "บริษัท โซลาร์เอเชีย.เท็ค จำกัด",
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))

      // Add a small delay to ensure localStorage is updated
      await new Promise((resolve) => setTimeout(resolve, 500))

      return true
    } catch (error) {
      console.error("Microsoft login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("hasSeenWelcome") // Reset welcome message
    router.push("/login")
  }

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      // In a real app, you would send a request to your backend
      // to generate and send an OTP to the user's email
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, we'll simulate a successful OTP send
      localStorage.setItem("resetEmail", email)
      localStorage.setItem("resetOTP", "123456") // In a real app, this would be sent to the user's email

      return true
    } catch (error) {
      console.error("Forgot password error:", error)
      return false
    }
  }

  const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
    try {
      // In a real app, you would verify the OTP with your backend
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, we'll check against our stored OTP
      const storedEmail = localStorage.getItem("resetEmail")
      const storedOTP = localStorage.getItem("resetOTP")

      return email === storedEmail && otp === storedOTP
    } catch (error) {
      console.error("OTP verification error:", error)
      return false
    }
  }

  const resetPassword = async (email: string, otp: string, newPassword: string): Promise<boolean> => {
    try {
      // In a real app, you would send the new password to your backend
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, we'll check the OTP and simulate success
      const isOTPValid = await verifyOTP(email, otp)

      if (isOTPValid) {
        // Clear reset data
        localStorage.removeItem("resetEmail")
        localStorage.removeItem("resetOTP")
        return true
      }

      return false
    } catch (error) {
      console.error("Password reset error:", error)
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        loginWithMicrosoft,
        logout,
        forgotPassword,
        verifyOTP,
        resetPassword,
        canImportApps,
        canDeleteApps,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
