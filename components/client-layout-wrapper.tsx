"use client";

import type React from "react";
import dynamic from "next/dynamic";
import { AuthProvider } from "@/lib/auth-context";
import { WebSocketProvider } from "@/lib/websocket-context";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MobileHeader } from "@/components/dashboard/mobile-header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import type { MockData } from "@/types/dashboard";
import { ThemeProvider } from "@/components/theme-provider";
import { MediaPlayerProvider } from "@/components/media/media-player-context";
import { MiniPlayer } from "@/components/media/mini-player";
import { KeyboardShortcutsProvider } from "@/components/keyboard-shortcuts-provider";
import { MetricsReporter } from "@/components/metrics-reporter";
import { SkipLinks } from "@/components/skip-links";
import { Toaster } from "@/components/ui/toaster";

// Dynamically import components with framer-motion to prevent SSR issues
const Widget = dynamic(() => import("@/components/dashboard/widget"), { ssr: false });
const Notifications = dynamic(() => import("@/components/dashboard/notifications"), { ssr: false });
const Chat = dynamic(() => import("@/components/chat"), { ssr: false });
const MobileChat = dynamic(
  () => import("@/components/chat/mobile-chat").then((m) => ({ default: m.MobileChat })),
  { ssr: false }
);

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
  mockData: MockData;
}

export function ClientLayoutWrapper({ children, mockData }: ClientLayoutWrapperProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      {/* Performance metrics reporter */}
      <MetricsReporter />
      <KeyboardShortcutsProvider>
        <AuthProvider>
          <WebSocketProvider>
            <MediaPlayerProvider>
              <SidebarProvider>
                <SkipLinks />
                
                {/* Mobile Header - only visible on mobile */}
                <MobileHeader mockData={mockData} />

                {/* Desktop Layout */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-gap lg:px-sides">
                  <div className="hidden lg:block col-span-2 top-0 relative" id="sidebar-navigation">
                    <DashboardSidebar />
                  </div>
                  <main className="col-span-1 lg:col-span-7" id="main-content">
                    {children}
                  </main>
                  <div className="col-span-3 hidden lg:block">
                    <div className="space-y-gap py-sides min-h-screen max-h-screen sticky top-0 overflow-clip">
                      <Widget widgetData={mockData.widgetData} />
                      <MiniPlayer />
                      <Notifications initialNotifications={mockData.notifications} />
                      <div id="chat-widget">
                        <Chat />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Chat - floating CTA with drawer */}
                <MobileChat />
              </SidebarProvider>
            </MediaPlayerProvider>
          </WebSocketProvider>
        </AuthProvider>
      </KeyboardShortcutsProvider>
      <Toaster />
    </ThemeProvider>
  );
}
