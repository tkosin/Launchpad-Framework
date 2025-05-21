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
  const [errorCount, setErrorCount] = useState(0)

  // Reset error state if src changes
  useEffect(() => {
    setImgSrc(src)
    setError(false)
    setErrorCount(0)
  }, [src])

  const handleError = () => {
    // If the image fails to load, try different fallback paths
    if (errorCount === 0) {
      // Try without leading slash
      const newSrc = src.startsWith("/") ? src.substring(1) : `/${src}`
      console.log("Trying path without leading slash:", newSrc)
      setImgSrc(newSrc)
      setErrorCount(1)
    } else if (errorCount === 1) {
      // Try with explicit public path
      const newSrc = src.startsWith("/") ? `/public${src}` : `/public/${src}`
      console.log("Trying with explicit public path:", newSrc)
      setImgSrc(newSrc)
      setErrorCount(2)
    } else if (errorCount === 2) {
      // Try with absolute URL for Vercel deployment
      const hostname = window.location.hostname
      const protocol = window.location.protocol
      const baseUrl = `${protocol}//${hostname}`
      const newSrc = src.startsWith("/") ? `${baseUrl}${src}` : `${baseUrl}/${src}`
      console.log("Trying with absolute URL:", newSrc)
      setImgSrc(newSrc)
      setErrorCount(3)
    } else if (errorCount === 3) {
      // Try with direct Vercel deployment URL
      const vercelUrl = "https://facgure-launchpad.vercel.app"
      const newSrc = src.startsWith("/") ? `${vercelUrl}${src}` : `${vercelUrl}/${src}`
      console.log("Trying with Vercel deployment URL:", newSrc)
      setImgSrc(newSrc)
      setErrorCount(4)
    } else {
      // Final fallback - use a data URL for a simple placeholder
      console.log("Using fallback SVG")
      setImgSrc(
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='40' viewBox='0 0 100 40'%3E%3Crect width='100' height='40' fill='%23002b41'/%3E%3Ctext x='50' y='25' fontFamily='Arial' fontSize='12' fill='white' textAnchor='middle'%3EFacgure%3C/text%3E%3C/svg%3E",
      )
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
