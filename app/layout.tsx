import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { LanguageProvider } from "@/contexts/language-context"
import { ToastProvider } from "@/contexts/toast-context"

// Prevent Font Awesome from adding its CSS since we did it manually above
config.autoAddCss = false

export const metadata: Metadata = {
  title: "Facgure Portal",
  description: "Facgure Procurement Portal",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600;700&family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LanguageProvider>
          <ToastProvider>{children}</ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
