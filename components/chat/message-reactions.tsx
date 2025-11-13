"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Smile } from "lucide-react"
import { cn } from "@/lib/utils"

const REACTIONS = [
  { emoji: "👍", label: "Like" },
  { emoji: "❤️", label: "Love" },
  { emoji: "😂", label: "Haha" },
  { emoji: "😮", label: "Wow" },
  { emoji: "😢", label: "Sad" },
  { emoji: "🎉", label: "Celebrate" },
  { emoji: "🔥", label: "Fire" },
  { emoji: "💯", label: "100" },
]

interface ReactionPickerProps {
  onReactionSelect: (emoji: string) => void
  className?: string
}

export function ReactionPicker({ onReactionSelect, className }: ReactionPickerProps) {
  const [open, setOpen] = useState(false)

  const handleReactionClick = (emoji: string) => {
    onReactionSelect(emoji)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity", className)}
        >
          <Smile className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <div className="grid grid-cols-4 gap-1">
          {REACTIONS.map((reaction) => (
            <button
              key={reaction.emoji}
              type="button"
              onClick={() => handleReactionClick(reaction.emoji)}
              className="p-2 hover:bg-accent rounded-md transition-colors text-2xl"
              title={reaction.label}
            >
              {reaction.emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface ReactionDisplayProps {
  reactions: Array<{ emoji: string; userId: string; userName?: string }>
  currentUserId: string
  onReactionClick?: (emoji: string) => void
  className?: string
}

export function ReactionDisplay({
  reactions,
  currentUserId,
  onReactionClick,
  className,
}: ReactionDisplayProps) {
  if (!reactions || reactions.length === 0) return null

  // Group reactions by emoji
  const groupedReactions = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = []
    }
    acc[reaction.emoji].push(reaction)
    return acc
  }, {} as Record<string, typeof reactions>)

  return (
    <div className={cn("flex flex-wrap gap-1 mt-1", className)}>
      {Object.entries(groupedReactions).map(([emoji, reactionList]) => {
        const hasUserReacted = reactionList.some(r => r.userId === currentUserId)
        const count = reactionList.length

        return (
          <button
            key={emoji}
            type="button"
            onClick={() => onReactionClick?.(emoji)}
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors",
              hasUserReacted
                ? "bg-electric-blue/20 border border-electric-blue text-electric-blue"
                : "bg-muted hover:bg-accent border border-border"
            )}
            title={reactionList.map(r => r.userName).filter(Boolean).join(", ")}
          >
            <span>{emoji}</span>
            <span className="font-medium">{count}</span>
          </button>
        )
      })}
    </div>
  )
}
