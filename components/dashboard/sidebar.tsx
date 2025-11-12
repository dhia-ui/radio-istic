"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Home,
  Calendar,
  Radio,
  GraduationCap,
  Users,
  Handshake,
  Info,
  Settings,
  LogOut,
  LogIn,
  MessageCircle,
  Shield,
  Heart,
} from "lucide-react"
import RadioIsticLogo from "@/components/radio-istic-logo"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

const navItems = [
  { title: "Accueil", icon: Home, href: "/" },
  { title: "Événements", icon: Calendar, href: "/events" },
  { title: "Médias & Podcasts", icon: Radio, href: "/media" },
  { title: "Formation", icon: GraduationCap, href: "/training" },
  { title: "Membres", icon: Users, href: "/members", protected: true },
  { title: "Messages", icon: MessageCircle, href: "/chat", protected: true },
  { title: "Vie du Club", icon: Heart, href: "/club-life", protected: true },
  { title: "Bureau", icon: Shield, href: "/bureau", protected: true, bureauOnly: true },
  { title: "Sponsors", icon: Handshake, href: "/sponsors" },
  { title: "À propos", icon: Info, href: "/about" },
]

export function DashboardSidebar() {
  const { isAuthenticated, logout, user } = useAuth()
  const { theme, setTheme } = useTheme()
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

  const isBureauMember = user?.role && user.role !== "member" && user.role !== "guest"

  return (
  <Sidebar className="border-r-0 glass-panel">
      <SidebarHeader className="border-b border-border py-6">
        <div className="flex items-center justify-between px-4">
          <Link href="/" className="flex items-center justify-center">
            <RadioIsticLogo width={220} height={70} />
          </Link>
          <button
            onClick={toggleTheme}
            aria-label="Basculer thème"
            className="rounded-md p-2 hover:bg-sidebar-accent transition"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground px-4 py-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                if (item.protected && !isAuthenticated) return null
                if (item.bureauOnly && !isBureauMember) return null

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border p-4">
        <SidebarMenu>
          {isAuthenticated ? (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-sidebar-accent"
                  >
                    <Settings className="h-5 w-5" />
                    <span>Paramètres</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-sidebar-accent w-full text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Déconnexion</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/login"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-sidebar-accent bg-electric-blue/10 text-electric-blue"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Se connecter</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
