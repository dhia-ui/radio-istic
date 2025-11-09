"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Skip links for keyboard navigation
 * Allows users to quickly jump to main content areas
 */
export function SkipLinks() {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <a
        href="#main-content"
        className={cn(
          "fixed top-4 left-4 z-[9999]",
          "px-4 py-2 bg-primary text-primary-foreground rounded-lg",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "transition-transform -translate-y-20 focus:translate-y-0"
        )}
      >
        Skip to main content
      </a>
      <a
        href="#sidebar-navigation"
        className={cn(
          "fixed top-4 left-40 z-[9999]",
          "px-4 py-2 bg-primary text-primary-foreground rounded-lg",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "transition-transform -translate-y-20 focus:translate-y-0"
        )}
      >
        Skip to navigation
      </a>
      <a
        href="#chat-widget"
        className={cn(
          "fixed top-4 left-80 z-[9999]",
          "px-4 py-2 bg-primary text-primary-foreground rounded-lg",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "transition-transform -translate-y-20 focus:translate-y-0"
        )}
      >
        Skip to chat
      </a>
    </div>
  )
}
