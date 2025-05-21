"use client"

import { useState, useEffect, useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPalette, faCheck } from "@fortawesome/free-solid-svg-icons"

interface ColorPaletteProps {
  currentColor: string
  onColorChange: (color: string) => void
  language: "en" | "th"
  t: (key: string) => string
}

export function ColorPalette({ currentColor, onColorChange, language, t }: ColorPaletteProps) {
  const [expanded, setExpanded] = useState(false)
  const [selectedColor, setSelectedColor] = useState(currentColor)
  const [isMobile, setIsMobile] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    // Initial check
    checkIfMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setExpanded(false)
      }
    }

    if (expanded) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [expanded])

  useEffect(() => {
    setSelectedColor(currentColor)
  }, [currentColor])

  // Beautiful color palette options with default Facgure blue at the beginning
  const colorOptions = [
    { name: "Facgure Blue (Default)", value: "#002b41", textColor: "white" },
    { name: "Midnight", value: "#131314", textColor: "white" },
    { name: "Ocean", value: "#0077b6", textColor: "white" },
    { name: "Emerald", value: "#2a9d8f", textColor: "white" },
    { name: "Ruby", value: "#e63946", textColor: "white" },
    { name: "Amethyst", value: "#7209b7", textColor: "white" },
    { name: "Amber", value: "#fb8500", textColor: "white" },
    { name: "Jade", value: "#40916c", textColor: "white" },
    { name: "Sapphire", value: "#1e40af", textColor: "white" },
    { name: "Coral", value: "#f94144", textColor: "white" },
    { name: "Lavender", value: "#7678ed", textColor: "white" },
    { name: "Teal", value: "#0096c7", textColor: "white" },
    { name: "Crimson", value: "#d00000", textColor: "white" },
    { name: "Forest", value: "#1b4332", textColor: "white" },
    { name: "Royal", value: "#5a189a", textColor: "white" },
    { name: "Sunset", value: "#ff6d00", textColor: "white" },
  ]

  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
    onColorChange(color)
    setExpanded(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-2"
      >
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faPalette} className="w-5 h-5 text-facgure-blue" />
          <span>{t("changeThemeColor")}</span>
        </div>
        <div
          className="ml-auto w-6 h-6 rounded-full border-2 border-white shadow-sm"
          style={{ backgroundColor: selectedColor }}
        ></div>
      </button>

      {expanded && (
        <div
          className={`absolute z-10 mt-2 p-4 bg-white rounded-lg shadow-xl border border-gray-200 ${
            isMobile ? "w-[calc(100vw-2rem)] left-1/2 -translate-x-1/2" : "w-72 right-0"
          } animate-in fade-in zoom-in-95 duration-200`}
        >
          <div className="mb-3">
            <h3 className="font-medium text-sm mb-2">{language === "en" ? "Select a theme color" : "เลือกสีธีม"}</h3>
            <p className="text-xs text-gray-500">
              {language === "en" ? "Choose a color for the navigation bar" : "เลือกสีสำหรับแถบนำทาง"}
            </p>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                className="relative group"
                onClick={() => handleColorSelect(color.value)}
                title={color.name}
              >
                <div
                  className={`aspect-square rounded-md transition-all duration-200 ${
                    selectedColor === color.value
                      ? "ring-2 ring-offset-2 ring-facgure-blue scale-110"
                      : "hover:scale-110 hover:shadow-md"
                  }`}
                  style={{ backgroundColor: color.value }}
                >
                  {selectedColor === color.value && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FontAwesomeIcon className={`w-4 h-4 text-${color.textColor}`} icon={faCheck} />
                    </div>
                  )}
                </div>
                <span className="absolute opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs rounded py-1 px-2 -bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-200 whitespace-nowrap z-10">
                  {color.name}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex justify-between">
              <button onClick={() => setExpanded(false)} className="text-xs text-gray-500 hover:text-gray-700">
                {t("cancel")}
              </button>
              <button
                onClick={() => handleColorSelect(selectedColor)}
                className="text-xs text-facgure-blue font-medium hover:text-opacity-80"
              >
                {t("apply")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
