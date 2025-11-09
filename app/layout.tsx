import type React from "react"
import { Inter, Poppins, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import type { Metadata } from "next"
import { AuthProvider } from "@/lib/auth-context"
import { WebSocketProvider } from "@/lib/websocket-context"
import { SidebarProvider } from "@/components/ui/sidebar"
import { MobileHeader } from "@/components/dashboard/mobile-header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import mockDataJson from "@/mock.json"
import type { MockData } from "@/types/dashboard"
import Widget from "@/components/dashboard/widget"
import Notifications from "@/components/dashboard/notifications"
import { MobileChat } from "@/components/chat/mobile-chat"
import Chat from "@/components/chat"

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
    <html lang="fr" className="dark">
      <body className={`${poppins.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <AuthProvider>
          <WebSocketProvider>
            <SidebarProvider>
              {/* Mobile Header - only visible on mobile */}
              <MobileHeader mockData={mockData} />

              {/* Desktop Layout */}
              <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-gap lg:px-sides">
                <div className="hidden lg:block col-span-2 top-0 relative">
                  <DashboardSidebar />
                </div>
                <div className="col-span-1 lg:col-span-7">{children}</div>
                <div className="col-span-3 hidden lg:block">
                  <div className="space-y-gap py-sides min-h-screen max-h-screen sticky top-0 overflow-clip">
                    <Widget widgetData={mockData.widgetData} />
                    <Notifications initialNotifications={mockData.notifications} />
                    <Chat />
                  </div>
                </div>
              </div>

              {/* Mobile Chat - floating CTA with drawer */}
              <MobileChat />
            </SidebarProvider>
          </WebSocketProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
