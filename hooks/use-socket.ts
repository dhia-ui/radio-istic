/**
 * Custom Hook for Socket.io Integration
 * Provides real-time messaging capabilities
 */

'use client'

import { useEffect, useState, useCallback } from 'react'
import { Socket } from 'socket.io-client'
import { initializeSocket, disconnectSocket, getSocket } from '@/lib/socket-client'
import type { ChatMessage } from '@/types/chat'

interface UseSocketReturn {
  socket: Socket | null
  isConnected: boolean
  messages: ChatMessage[]
  typingUsers: Record<string, boolean>
  sendMessage: (conversationId: string, message: ChatMessage) => void
  editMessage: (conversationId: string, messageId: string, newContent: string) => void
  deleteMessage: (conversationId: string, messageId: string) => void
  addReaction: (conversationId: string, messageId: string, emoji: string) => void
  joinConversation: (conversationId: string) => void
  leaveConversation: (conversationId: string) => void
  typing: (conversationId: string, isTyping: boolean) => void
  markAsRead: (conversationId: string, messageId: string) => void
}

/**
 * Hook to manage Socket.io connection and real-time messaging
 * @param userId - Current user's ID
 * @param onMessageReceived - Callback when new message arrives
 * @param onTyping - Callback when someone is typing
 * @param onUserStatusChange - Callback when user status changes
 * @returns Socket utilities and connection status
 */
export const useSocket = (
  userId: string | null,
  onMessageReceived?: (message: ChatMessage) => void,
  onTyping?: (conversationId: string, userId: string, isTyping: boolean) => void,
  onUserStatusChange?: (userId: string, isOnline: boolean) => void
): UseSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!userId) {
      return
    }

    // Initialize socket connection
    const socketInstance = initializeSocket(userId)
    setSocket(socketInstance)

    // Set up event listeners
    const handleConnect = () => {
      setIsConnected(true)
      console.log('[useSocket] Connected')
    }

    const handleDisconnect = () => {
      setIsConnected(false)
      console.log('[useSocket] Disconnected')
    }

    const handleMessageReceived = (message: ChatMessage) => {
      console.log('[useSocket] Message received:', message)
      setMessages((prev) => [...prev, message])
      onMessageReceived?.(message)
    }

    const handleTyping = (data: { conversationId: string; userId: string; isTyping: boolean }) => {
      console.log('[useSocket] Typing event:', data)
      setTypingUsers((prev) => ({ ...prev, [data.userId]: data.isTyping }))
      onTyping?.(data.conversationId, data.userId, data.isTyping)
    }

    const handleUserStatus = (data: { userId: string; isOnline: boolean }) => {
      console.log('[useSocket] User status change:', data)
      onUserStatusChange?.(data.userId, data.isOnline)
    }

    socketInstance.on('connect', handleConnect)
    socketInstance.on('disconnect', handleDisconnect)
    socketInstance.on('message:received', handleMessageReceived)
    socketInstance.on('typing', handleTyping)
    socketInstance.on('user:status', handleUserStatus)

    // Cleanup on unmount
    return () => {
      socketInstance.off('connect', handleConnect)
      socketInstance.off('disconnect', handleDisconnect)
      socketInstance.off('message:received', handleMessageReceived)
      socketInstance.off('typing', handleTyping)
      socketInstance.off('user:status', handleUserStatus)
      disconnectSocket()
    }
  }, [userId, onMessageReceived, onTyping, onUserStatusChange])

  /**
   * Send a message to a conversation
   */
  const sendMessage = useCallback(
    (conversationId: string, message: ChatMessage) => {
      const socketInstance = getSocket()
      if (socketInstance && socketInstance.connected) {
        socketInstance.emit('message:send', {
          conversationId,
          message,
        })
      } else {
        console.error('[useSocket] Cannot send message: Socket not connected')
      }
    },
    []
  )

  /**
   * Join a conversation room
   */
  const joinConversation = useCallback((conversationId: string) => {
    const socketInstance = getSocket()
    if (socketInstance && socketInstance.connected) {
      socketInstance.emit('conversation:join', { conversationId })
      console.log('[useSocket] Joined conversation:', conversationId)
    }
  }, [])

  /**
   * Leave a conversation room
   */
  const leaveConversation = useCallback((conversationId: string) => {
    const socketInstance = getSocket()
    if (socketInstance && socketInstance.connected) {
      socketInstance.emit('conversation:leave', { conversationId })
      console.log('[useSocket] Left conversation:', conversationId)
    }
  }, [])

  /**
   * Emit typing indicator
   */
  const typing = useCallback((conversationId: string, isTyping: boolean) => {
    const socketInstance = getSocket()
    if (socketInstance && socketInstance.connected) {
      socketInstance.emit('typing', {
        conversationId,
        isTyping,
      })
    }
  }, [])

  /**
   * Mark message as read
   */
  const markAsRead = useCallback((conversationId: string, messageId: string) => {
    const socketInstance = getSocket()
    if (socketInstance && socketInstance.connected) {
      socketInstance.emit('message:read', {
        conversationId,
        messageId,
      })
    }
  }, [])

  /**
   * Edit an existing message
   */
  const editMessage = useCallback((conversationId: string, messageId: string, newContent: string) => {
    const socketInstance = getSocket()
    if (socketInstance && socketInstance.connected) {
      socketInstance.emit('message:edit', {
        conversationId,
        messageId,
        newContent,
      })
      console.log('[useSocket] Message edited:', messageId)
    }
  }, [])

  /**
   * Delete a message
   */
  const deleteMessage = useCallback((conversationId: string, messageId: string) => {
    const socketInstance = getSocket()
    if (socketInstance && socketInstance.connected) {
      socketInstance.emit('message:delete', {
        conversationId,
        messageId,
      })
      console.log('[useSocket] Message deleted:', messageId)
    }
  }, [])

  /**
   * Add reaction to a message
   */
  const addReaction = useCallback((conversationId: string, messageId: string, emoji: string) => {
    const socketInstance = getSocket()
    if (socketInstance && socketInstance.connected) {
      socketInstance.emit('message:reaction', {
        conversationId,
        messageId,
        emoji,
      })
      console.log('[useSocket] Reaction added:', emoji)
    }
  }, [])

  return {
    socket,
    isConnected,
    messages,
    typingUsers,
    sendMessage,
    editMessage,
    deleteMessage,
    addReaction,
    joinConversation,
    leaveConversation,
    typing,
    markAsRead,
  }
}
