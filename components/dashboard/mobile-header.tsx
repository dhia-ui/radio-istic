import { SidebarTrigger } from "@/components/ui/sidebar"
import RadioIsticLogo from "@/components/radio-istic-logo"
import { Bell, MapPin, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import type { MockData } from "@/types/dashboard"

interface MobileHeaderProps {
  mockData: MockData
}

export function MobileHeader({ mockData }: MobileHeaderProps) {
  const currentTime = new Date().toLocaleTimeString("fr-TN", {
    timeZone: "Africa/Tunis",
    hour: "2-digit",
    minute: "2-digit",
  })
  const { theme, setTheme } = useTheme()
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

  return (
    <header className="lg:hidden sticky top-0 z-50 w-full border-b border-border glass-panel">
      <div className="flex h-header-mobile items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="-ml-1" />
          <RadioIsticLogo width={120} height={40} />
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground mr-2">
            <MapPin className="h-3 w-3 text-electric-blue" />
            <span>Ben Arous, TN</span>
            <span className="ml-2">{currentTime}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Basculer thème" className="relative">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {mockData.notifications.length > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-electric-blue" />
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
