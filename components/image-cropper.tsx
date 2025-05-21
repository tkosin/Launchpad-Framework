"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRotateRight, faRotateLeft, faExpand, faCompress } from "@fortawesome/free-solid-svg-icons"

interface ImageCropperProps {
  imageSrc: string
  onCropComplete: (croppedImageUrl: string) => void
  aspectRatio?: number
  language: "en" | "th"
}

export function ImageCropper({ imageSrc, onCropComplete, aspectRatio = 1, language }: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>()
  const [rotation, setRotation] = useState(0)
  const [scale, setScale] = useState(1)
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
    return centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        aspect,
        mediaWidth,
        mediaHeight,
      ),
      mediaWidth,
      mediaHeight,
    )
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, aspectRatio))
  }

  const rotateLeft = () => {
    setRotation((prev) => (prev - 90) % 360)
  }

  const rotateRight = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 3))
  }

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5))
  }

  useEffect(() => {
    if (completedCrop && imgRef.current && canvasRef.current) {
      const image = imgRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        return
      }

      // Set canvas size to match the cropped image
      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height
      const pixelRatio = window.devicePixelRatio || 1

      canvas.width = completedCrop.width * scaleX * pixelRatio
      canvas.height = completedCrop.height * scaleY * pixelRatio

      ctx.scale(pixelRatio, pixelRatio)
      ctx.imageSmoothingQuality = "high"

      // Calculate the center of the canvas
      const centerX = canvas.width / 2 / pixelRatio
      const centerY = canvas.height / 2 / pixelRatio

      // Save the current context state
      ctx.save()

      // Translate to the center, rotate, and translate back
      ctx.translate(centerX, centerY)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.translate(-centerX, -centerY)

      // Scale the image
      ctx.scale(scale, scale)

      // Draw the image with the crop
      const cropX = (completedCrop.x * scaleX) / scale
      const cropY = (completedCrop.y * scaleY) / scale
      const cropWidth = (completedCrop.width * scaleX) / scale
      const cropHeight = (completedCrop.height * scaleY) / scale

      ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        (centerX - completedCrop.width / 2) / scale,
        (centerY - completedCrop.height / 2) / scale,
        cropWidth,
        cropHeight,
      )

      // Restore the context state
      ctx.restore()

      // Convert canvas to data URL and pass it to the parent component
      const dataUrl = canvas.toDataURL("image/jpeg")
      onCropComplete(dataUrl)
    }
  }, [completedCrop, rotation, scale, onCropComplete])

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 overflow-hidden rounded-lg border border-gray-200 max-w-full">
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspectRatio}
          circularCrop
        >
          <img
            ref={imgRef}
            src={imageSrc || "/placeholder.svg"}
            alt="Crop me"
            style={{ transform: `rotate(${rotation}deg) scale(${scale})` }}
            onLoad={onImageLoad}
            className="max-h-[300px] w-auto transition-transform"
            crossOrigin="anonymous"
          />
        </ReactCrop>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={rotateLeft}
          className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          title={language === "en" ? "Rotate left" : "หมุนซ้าย"}
        >
          <FontAwesomeIcon icon={faRotateLeft} className="h-5 w-5 text-gray-700" />
        </button>
        <button
          type="button"
          onClick={rotateRight}
          className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          title={language === "en" ? "Rotate right" : "หมุนขวา"}
        >
          <FontAwesomeIcon icon={faRotateRight} className="h-5 w-5 text-gray-700" />
        </button>
        <button
          type="button"
          onClick={zoomIn}
          className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          title={language === "en" ? "Zoom in" : "ขยาย"}
        >
          <FontAwesomeIcon icon={faExpand} className="h-5 w-5 text-gray-700" />
        </button>
        <button
          type="button"
          onClick={zoomOut}
          className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          title={language === "en" ? "Zoom out" : "ย่อ"}
        >
          <FontAwesomeIcon icon={faCompress} className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        {language === "en" ? "Drag to reposition. Use buttons to rotate and zoom." : "ลากเพื่อปรับตำแหน่ง ใช้ปุ่มเพื่อหมุนและซูม"}
      </p>

      {/* Hidden canvas for processing the cropped image */}
      <canvas
        ref={canvasRef}
        style={{
          display: "none",
        }}
      />
    </div>
  )
}
