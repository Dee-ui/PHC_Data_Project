import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Dr. Sage - AI Healthcare Assistant for African Communities",
  description:
    "Dr. Sage is an intelligent healthcare platform that uses AI to predict malaria prevalence, provide multilingual triage assistance, and deliver data-driven health insights for clinics and patients across Africa.",
  keywords: [
    "healthcare",
    "AI",
    "malaria prediction",
    "triage assistant",
    "telemedicine",
    "Africa",
    "health management",
  ],
  generator: "v0.app",
  openGraph: {
    title: "Dr. Sage - AI Healthcare Assistant",
    description: "Intelligent healthcare predictions and triage for African communities",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
