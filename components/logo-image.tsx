"use client"

import { useState } from "react"
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

  // Update the fallback to use facgure-logo-light.png
  const handleError = () => {
    console.log("Image failed to load, using fallback logo")
    setError(true)
  }

  // Use the main facgure-logo-light.png if there's an error
  const imageSrc = error ? "/facgure-logo-light.png" : src

  if (fill) {
    return (
      <div className={`relative ${className || ""}`} style={{ width: "100%", height: "100%" }}>
        <Image
          src={imageSrc || "/placeholder.svg"}
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
      src={imageSrc || "/placeholder.svg"}
      alt={alt}
      width={width || 100}
      height={height || 40}
      className={className}
      onError={handleError}
      unoptimized
    />
  )
}
