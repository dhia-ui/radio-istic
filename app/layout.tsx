import type React from "react"
import { Inter, Poppins, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import type { Metadata } from "next"
import mockDataJson from "@/mock.json"
import type { MockData } from "@/types/dashboard"
import { ClientLayoutWrapper } from "@/components/client-layout-wrapper"

const mockData = mockDataJson as MockData

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    template: "%s – Radio Istic",
    default: "Radio Istic – ISTIC Borj Cédria",
  },
  description:
    "Radio Istic - The official student club of ISTIC Borj Cédria. Events, podcasts, training, and community.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${poppins.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`} suppressHydrationWarning>
        <ClientLayoutWrapper mockData={mockData}>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  )
}
