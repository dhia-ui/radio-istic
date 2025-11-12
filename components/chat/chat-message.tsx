"use client"

import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "@/types/chat";
import { formatTime } from "./utils";
import { ReactionPicker, ReactionDisplay } from "./message-reactions";
import { Check, CheckCheck } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageType;
  currentUserId: string;
  onReactionAdd?: (messageId: string, emoji: string) => void;
}

export default function ChatMessage({ message, currentUserId, onReactionAdd }: ChatMessageProps) {
  const handleReactionSelect = (emoji: string) => {
    onReactionAdd?.(message.id, emoji);
  };

  const handleReactionClick = (emoji: string) => {
    // Toggle reaction - add or remove
    onReactionAdd?.(message.id, emoji);
  };

  return (
    <div className="space-y-1 group">
      <div className={cn(
        "flex items-start gap-2",
        message.isFromCurrentUser ? "justify-end" : "justify-start"
      )}>
        {message.isFromCurrentUser && (
          <ReactionPicker onReactionSelect={handleReactionSelect} />
        )}
        
        <div className="flex flex-col max-w-xs">
          <div
            className={cn(
              "rounded-lg px-3 py-2 text-sm relative",
              message.isFromCurrentUser
                ? "bg-electric-blue text-white"
                : "bg-muted text-foreground"
            )}
          >
            {message.content}
            
            {/* Message status indicators */}
            {message.isFromCurrentUser && message.status && (
              <div className="flex items-center justify-end mt-1">
                {message.status === 'sent' && (
                  <Check className="h-3 w-3 text-white/70" />
                )}
                {message.status === 'delivered' && (
                  <CheckCheck className="h-3 w-3 text-white/70" />
                )}
                {message.status === 'read' && (
                  <CheckCheck className="h-3 w-3 text-white" />
                )}
              </div>
            )}
          </div>
          
          {/* Reactions display */}
          {message.reactions && message.reactions.length > 0 && (
            <ReactionDisplay
              reactions={message.reactions}
              currentUserId={currentUserId}
              onReactionClick={handleReactionClick}
              className={message.isFromCurrentUser ? "justify-end" : "justify-start"}
            />
          )}
          
          <span className={cn(
            "text-xs text-muted-foreground mt-0.5",
            message.isFromCurrentUser ? "text-right" : "text-left"
          )}>
            {formatTime(message.timestamp)}
          </span>
        </div>
        
        {!message.isFromCurrentUser && (
          <ReactionPicker onReactionSelect={handleReactionSelect} />
        )}
      </div>
    </div>
  );
}
