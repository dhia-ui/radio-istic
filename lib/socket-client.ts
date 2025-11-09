/**
 * Socket.io Client Configuration
 * Handles WebSocket connections for real-time messaging
 */

import { io, Socket } from 'socket.io-client'

// Socket instance
let socket: Socket | null = null

/**
 * Initialize Socket.io client connection
 * @param userId - Current user's ID for authentication
 * @returns Socket instance
 */
export const initializeSocket = (userId: string): Socket => {
  if (socket && socket.connected) {
    return socket
  }

  // Use environment variable or fallback to localhost
  const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'

  socket = io(SOCKET_URL, {
    auth: {
      userId,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ['websocket', 'polling'],
  })

  // Connection event handlers
  socket.on('connect', () => {
    console.log('[Socket.io] Connected:', socket?.id)
  })

  socket.on('disconnect', (reason) => {
    console.log('[Socket.io] Disconnected:', reason)
  })

  socket.on('connect_error', (error) => {
    console.error('[Socket.io] Connection error:', error.message)
  })

  socket.on('reconnect', (attemptNumber) => {
    console.log('[Socket.io] Reconnected after', attemptNumber, 'attempts')
  })

  socket.on('reconnect_attempt', (attemptNumber) => {
    console.log('[Socket.io] Reconnection attempt:', attemptNumber)
  })

  return socket
}

/**
 * Get existing socket instance
 * @returns Socket instance or null
 */
export const getSocket = (): Socket | null => {
  return socket
}

/**
 * Disconnect socket
 */
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

/**
 * Check if socket is connected
 * @returns Connection status
 */
export const isSocketConnected = (): boolean => {
  return socket?.connected ?? false
}
