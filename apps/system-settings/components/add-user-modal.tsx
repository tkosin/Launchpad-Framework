"use client"

import type React from "react"

import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faXmark,
  faUser,
  faEnvelope,
  faBuilding,
  faLock,
  faEye,
  faEyeSlash,
  faCheck,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons"
import type { AppType } from "@/types/app"

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
  onAddUser: (user: any) => void
  availableApps: AppType[]
  language: "en" | "th"
}

export function AddUserModal({ isOpen, onClose, onAddUser, availableApps, language }: AddUserModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<"user" | "admin">("user")
  const [showPassword, setShowPassword] = useState(false)
  const [selectedApps, setSelectedApps] = useState<number[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when modal is opened
  useState(() => {
    if (isOpen) {
      resetForm()
    }
  })

  const resetForm = () => {
    setName("")
    setEmail("")
    setCompany("")
    setPassword("")
    setConfirmPassword("")
    setRole("user")
    setSelectedApps([])
    setErrors({})
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = language === "en" ? "Name is required" : "จำเป็นต้องระบุชื่อ"
    }

    if (!email.trim()) {
      newErrors.email = language === "en" ? "Email is required" : "จำเป็นต้องระบุอีเมล"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = language === "en" ? "Email is invalid" : "อีเมลไม่ถูกต้อง"
    }

    if (!company.trim()) {
      newErrors.company = language === "en" ? "Company is required" : "จำเป็นต้องระบุบริษัท"
    }

    if (!password) {
      newErrors.password = language === "en" ? "Password is required" : "จำเป็นต้องระบุรหัสผ่าน"
    } else if (password.length < 6) {
      newErrors.password = language === "en" ? "Password must be at least 6 characters" : "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = language === "en" ? "Passwords do not match" : "รหัสผ่านไม่ตรงกัน"
    }

    if (selectedApps.length === 0) {
      newErrors.apps = language === "en" ? "Select at least one app" : "เลือกแอปอย่างน้อยหนึ่งรายการ"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // Create new user object
      const newUser = {
        name,
        email,
        company,
        password, // In a real app, this would be hashed
        role,
        appAccess: selectedApps,
        avatar: "/avatars/avatar-3.png", // Default avatar
      }

      onAddUser(newUser)
      onClose()
      resetForm()
    }
  }

  const toggleAppSelection = (appId: number) => {
    setSelectedApps((prev) => (prev.includes(appId) ? prev.filter((id) => id !== appId) : [...prev, appId]))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-auto animate-in fade-in zoom-in-95">
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-white">
          <h2 className="text-lg font-medium">{language === "en" ? "Add New User" : "เพิ่มผู้ใช้ใหม่"}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700 mb-2">{language === "en" ? "User Information" : "ข้อมูลผู้ใช้"}</h3>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  {language === "en" ? "Full Name" : "ชื่อเต็ม"} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-facgure-blue focus:border-transparent`}
                    placeholder={language === "en" ? "Enter full name" : "ป้อนชื่อเต็ม"}
                  />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {language === "en" ? "Email Address" : "ที่อยู่อีเมล"} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-facgure-blue focus:border-transparent`}
                    placeholder={language === "en" ? "Enter email address" : "ป้อนที่อยู่อีเมล"}
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Company */}
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  {language === "en" ? "Company" : "บริษัท"} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faBuilding} className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border ${
                      errors.company ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-facgure-blue focus:border-transparent`}
                    placeholder={language === "en" ? "Enter company name" : "ป้อนชื่อบริษัท"}
                  />
                </div>
                {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company}</p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  {language === "en" ? "Password" : "รหัสผ่าน"} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-10 pr-10 py-2 border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-facgure-blue focus:border-transparent`}
                    placeholder={language === "en" ? "Enter password" : "ป้อนรหัสผ่าน"}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  {language === "en" ? "Confirm Password" : "ยืนยันรหัสผ่าน"} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border ${
                      errors.confirmPassword ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-facgure-blue focus:border-transparent`}
                    placeholder={language === "en" ? "Confirm password" : "ยืนยันรหัสผ่าน"}
                  />
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === "en" ? "User Role" : "บทบาทผู้ใช้"} *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      checked={role === "user"}
                      onChange={() => setRole("user")}
                      className="h-4 w-4 text-facgure-blue focus:ring-facgure-blue border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">{language === "en" ? "Regular User" : "ผู้ใช้ทั่วไป"}</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      checked={role === "admin"}
                      onChange={() => setRole("admin")}
                      className="h-4 w-4 text-facgure-blue focus:ring-facgure-blue border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {language === "en" ? "Administrator" : "ผู้ดูแลระบบ"}
                    </span>
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {role === "admin"
                    ? language === "en"
                      ? "Administrators have full access to all features including user management."
                      : "ผู้ดูแลระบบมีสิทธิ์เข้าถึงคุณสมบัติทั้งหมดรวมถึงการจัดการผู้ใช้"
                    : language === "en"
                      ? "Regular users have limited access based on assigned applications."
                      : "ผู้ใช้ทั่วไปมีสิทธิ์เข้าถึงจำกัดตามแอปพลิเคชันที่กำหนด"}
                </p>
              </div>
            </div>

            {/* App Access */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-700">
                  {language === "en" ? "Application Access" : "การเข้าถึงแอปพลิเคชัน"} *
                </h3>
                <div className="text-xs text-gray-500">
                  {selectedApps.length} {language === "en" ? "selected" : "ที่เลือก"}
                </div>
              </div>

              {errors.apps && <p className="mb-2 text-sm text-red-600">{errors.apps}</p>}

              <div className="border border-gray-200 rounded-md h-[400px] overflow-y-auto p-2">
                {role === "admin" && (
                  <div className="bg-purple-50 p-3 rounded-md mb-3 flex items-start gap-2">
                    <FontAwesomeIcon icon={faShieldAlt} className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-purple-800 font-medium">
                        {language === "en" ? "Administrator Access" : "สิทธิ์ผู้ดูแลระบบ"}
                      </p>
                      <p className="text-xs text-purple-700">
                        {language === "en"
                          ? "Administrators automatically have access to all applications."
                          : "ผู้ดูแลระบบมีสิทธิ์เข้าถึงแอปพลิเคชันทั้งหมดโดยอัตโนมัติ"}
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-2">
                  {availableApps.map((app) => (
                    <div
                      key={app.id}
                      className={`p-3 border rounded-md flex items-center gap-3 ${
                        selectedApps.includes(app.id) || role === "admin"
                          ? "border-facgure-blue bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: app.color }}
                      >
                        <FontAwesomeIcon icon={app.icon} className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900">{app.name}</h4>
                        <p className="text-xs text-gray-500 truncate">{app.description}</p>
                      </div>
                      <div className="flex-shrink-0">
                        {role === "admin" ? (
                          <div className="h-5 w-5 rounded-full bg-facgure-blue flex items-center justify-center">
                            <FontAwesomeIcon icon={faCheck} className="h-3 w-3 text-white" />
                          </div>
                        ) : (
                          <input
                            type="checkbox"
                            checked={selectedApps.includes(app.id)}
                            onChange={() => toggleAppSelection(app.id)}
                            className="h-5 w-5 text-facgure-blue focus:ring-facgure-blue border-gray-300 rounded"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {language === "en" ? "Cancel" : "ยกเลิก"}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-facgure-blue text-white rounded-md hover:bg-opacity-90 transition-colors"
            >
              {language === "en" ? "Add User" : "เพิ่มผู้ใช้"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
