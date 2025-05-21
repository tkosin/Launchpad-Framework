"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface LogoImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
}

export function LogoImage({ src, alt, width, height, className, fill = false }: LogoImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [error, setError] = useState(false)

  // Reset error state if src changes
  useEffect(() => {
    setImgSrc(src)
    setError(false)
  }, [src])

  const handleError = () => {
    // If the image fails to load, try a fallback path
    if (!error) {
      // Try without leading slash
      const newSrc = src.startsWith("/") ? src.substring(1) : `/${src}`
      setImgSrc(newSrc)
      setError(true)
    }
  }

  if (fill) {
    return (
      <div className={`relative ${className || ""}`} style={{ width: "100%", height: "100%" }}>
        <Image
          src={imgSrc || "/placeholder.svg"}
          alt={alt}
          fill
          className="object-contain"
          onError={handleError}
          unoptimized
        />
      </div>
    )
  }

  return (
    <Image
      src={imgSrc || "/placeholder.svg"}
      alt={alt}
      width={width || 100}
      height={height || 40}
      className={className}
      onError={handleError}
      unoptimized
    />
  )
}
