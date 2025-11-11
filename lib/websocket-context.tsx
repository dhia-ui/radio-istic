'use client'

import React, { createContext, useContext, useEffect, useState, useRef, type ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from './auth-context'

// ⚠️ CHANGE THIS TO YOUR RENDER URL AFTER DEPLOYMENT
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'

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
    if (!mounted || !user) return

    console.log('🔌 Connecting to WebSocket server:', SOCKET_URL)

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
      timeout: 20000
    })

    newSocket.on('connect', () => {
      console.log('✅ WebSocket connected')
      setIsConnected(true)
      reconnectAttempts.current = 0
      
      // Authenticate user
      newSocket.emit('authenticate', {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar
      })
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

    newSocket.on('online-users', (users) => {
      console.log('👥 Online users:', users.length)
      setOnlineUsers(users.map((u: any) => u.id))
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
      setMessages(prev => [...prev, message])
      
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
      setMessages(prev => [...prev, message])
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
      console.error('Cannot send message: Socket not connected')
      return
    }

    socket.emit('send-message', {
      conversationId,
      recipientId,
      message,
      senderId: user?.id,
      senderName: user?.name
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
