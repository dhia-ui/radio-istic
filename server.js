/**
 * Socket.io Server for Real-Time Messaging
 * Run this with: node server.js
 * Or update package.json to use this as the dev script
 */

const { createServer } = require('http')
const { Server } = require('socket.io')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = parseInt(process.env.PORT || '3000', 10)
const socketPort = parseInt(process.env.SOCKET_PORT || '3001', 10)

const app = next({ dev, hostname, port })
const handler = app.getRequestHandler()

app.prepare().then(() => {
  // Next.js server
  const nextServer = createServer(async (req, res) => {
    try {
      await handler(req, res)
    } catch (err) {
      console.error('Error handling request:', err)
      res.statusCode = 500
      res.end('Internal Server Error')
    }
  })

  nextServer.listen(port, (err) => {
    if (err) throw err
    console.log(`✅ Next.js ready on http://${hostname}:${port}`)
  })

  // Socket.io server
  const httpServer = createServer()
  const io = new Server(httpServer, {
    cors: {
      origin: `http://${hostname}:${port}`,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  })

  // Store online users
  const onlineUsers = new Map()

  io.on('connection', (socket) => {
    const userId = socket.handshake.auth.userId
    console.log(`🔌 User connected: ${userId} (${socket.id})`)

    // Track online user
    onlineUsers.set(userId, socket.id)

    // Join user to their personal room
    socket.join(`user:${userId}`)

    // Broadcast user online status to all clients
    io.emit('user:status', {
      userId,
      isOnline: true,
      socketId: socket.id,
    })

    // Send current online users to the newly connected user
    socket.emit('users:online', Array.from(onlineUsers.keys()))

    /**
     * Conversation Management
     */
    socket.on('conversation:join', ({ conversationId }) => {
      socket.join(`conversation:${conversationId}`)
      console.log(`👥 User ${userId} joined conversation ${conversationId}`)
    })

    socket.on('conversation:leave', ({ conversationId }) => {
      socket.leave(`conversation:${conversationId}`)
      console.log(`👋 User ${userId} left conversation ${conversationId}`)
    })

    /**
     * Message Handling
     */
    socket.on('message:send', ({ conversationId, message }) => {
      console.log(`💬 Message sent to conversation ${conversationId}:`, message.content)
      
      // Broadcast to all users in the conversation except sender
      socket.to(`conversation:${conversationId}`).emit('message:received', {
        ...message,
        timestamp: new Date().toISOString(),
      })
    })

    /**
     * Typing Indicators
     */
    socket.on('typing', ({ conversationId, isTyping }) => {
      socket.to(`conversation:${conversationId}`).emit('typing', {
        conversationId,
        userId,
        isTyping,
      })
    })

    /**
     * Message Read Receipts
     */
    socket.on('message:read', ({ conversationId, messageId }) => {
      io.to(`conversation:${conversationId}`).emit('message:read', {
        conversationId,
        messageId,
        userId,
        readAt: new Date().toISOString(),
      })
    })

    /**
     * Message Reactions
     */
    socket.on('message:react', ({ conversationId, messageId, reaction }) => {
      io.to(`conversation:${conversationId}`).emit('message:reaction', {
        conversationId,
        messageId,
        userId,
        reaction,
      })
    })

    /**
     * Message Editing
     */
    socket.on('message:edit', ({ conversationId, messageId, newContent }) => {
      io.to(`conversation:${conversationId}`).emit('message:edited', {
        conversationId,
        messageId,
        newContent,
        editedAt: new Date().toISOString(),
      })
    })

    /**
     * Message Deletion
     */
    socket.on('message:delete', ({ conversationId, messageId }) => {
      io.to(`conversation:${conversationId}`).emit('message:deleted', {
        conversationId,
        messageId,
        deletedAt: new Date().toISOString(),
      })
    })

    /**
     * File Upload Progress (for future implementation)
     */
    socket.on('file:upload:start', ({ conversationId, fileId, fileName }) => {
      socket.to(`conversation:${conversationId}`).emit('file:upload:progress', {
        fileId,
        fileName,
        progress: 0,
      })
    })

    socket.on('file:upload:complete', ({ conversationId, fileId, fileUrl }) => {
      socket.to(`conversation:${conversationId}`).emit('file:uploaded', {
        fileId,
        fileUrl,
      })
    })

    /**
     * Voice Message (for future implementation)
     */
    socket.on('voice:send', ({ conversationId, audioBlob }) => {
      io.to(`conversation:${conversationId}`).emit('voice:received', {
        conversationId,
        userId,
        audioBlob,
        timestamp: new Date().toISOString(),
      })
    })

    /**
     * User Disconnect
     */
    socket.on('disconnect', (reason) => {
      console.log(`🔌 User disconnected: ${userId} (${socket.id})`, reason)
      
      // Remove from online users
      onlineUsers.delete(userId)
      
      // Broadcast user offline status
      io.emit('user:status', {
        userId,
        isOnline: false,
        socketId: socket.id,
      })
    })

    /**
     * Error Handling
     */
    socket.on('error', (error) => {
      console.error('❌ Socket error:', error)
    })
  })

  httpServer.listen(socketPort, (err) => {
    if (err) throw err
    console.log(`✅ Socket.io server ready on http://${hostname}:${socketPort}`)
    console.log('\n🚀 Both servers running successfully!\n')
  })

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('\n🛑 SIGTERM signal received: closing HTTP servers')
    nextServer.close(() => {
      console.log('✅ Next.js server closed')
    })
    httpServer.close(() => {
      console.log('✅ Socket.io server closed')
      process.exit(0)
    })
  })
})
