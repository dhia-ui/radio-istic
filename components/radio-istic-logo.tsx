import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface RadioIsticLogoProps {
  className?: string
  width?: number
  height?: number
}

export default function RadioIsticLogo({ className = "", width = 240, height = 80 }: RadioIsticLogoProps) {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Use white logo in dark mode, black logo in light mode
  const logoSrc = mounted && (theme === 'dark' || resolvedTheme === 'dark')
    ? "/logo/logo radio blanc.jpeg"
    : "/logo/logo radio noir.png"

  return (
    <Image 
      src={logoSrc} 
      alt="Radio Istic" 
      width={width} 
      height={height} 
      className={className} 
      priority 
    />
  )
}
