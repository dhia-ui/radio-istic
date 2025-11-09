"use client"

import { MapPin } from "lucide-react"
import { useEffect, useState } from "react"
import RadioIsticLogo from "@/components/radio-istic-logo"

export function SidebarHeader() {
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const time = new Date().toLocaleTimeString("fr-TN", {
        timeZone: "Africa/Tunis",
        hour: "2-digit",
        minute: "2-digit",
      })
      setCurrentTime(time)
    }

    updateTime()
    const interval = setInterval(updateTime, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col gap-2 p-4 border-b border-border">
      <div className="flex items-center justify-center">
        <RadioIsticLogo width={160} height={50} />
      </div>
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <MapPin className="h-3 w-3 text-electric-blue" />
        <span>Ben Arous, Tunisie</span>
        <span className="ml-2">{currentTime}</span>
      </div>
    </div>
  )
}
