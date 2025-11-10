const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const httpServer = createServer(app);

// CORS configuration for Netlify
app.use(cors({
  origin: [
    'https://radioistic.netlify.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true
}));

app.use(express.json());

// Socket.IO with CORS
const io = new Server(httpServer, {
  cors: {
    origin: [
      'https://radioistic.netlify.app',
      'http://localhost:3000'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Store connected users
const connectedUsers = new Map();
const userSockets = new Map();

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'online',
    connectedUsers: connectedUsers.size,
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  // Handle user authentication
  socket.on('authenticate', (userData) => {
    console.log('🔐 User authenticated:', userData.email);
    connectedUsers.set(socket.id, {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      avatar: userData.avatar,
      socketId: socket.id,
      online: true,
      lastSeen: new Date()
    });
    
    userSockets.set(userData.id, socket.id);
    
    // Broadcast online status to all users
    io.emit('user-status-change', {
      userId: userData.id,
      status: 'online',
      timestamp: new Date()
    });
    
    // Send list of online users to the newly connected user
    const onlineUsers = Array.from(connectedUsers.values()).map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      avatar: u.avatar,
      online: true
    }));
    
    socket.emit('online-users', onlineUsers);
  });

  // Handle sending messages
  socket.on('send-message', (data) => {
    console.log('💬 Message received:', data);
    
    const { conversationId, recipientId, message, senderId, senderName } = data;
    
    // Get recipient's socket
    const recipientSocketId = userSockets.get(recipientId);
    
    const messageData = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      conversationId,
      content: message,
      senderId,
      senderName,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    
    // Send to recipient if online
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('receive-message', messageData);
      
      // Send delivery confirmation to sender
      socket.emit('message-delivered', {
        messageId: messageData.id,
        status: 'delivered'
      });
    }
    
    // Echo back to sender
    socket.emit('message-sent', messageData);
  });

  // Handle typing indicator
  socket.on('typing-start', (data) => {
    const { conversationId, recipientId, userName } = data;
    const recipientSocketId = userSockets.get(recipientId);
    
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('user-typing', {
        conversationId,
        userName,
        isTyping: true
      });
    }
  });

  socket.on('typing-stop', (data) => {
    const { conversationId, recipientId } = data;
    const recipientSocketId = userSockets.get(recipientId);
    
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('user-typing', {
        conversationId,
        isTyping: false
      });
    }
  });

  // Handle message read receipt
  socket.on('mark-as-read', (data) => {
    const { conversationId, messageIds, recipientId } = data;
    const recipientSocketId = userSockets.get(recipientId);
    
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('messages-read', {
        conversationId,
        messageIds,
        readAt: new Date().toISOString()
      });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
    
    const user = connectedUsers.get(socket.id);
    if (user) {
      userSockets.delete(user.id);
      connectedUsers.delete(socket.id);
      
      // Broadcast offline status
      io.emit('user-status-change', {
        userId: user.id,
        status: 'offline',
        lastSeen: new Date(),
        timestamp: new Date()
      });
    }
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error('❌ Socket error:', error);
  });
});

// Error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

// Start server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 WebSocket Server running on port ${PORT}`);
  console.log(`📡 Ready to accept connections from https://radioistic.netlify.app`);
});
