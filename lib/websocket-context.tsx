"use client"

import { createContext, useContext, useEffect, type ReactNode } from "react"
import { useChatState } from "@/components/chat/use-chat-state"
import { useSocket } from "@/hooks/use-socket"
import { useAuth } from "@/lib/auth-context"
import type { ChatMessage } from "@/types/chat"

type WebSocketContextType = {
  isConnected: boolean
  sendMessage: (conversationId: string, message: ChatMessage) => void
  editMessage: (conversationId: string, messageId: string, newContent: string) => void
  deleteMessage: (conversationId: string, messageId: string) => void
  addReaction: (conversationId: string, messageId: string, emoji: string) => void
  markAsRead: (conversationId: string) => void
  typing: (conversationId: string, isTyping: boolean) => void
  typingUsers: Record<string, boolean>
  join: (conversationId: string) => void
  leave: (conversationId: string) => void
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { conversations, setConversations } = useChatState()
  
  const {
    isConnected,
    sendMessage: socketSendMessage,
    editMessage: socketEditMessage,
    deleteMessage: socketDeleteMessage,
    addReaction: socketAddReaction,
    markAsRead: socketMarkAsRead,
    messages,
    typingUsers,
    typing,
    joinConversation,
    leaveConversation,
  } = useSocket(user?.id || "")

  // Handle incoming messages from Socket.io
  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1]
      
      // Update conversations with new message
      const updatedConversations = conversations.map((conv) => {
        // Find if this message belongs to this conversation
        if (conv.participants.some(p => p.id === latestMessage.senderId)) {
          const isFromCurrentUser = latestMessage.senderId === user?.id
          
          const newMessage: ChatMessage = {
            id: latestMessage.id,
            content: latestMessage.content,
            timestamp: latestMessage.timestamp,
            senderId: latestMessage.senderId,
            isFromCurrentUser,
            status: latestMessage.status,
            reactions: latestMessage.reactions,
          }

          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: newMessage,
            unreadCount: isFromCurrentUser ? conv.unreadCount : conv.unreadCount + 1,
          }
        }
        return conv
      })

      setConversations(updatedConversations)
    }
  }, [messages, conversations, setConversations, user?.id])

  const sendMessage = (conversationId: string, message: ChatMessage) => {
    // Optimistic update
    const updatedConversations = conversations.map((conv) =>
      conv.id === conversationId
        ? {
            ...conv,
            messages: [...conv.messages, { ...message, status: "sending" as const }],
            lastMessage: message,
          }
        : conv,
    )
    setConversations(updatedConversations)

    // Send via Socket.io - pass the full message object
    socketSendMessage(conversationId, message)
  }

  const editMessage = (conversationId: string, messageId: string, newContent: string) => {
    // Optimistic update
    const updatedConversations = conversations.map((conv) =>
      conv.id === conversationId
        ? {
            ...conv,
            messages: conv.messages.map((msg) =>
              msg.id === messageId ? { ...msg, content: newContent, edited: true } : msg
            ),
          }
        : conv,
    )
    setConversations(updatedConversations)

    // Send via Socket.io
    socketEditMessage(conversationId, messageId, newContent)
  }

  const deleteMessage = (conversationId: string, messageId: string) => {
    // Optimistic update
    const updatedConversations = conversations.map((conv) =>
      conv.id === conversationId
        ? {
            ...conv,
            messages: conv.messages.filter((msg) => msg.id !== messageId),
          }
        : conv,
    )
    setConversations(updatedConversations)

    // Send via Socket.io
    socketDeleteMessage(conversationId, messageId)
  }

  const addReaction = (conversationId: string, messageId: string, emoji: string) => {
    // Optimistic update
    const updatedConversations = conversations.map((conv) =>
      conv.id === conversationId
        ? {
            ...conv,
            messages: conv.messages.map((msg) =>
              msg.id === messageId
                ? { ...msg, reactions: [...(msg.reactions || []), { emoji, userId: user?.id || "" }] }
                : msg
            ),
          }
        : conv,
    )
    setConversations(updatedConversations)

    // Send via Socket.io
    socketAddReaction(conversationId, messageId, emoji)
  }

  const markAsRead = (conversationId: string) => {
    // Find the conversation and get the last message ID
    const conversation = conversations.find(conv => conv.id === conversationId)
    const lastMessageId = conversation?.messages[conversation.messages.length - 1]?.id
    
    if (!lastMessageId) return

    // Update local state
    const updatedConversations = conversations.map((conv) =>
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    )
    setConversations(updatedConversations)

    // Send via Socket.io with messageId
    socketMarkAsRead(conversationId, lastMessageId)
  }

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        sendMessage,
        editMessage,
        deleteMessage,
        addReaction,
        markAsRead,
        typing,
        typingUsers,
        join: joinConversation,
        leave: leaveConversation,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}

export function useWebSocket() {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error("useWebSocket must be used within WebSocketProvider")
  }
  return context
}
