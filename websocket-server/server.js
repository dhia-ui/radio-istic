const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

// Import database and models
const connectDB = require('./config/database');
const User = require('./models/User');
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');

const app = express();
const httpServer = createServer(app);

// Connect to MongoDB
connectDB();

// Parse allowed origins from env or use defaults
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
      'https://radioistic.netlify.app',
      'http://localhost:3000',
      'http://localhost:3001'
    ];

// CORS configuration
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

// Socket.IO with CORS
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
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
  socket.on('authenticate', async (userData) => {
    try {
      console.log('🔐 User authenticated:', userData.email);
      
      // Update user status in database if MongoDB is connected
      if (User.db.readyState === 1) {
        await User.findOneAndUpdate(
          { _id: userData.id },
          { 
            status: 'online',
            socketId: socket.id,
            lastSeen: new Date()
          },
          { upsert: true, new: true }
        );
      }
      
      // Store in memory
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
    } catch (error) {
      console.error('❌ Authentication error:', error);
    }
  });

  // Handle joining a conversation (load history)
  socket.on('join-conversation', async (data) => {
    try {
      const { conversationId, userId } = data;
      console.log(`👥 User ${userId} joining conversation ${conversationId}`);
      
      // Join socket room for this conversation
      socket.join(conversationId);
      
      // Load message history from database if MongoDB is connected
      if (Message.db.readyState === 1) {
        const messages = await Message.find({
          conversation: conversationId,
          isDeleted: false
        })
          .populate('sender', 'firstName lastName avatar')
          .sort('createdAt')
          .limit(100) // Load last 100 messages
          .lean();
        
        // Format messages for client
        const formattedMessages = messages.map(msg => ({
          id: msg._id.toString(),
          conversationId: msg.conversation.toString(),
          content: msg.content,
          senderId: msg.sender._id.toString(),
          senderName: `${msg.sender.firstName} ${msg.sender.lastName}`,
          senderAvatar: msg.sender.avatar,
          timestamp: msg.createdAt.toISOString(),
          type: msg.type,
          readBy: msg.readBy.map(r => r.user.toString())
        }));
        
        socket.emit('conversation-history', {
          conversationId,
          messages: formattedMessages
        });
        
        console.log(`📜 Loaded ${formattedMessages.length} messages for conversation ${conversationId}`);
      }
    } catch (error) {
      console.error('❌ Error joining conversation:', error);
      socket.emit('error', { message: 'Failed to load conversation history' });
    }
  });

  // Handle sending messages
  socket.on('send-message', async (data) => {
    try {
      console.log('💬 Message received:', data);
      
      const { conversationId, recipientId, message, senderId, senderName } = data;
      
      let savedMessage = null;
      
      // Save message to database if MongoDB is connected
      if (Message.db.readyState === 1) {
        // Find or create conversation
        let conversation = await Conversation.findById(conversationId);
        
        if (!conversation) {
          // Create conversation if it doesn't exist
          conversation = await Conversation.create({
            participants: [senderId, recipientId]
          });
        }
        
        // Create message
        savedMessage = await Message.create({
          conversation: conversation._id,
          sender: senderId,
          content: message,
          type: 'text'
        });
        
        // Update conversation last message
        conversation.lastMessage = savedMessage._id;
        conversation.lastMessageTimestamp = savedMessage.createdAt;
        await conversation.save();
        
        console.log('💾 Message saved to database:', savedMessage._id);
      }
      
      // Get recipient's socket
      const recipientSocketId = userSockets.get(recipientId);
      
      const messageData = {
        id: savedMessage ? savedMessage._id.toString() : `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        conversationId,
        content: message,
        senderId,
        senderName,
        timestamp: savedMessage ? savedMessage.createdAt.toISOString() : new Date().toISOString(),
        status: 'sent',
        type: 'text'
      };
      
      // Send to conversation room (all participants)
      io.to(conversationId).emit('receive-message', messageData);
      
      // Send delivery confirmation to sender
      if (recipientSocketId) {
        socket.emit('message-delivered', {
          messageId: messageData.id,
          status: 'delivered'
        });
      }
      
      // Echo back to sender (if not in room already)
      socket.emit('message-sent', messageData);
      
    } catch (error) {
      console.error('❌ Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
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
  socket.on('mark-as-read', async (data) => {
    try {
      const { conversationId, messageIds, userId, recipientId } = data;
      
      // Update read status in database if MongoDB is connected
      if (Message.db.readyState === 1 && Array.isArray(messageIds)) {
        await Message.updateMany(
          {
            _id: { $in: messageIds },
            'readBy.user': { $ne: userId }
          },
          {
            $push: { readBy: { user: userId, readAt: new Date() } }
          }
        );
        
        console.log(`✓ Marked ${messageIds.length} messages as read by ${userId}`);
      }
      
      // Notify sender that messages were read
      const recipientSocketId = userSockets.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('messages-read', {
          conversationId,
          messageIds,
          readBy: userId,
          readAt: new Date().toISOString()
        });
      }
      
      // Emit to conversation room
      io.to(conversationId).emit('messages-read', {
        conversationId,
        messageIds,
        readBy: userId,
        readAt: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Error marking messages as read:', error);
    }
  });

  // Handle disconnect
  socket.on('disconnect', async () => {
    console.log('❌ User disconnected:', socket.id);
    
    const user = connectedUsers.get(socket.id);
    if (user) {
      // Update user status in database if MongoDB is connected
      if (User.db.readyState === 1) {
        try {
          await User.findByIdAndUpdate(user.id, {
            status: 'offline',
            lastSeen: new Date(),
            socketId: null
          });
        } catch (error) {
          console.error('❌ Error updating user status:', error);
        }
      }
      
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
