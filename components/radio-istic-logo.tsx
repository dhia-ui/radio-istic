import Image from "next/image"

interface RadioIsticLogoProps {
  className?: string
  width?: number
  height?: number
}

export default function RadioIsticLogo({ className = "", width = 180, height = 60 }: RadioIsticLogoProps) {
  return (
    <Image src="/logo-radio-istic.png" alt="Radio Istic" width={width} height={height} className={className} priority />
  )
}
