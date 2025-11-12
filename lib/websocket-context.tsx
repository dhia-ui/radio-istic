'use client'

import React, { createContext, useContext, useEffect, useState, useRef, type ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from './auth-context'

// Connect to same server as API (backend on port 5000)
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000'

interface Message {
  id: string
  conversationId: string
  content: string
  senderId: string
  senderName: string
  timestamp: string
  status: 'sent' | 'delivered' | 'read'
}

type WebSocketContextType = {
  socket: Socket | null
  isConnected: boolean
  sendMessage: (recipientId: string, message: string, conversationId: string) => void
  join: (conversationId: string) => void
  leave: (conversationId: string) => void
  onlineUsers: string[]
  messages: Message[]
  conversationHistories: Record<string, Message[]>
  typingUsers: Record<string, boolean>
  typing: (conversationId: string, isTyping: boolean, recipientId: string) => void
  markAsRead: (conversationId: string, messageIds?: string[]) => void
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  sendMessage: () => {},
  join: () => {},
  leave: () => {},
  onlineUsers: [],
  messages: [],
  conversationHistories: {},
  typingUsers: {},
  typing: () => {},
  markAsRead: () => {}
})

export const useWebSocket = () => useContext(WebSocketContext)

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [conversationHistories, setConversationHistories] = useState<Record<string, Message[]>>({})
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({})
  const { user } = useAuth()
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  // Prevent SSR hydration mismatch - only initialize WebSocket on client
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !user) {
      console.log('⏸️ WebSocket initialization skipped:', { mounted, hasUser: !!user })
      return
    }

    console.log('🔌 Connecting to WebSocket server:', SOCKET_URL)

    // Get JWT token from localStorage
    const token = localStorage.getItem('radio-istic-token')
    
    if (!token) {
      console.error('❌ No authentication token found - Skipping WebSocket connection')
      console.log('💡 Please log in to enable real-time chat')
      return
    }

    console.log('✅ Token found, initializing WebSocket connection...')

    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity, // Never give up reconnecting
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000, // Max 10 seconds between attempts
      randomizationFactor: 0.5, // Randomize delay to avoid thundering herd
      timeout: 20000
    })

    newSocket.on('connect', () => {
      console.log('✅ WebSocket connected to backend on port 5000')
      setIsConnected(true)
      reconnectAttempts.current = 0
    })

    newSocket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected')
      setIsConnected(false)
    })

    newSocket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error.message)
      setIsConnected(false)
      reconnectAttempts.current++
      
      if (reconnectAttempts.current >= maxReconnectAttempts) {
        console.error('Max reconnection attempts reached')
      }
    })

    newSocket.on('online-users', (users: Array<{ id: string; socketId: string; name: string }>) => {
      console.log('👥 Online users:', users.length)
      setOnlineUsers(users.map(u => u.id))
    })

    newSocket.on('user-status-change', (data) => {
      console.log('👤 User status change:', data)
      if (data.status === 'online') {
        setOnlineUsers(prev => [...prev, data.userId])
      } else {
        setOnlineUsers(prev => prev.filter(id => id !== data.userId))
      }
    })

    newSocket.on('receive-message', (message: Message) => {
      console.log('💬 Message received:', message)
      setMessages(prev => {
        // Check if message already exists to prevent duplicates
        const exists = prev.some(msg => msg.id === message.id)
        if (exists) {
          console.log('⚠️ Duplicate message detected, skipping:', message.id)
          return prev
        }
        const updated = [...prev, message]
        console.log('📝 Total messages now:', updated.length)
        return updated
      })
      
      // Update conversation history
      setConversationHistories(prev => ({
        ...prev,
        [message.conversationId]: [
          ...(prev[message.conversationId] || []),
          message
        ]
      }))
      
      // Play notification sound
      try {
        const audio = new Audio('/sounds/message.mp3')
        audio.volume = 0.3
        audio.play().catch(e => console.log('Audio play failed:', e))
      } catch (e) {
        console.log('Audio error:', e)
      }
    })

    newSocket.on('message-sent', (message: Message) => {
      console.log('✅ Message sent confirmation:', message)
      setMessages(prev => {
        // Check if message already exists to prevent duplicates
        const exists = prev.some(msg => msg.id === message.id)
        if (exists) {
          console.log('⚠️ Duplicate message detected, skipping:', message.id)
          return prev
        }
        return [...prev, message]
      })
    })

    newSocket.on('message-delivered', (data) => {
      console.log('✅ Message delivered:', data)
      setMessages(prev => 
        prev.map(msg => 
          msg.id === data.messageId 
            ? { ...msg, status: 'delivered' }
            : msg
        )
      )
    })

    newSocket.on('messages-read', (data) => {
      console.log('✅ Messages read:', data)
      setMessages(prev =>
        prev.map(msg =>
          data.messageIds.includes(msg.id)
            ? { ...msg, status: 'read' }
            : msg
        )
      )
    })

    newSocket.on('user-typing', (data) => {
      console.log('⌨️ User typing:', data)
      setTypingUsers(prev => ({
        ...prev,
        [data.conversationId]: data.isTyping
      }))
    })

    newSocket.on('conversation-history', (data) => {
      console.log('📜 Conversation history loaded:', data.conversationId, data.messages.length, 'messages')
      setConversationHistories(prev => ({
        ...prev,
        [data.conversationId]: data.messages
      }))
    })

    setSocket(newSocket)

    return () => {
      console.log('🔌 Disconnecting WebSocket')
      newSocket.disconnect()
    }
  }, [user, mounted])

  // Don't render WebSocket-dependent content during SSR
  if (!mounted) {
    return <>{children}</>
  }

  const sendMessage = (recipientId: string, message: string, conversationId: string) => {
    if (!socket || !isConnected) {
      console.error('❌ Cannot send message: Socket not connected')
      alert('Not connected to chat server. Please refresh the page.')
      return
    }

    if (!message.trim()) {
      console.error('❌ Cannot send empty message')
      return
    }

    const tempId = `temp-${Date.now()}-${Math.random()}`
    
    console.log('📤 Sending message:', {
      conversationId,
      recipientId,
      message: message.substring(0, 50) + '...',
      tempId
    })

    socket.emit('send-message', {
      conversationId,
      recipientId,
      message,
      senderId: user?.id,
      senderName: user?.name,
      tempId
    })
  }

  const typing = (conversationId: string, isTyping: boolean, recipientId: string) => {
    if (!socket || !isConnected) return

    if (isTyping) {
      socket.emit('typing-start', {
        conversationId,
        recipientId,
        userName: user?.name
      })
    } else {
      socket.emit('typing-stop', {
        conversationId,
        recipientId
      })
    }
  }

  const join = (conversationId: string) => {
    if (!socket || !isConnected) {
      console.error('Cannot join conversation: Socket not connected')
      return
    }

    console.log('📥 Joining conversation:', conversationId)
    socket.emit('join-conversation', {
      conversationId,
      userId: user?.id
    })
  }

  const leave = (conversationId: string) => {
    if (!socket || !isConnected) return

    console.log('📤 Leaving conversation:', conversationId)
    socket.emit('leave-conversation', {
      conversationId,
      userId: user?.id
    })
  }

  const markAsRead = (conversationId: string, messageIds?: string[]) => {
    if (!socket || !isConnected) return

    // If no messageIds provided, mark all messages in conversation as read
    const msgIds = messageIds || messages
      .filter(msg => msg.conversationId === conversationId)
      .map(msg => msg.id)

    if (msgIds.length === 0) return

    socket.emit('mark-as-read', {
      conversationId,
      messageIds: msgIds,
      recipientId: messages.find(m => m.conversationId === conversationId)?.senderId
    })
  }

  return (
    <WebSocketContext.Provider value={{
      socket,
      isConnected,
      sendMessage,
      join,
      leave,
      onlineUsers,
      messages,
      conversationHistories,
      typingUsers,
      typing,
      markAsRead
    }}>
      {children}
    </WebSocketContext.Provider>
  )
}
