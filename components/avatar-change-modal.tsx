"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark, faUpload, faCheck, faCrop } from "@fortawesome/free-solid-svg-icons"
import Image from "next/image"
import { ImageCropper } from "./image-cropper"

interface AvatarChangeModalProps {
  isOpen: boolean
  onClose: () => void
  onAvatarChange: (avatarUrl: string) => void
  currentAvatar: string
  language: "en" | "th"
  t: (key: string) => string
}

export function AvatarChangeModal({
  isOpen,
  onClose,
  onAvatarChange,
  currentAvatar,
  language,
  t,
}: AvatarChangeModalProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState<"people" | "dinosaurs">("people")
  const [isMobile, setIsMobile] = useState(false)
  const [cropMode, setCropMode] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  // Set current avatar as selected when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedAvatar(currentAvatar)
      setCropMode(false)
      setUploadedImage(null)
      setCroppedImage(null)
    }
  }, [isOpen, currentAvatar])

  // Predefined avatars - People
  const peopleAvatars = [
    "/avatars/avatar-1.png",
    "/avatars/avatar-2.png",
    "/avatars/avatar-3.png",
    "/avatars/avatar-4.png",
    "/avatars/avatar-5.png",
    "/avatars/avatar-6.png",
  ]

  // Predefined avatars - Dinosaurs
  const dinosaurAvatars = [
    "/avatars/dino-1.png",
    "/avatars/dino-2.png",
    "/avatars/dino-3.png",
    "/avatars/dino-4.png",
    "/avatars/dino-5.png",
    "/avatars/dino-6.png",
    "/avatars/dino-7.png",
    "/avatars/dino-8.png",
  ]

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar)
    setCroppedImage(null)
  }

  const handleSave = () => {
    if (croppedImage) {
      onAvatarChange(croppedImage)
      onClose()
    } else if (selectedAvatar) {
      onAvatarChange(selectedAvatar)
      onClose()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadedImage(event.target.result as string)
        setSelectedAvatar(null)
        setCropMode(true)
        setIsUploading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleCropComplete = (croppedImageUrl: string) => {
    setCroppedImage(croppedImageUrl)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleCropCancel = () => {
    setCropMode(false)
    setUploadedImage(null)
    setCroppedImage(null)
    setSelectedAvatar(currentAvatar)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div
        className={`relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-auto animate-in fade-in zoom-in-95 ${
          language === "en" ? "font-en" : "font-th"
        }`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-white">
          <h2 className="text-lg font-medium">
            {cropMode ? (language === "en" ? "Adjust Your Avatar" : "ปรับแต่งอวาตาร์ของคุณ") : t("changeAvatar")}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          {cropMode && uploadedImage ? (
            <div className="flex flex-col items-center">
              <ImageCropper
                imageSrc={uploadedImage}
                onCropComplete={handleCropComplete}
                aspectRatio={1}
                language={language}
              />
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src={croppedImage || selectedAvatar || currentAvatar}
                    alt="Current avatar"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="mb-6">
                <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
                  <button
                    className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                      activeTab === "people"
                        ? "text-facgure-blue border-b-2 border-facgure-blue"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("people")}
                  >
                    {language === "en" ? "People" : "บุคคล"}
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                      activeTab === "dinosaurs"
                        ? "text-facgure-blue border-b-2 border-facgure-blue"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("dinosaurs")}
                  >
                    {language === "en" ? "Dinosaurs" : "ไดโนเสาร์"}
                  </button>
                </div>

                <p className="text-sm text-gray-500 mb-3">
                  {language === "en" ? "Choose from predefined avatars:" : "เลือกจากอวาตาร์ที่กำหนดไว้:"}
                </p>

                {activeTab === "people" ? (
                  <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
                    {peopleAvatars.map((avatar, index) => (
                      <button
                        key={index}
                        className={`relative aspect-square rounded-full overflow-hidden border-4 transition-all ${
                          selectedAvatar === avatar
                            ? "border-facgure-blue scale-105 shadow-lg"
                            : "border-white hover:border-gray-200"
                        }`}
                        onClick={() => handleAvatarSelect(avatar)}
                      >
                        <Image
                          src={avatar || "/placeholder.svg"}
                          alt={`Avatar option ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        {selectedAvatar === avatar && (
                          <div className="absolute inset-0 bg-facgure-blue/20 flex items-center justify-center">
                            <div className="bg-facgure-blue rounded-full p-1">
                              <FontAwesomeIcon icon={faCheck} className="h-3 w-3 text-white" />
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-3">
                    {dinosaurAvatars.map((avatar, index) => (
                      <button
                        key={index}
                        className={`relative aspect-square rounded-full overflow-hidden border-4 transition-all ${
                          selectedAvatar === avatar
                            ? "border-facgure-blue scale-105 shadow-lg"
                            : "border-white hover:border-gray-200"
                        }`}
                        onClick={() => handleAvatarSelect(avatar)}
                      >
                        <Image
                          src={avatar || "/placeholder.svg"}
                          alt={`Dinosaur avatar option ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        {selectedAvatar === avatar && (
                          <div className="absolute inset-0 bg-facgure-blue/20 flex items-center justify-center">
                            <div className="bg-facgure-blue rounded-full p-1">
                              <FontAwesomeIcon icon={faCheck} className="h-3 w-3 text-white" />
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-3">
                  {language === "en" ? "Or upload your own:" : "หรืออัปโหลดของคุณเอง:"}
                </p>
                <div className="flex gap-2">
                  <label
                    className="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={triggerFileInput}
                  >
                    {isUploading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 border-2 border-facgure-blue border-t-transparent rounded-full animate-spin" />
                        <span>{language === "en" ? "Uploading..." : "กำลังอัปโหลด..."}</span>
                      </div>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faUpload} className="h-5 w-5 text-gray-500" />
                        <span className="text-gray-700">{language === "en" ? "Upload image" : "อัปโหลดรูปภาพ"}</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                          ref={fileInputRef}
                        />
                      </>
                    )}
                  </label>
                  {croppedImage && (
                    <button
                      onClick={() => setCropMode(true)}
                      className="p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      title={language === "en" ? "Adjust image" : "ปรับแต่งรูปภาพ"}
                    >
                      <FontAwesomeIcon icon={faCrop} className="h-5 w-5 text-gray-500" />
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="sticky bottom-0 pt-3 border-t border-gray-200 bg-white flex justify-end gap-2">
            <button
              onClick={cropMode ? handleCropCancel : onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              {t("cancel")}
            </button>
            <button
              onClick={handleSave}
              disabled={(!selectedAvatar && !croppedImage) || isUploading}
              className="px-4 py-2 bg-facgure-blue text-white rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {language === "en" ? "Save Changes" : "บันทึกการเปลี่ยนแปลง"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
