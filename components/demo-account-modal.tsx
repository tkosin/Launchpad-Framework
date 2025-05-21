"use client"

import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark, faUser, faUserShield, faCopy, faCheck } from "@fortawesome/free-solid-svg-icons"

interface DemoAccountModalProps {
  isOpen: boolean
  onClose: () => void
  language: "en" | "th"
  onSelectAccount: (email: string, password: string) => void
}

export function DemoAccountModal({ isOpen, onClose, language, onSelectAccount }: DemoAccountModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  if (!isOpen) return null

  const demoAccounts = [
    {
      type: "admin",
      title: language === "en" ? "Administrator Account" : "บัญชีผู้ดูแลระบบ",
      description:
        language === "en"
          ? "Full access to all features including importing and deleting applications"
          : "เข้าถึงคุณสมบัติทั้งหมดรวมถึงการนำเข้าและลบแอปพลิเคชัน",
      email: "admin@facgure.com",
      password: "admin123",
      icon: faUserShield,
    },
    {
      type: "user",
      title: language === "en" ? "Regular User Account" : "บัญชีผู้ใช้ทั่วไป",
      description:
        language === "en"
          ? "Limited access - cannot import or delete applications"
          : "การเข้าถึงที่จำกัด - ไม่สามารถนำเข้าหรือลบแอปพลิเคชัน",
      email: "user@facgure.com",
      password: "user123",
      icon: faUser,
    },
  ]

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">{language === "en" ? "Demo Accounts" : "บัญชีสาธิต"}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-500 mb-4">
            {language === "en"
              ? "Choose a demo account to explore the system with different permission levels."
              : "เลือกบัญชีสาธิตเพื่อสำรวจระบบด้วยระดับสิทธิ์ที่แตกต่างกัน"}
          </p>

          <div className="space-y-4">
            {demoAccounts.map((account) => (
              <div key={account.type} className="border rounded-lg p-4 hover:border-facgure-blue transition-colors">
                <div className="flex items-start gap-3">
                  <div className="bg-facgure-blue rounded-full p-2 text-white">
                    <FontAwesomeIcon icon={account.icon} className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{account.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{account.description}</p>

                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between bg-gray-50 rounded p-2">
                        <div className="text-sm">
                          <span className="text-gray-500">{language === "en" ? "Email:" : "อีเมล:"}</span>{" "}
                          <span className="font-medium">{account.email}</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(account.email, `${account.type}-email`)}
                          className="text-gray-400 hover:text-gray-600 p-1"
                          title={language === "en" ? "Copy email" : "คัดลอกอีเมล"}
                        >
                          <FontAwesomeIcon
                            icon={copiedField === `${account.type}-email` ? faCheck : faCopy}
                            className="h-4 w-4"
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between bg-gray-50 rounded p-2">
                        <div className="text-sm">
                          <span className="text-gray-500">{language === "en" ? "Password:" : "รหัสผ่าน:"}</span>{" "}
                          <span className="font-medium">{account.password}</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(account.password, `${account.type}-password`)}
                          className="text-gray-400 hover:text-gray-600 p-1"
                          title={language === "en" ? "Copy password" : "คัดลอกรหัสผ่าน"}
                        >
                          <FontAwesomeIcon
                            icon={copiedField === `${account.type}-password` ? faCheck : faCopy}
                            className="h-4 w-4"
                          />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectAccount(account.email, account.password)}
                      className="mt-3 w-full py-2 bg-facgure-blue text-white rounded-md hover:bg-opacity-90 transition-colors"
                    >
                      {language === "en" ? "Login with this account" : "เข้าสู่ระบบด้วยบัญชีนี้"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
