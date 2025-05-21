"use client"

import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown, faFlag } from "@fortawesome/free-solid-svg-icons"
import { useLanguage } from "@/contexts/language-context"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleLanguageChange = (lang: "en" | "th") => {
    setLanguage(lang)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        className="flex items-center gap-1 p-1 rounded hover:bg-white/10"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <FontAwesomeIcon icon={faFlag} className="h-4 w-4 text-white" />
        <span className="text-xs font-medium text-white">{language === "en" ? "EN" : "TH"}</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`h-3 w-3 text-white transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 py-1 bg-white rounded-md shadow-md z-50 min-w-[120px] animate-in fade-in zoom-in-95 duration-100 border border-gray-200">
          <button
            className={`flex items-center gap-2 w-full px-3 py-2 text-left text-sm ${
              language === "en" ? "bg-gray-50" : "hover:bg-gray-50"
            }`}
            onClick={() => handleLanguageChange("en")}
          >
            <FontAwesomeIcon icon={faFlag} className="h-4 w-4 text-facgure-blue" />
            <span className="font-en text-gray-800">English</span>
          </button>
          <button
            className={`flex items-center gap-2 w-full px-3 py-2 text-left text-sm ${
              language === "th" ? "bg-gray-50" : "hover:bg-gray-50"
            }`}
            onClick={() => handleLanguageChange("th")}
          >
            <FontAwesomeIcon icon={faFlag} className="h-4 w-4 text-facgure-blue" />
            <span className="font-th text-gray-800">ไทย</span>
          </button>
        </div>
      )}
    </div>
  )
}
