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
  const [error, setError] = useState(false)
  const [loadAttempts, setLoadAttempts] = useState(0)
  const [finalSrc, setFinalSrc] = useState(src)

  // Track image loading attempts and errors
  useEffect(() => {
    if (error && loadAttempts < 3) {
      // Log detailed information about the failed image load
      console.log(`Image load failed (attempt ${loadAttempts + 1}): ${src}`)

      // Try different fallback strategies
      if (loadAttempts === 0) {
        // First fallback: Try with a leading slash if missing
        const newSrc = src.startsWith("/") ? src : `/${src}`
        console.log(`Trying fallback 1: ${newSrc}`)
        setFinalSrc(newSrc)
      } else if (loadAttempts === 1) {
        // Second fallback: Try with facgure-logo-light.png
        const fallbackSrc = "/facgure-logo-light.png"
        console.log(`Trying fallback 2: ${fallbackSrc}`)
        setFinalSrc(fallbackSrc)
      } else {
        // Final fallback: Use a data URI SVG as last resort
        const svgFallback = `data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewBox="0 0 120 40"><rect width="120" height="40" fill="%23002b41"/><text x="60" y="24" fontFamily="Arial" fontSize="16" fill="white" textAnchor="middle">Facgure</text></svg>`
        console.log(`Trying final fallback: SVG`)
        setFinalSrc(svgFallback)
      }

      setLoadAttempts((prev) => prev + 1)
      setError(false)
    }
  }, [error, loadAttempts, src])

  const handleError = () => {
    console.log(`Image failed to load: ${finalSrc}`)
    setError(true)
  }

  if (fill) {
    return (
      <div className={`relative ${className || ""}`} style={{ width: "100%", height: "100%" }}>
        <Image
          src={finalSrc || "/placeholder.svg"}
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
      src={finalSrc || "/placeholder.svg"}
      alt={alt}
      width={width || 100}
      height={height || 40}
      className={className}
      onError={handleError}
      unoptimized
    />
  )
}
