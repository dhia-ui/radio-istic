'use client'

import Image from 'next/image'
import { useState } from 'react'

interface AvatarProps {
  src: string
  alt: string
  size?: number
  className?: string
}

export function AvatarWithFallback({ src, alt, size = 40, className = '' }: AvatarProps) {
  const [error, setError] = useState(false)
  
  // Generate fallback avatar URL using ui-avatars.com
  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=00D9FF&color=fff&size=${size}&bold=true`
  
  return (
    <div className={`relative overflow-hidden rounded-full ${className}`} style={{ width: size, height: size }}>
      <Image
        src={error ? fallbackUrl : src}
        alt={alt}
        width={size}
        height={size}
        className="object-cover"
        onError={() => setError(true)}
        unoptimized={error} // Use unoptimized for external URLs
      />
    </div>
  )
}
