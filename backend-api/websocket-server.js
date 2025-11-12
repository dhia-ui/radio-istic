const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Message = require('./models/Message');
const Conversation = require('./models/Conversation');
const User = require('./models/User');

// Store online users with their socket IDs
const onlineUsers = new Map(); // userId -> { socketId, userInfo }

function initializeWebSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://radioistic.netlify.app'
      ],
      credentials: true,
      methods: ['GET', 'POST']
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000
  });

  console.log('🔌 WebSocket server initialized');

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        console.log('❌ No token provided for socket connection');
        return next(new Error('Authentication token required'));
      }

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.userInfo = {
        id: user._id.toString(),
        name: `${user.firstName} ${user.lastName}`,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar
      };

      console.log(`✅ User authenticated: ${socket.userInfo.name} (${socket.userId})`);
      next();
    } catch (error) {
      console.error('❌ Socket authentication error:', error.message);
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`👤 User connected: ${socket.userInfo.name} (Socket: ${socket.id})`);

    // Add user to online users
    onlineUsers.set(socket.userId, {
      socketId: socket.id,
      userInfo: socket.userInfo
    });

    // Update user's socket ID in database
    User.findByIdAndUpdate(socket.userId, { 
      socketId: socket.id,
      status: 'online'
    }).catch(err => console.error('Error updating user socket:', err));

    // Broadcast online users list
    broadcastOnlineUsers(io);

    // Notify others that this user is online
    socket.broadcast.emit('user-status-change', {
      userId: socket.userId,
      status: 'online',
      userInfo: socket.userInfo
    });

    // JOIN CONVERSATION
    socket.on('join-conversation', async (data) => {
      const { conversationId } = data;
      console.log(`📥 ${socket.userInfo.name} joining conversation: ${conversationId}`);

      try {
        // Verify user is part of this conversation
        const conversation = await Conversation.findOne({
          _id: conversationId,
          participants: socket.userId
        });

        if (!conversation) {
          socket.emit('error', { message: 'You are not part of this conversation' });
          return;
        }

        // Join the room
        socket.join(conversationId);
        console.log(`✅ User ${socket.userInfo.name} joined room: ${conversationId}`);

        // Load and send conversation history
        const messages = await Message.find({
          conversation: conversationId,
          isDeleted: false
        })
          .populate('sender', 'firstName lastName avatar')
          .sort('createdAt')
          .limit(100)
          .lean();

        // Format messages
        const formattedMessages = messages.map(msg => ({
          id: msg._id.toString(),
          conversationId: conversationId,
          content: msg.content,
          senderId: msg.sender._id.toString(),
          senderName: `${msg.sender.firstName} ${msg.sender.lastName}`,
          senderAvatar: msg.sender.avatar,
          timestamp: msg.createdAt.toISOString(),
          status: msg.readBy.some(r => r.user.toString() === socket.userId) ? 'read' : 'delivered',
          type: msg.type || 'text'
        }));

        socket.emit('conversation-history', {
          conversationId,
          messages: formattedMessages
        });

        // Mark messages as delivered
        await Message.updateMany(
          {
            conversation: conversationId,
            sender: { $ne: socket.userId },
            'readBy.user': { $ne: socket.userId }
          },
          {
            $push: { readBy: { user: socket.userId, readAt: new Date() } }
          }
        );

      } catch (error) {
        console.error('❌ Error joining conversation:', error);
        socket.emit('error', { message: 'Failed to join conversation' });
      }
    });

    // LEAVE CONVERSATION
    socket.on('leave-conversation', (data) => {
      const { conversationId } = data;
      console.log(`📤 ${socket.userInfo.name} leaving conversation: ${conversationId}`);
      socket.leave(conversationId);
    });

    // SEND MESSAGE
    socket.on('send-message', async (data) => {
      const { conversationId, recipientId, message, tempId } = data;
      console.log(`💬 Message from ${socket.userInfo.name} in conversation ${conversationId}`);

      try {
        // Verify user is part of conversation
        const conversation = await Conversation.findOne({
          _id: conversationId,
          participants: socket.userId
        });

        if (!conversation) {
          socket.emit('error', { message: 'You are not part of this conversation' });
          return;
        }

        // Create message in database
        const newMessage = await Message.create({
          conversation: conversationId,
          sender: socket.userId,
          content: message,
          type: 'text',
          readBy: [{ user: socket.userId, readAt: new Date() }]
        });

        // Update conversation's last message
        conversation.lastMessage = newMessage._id;
        conversation.lastMessageTimestamp = newMessage.createdAt;
        await conversation.save();

        // Format message
        const formattedMessage = {
          id: newMessage._id.toString(),
          conversationId: conversationId,
          content: newMessage.content,
          senderId: socket.userId,
          senderName: socket.userInfo.name,
          senderAvatar: socket.userInfo.avatar,
          timestamp: newMessage.createdAt.toISOString(),
          status: 'sent',
          type: 'text',
          tempId
        };

        // Send confirmation to sender
        socket.emit('message-sent', formattedMessage);

        // Send message to all users in the conversation room (including sender for other devices)
        io.to(conversationId).emit('receive-message', formattedMessage);

        // Send notification to recipient if they're online but not in the room
        if (recipientId) {
          const recipient = onlineUsers.get(recipientId);
          if (recipient) {
            io.to(recipient.socketId).emit('new-message-notification', {
              conversationId,
              message: formattedMessage,
              sender: socket.userInfo
            });
          }
        }

        console.log(`✅ Message saved and sent: ${newMessage._id}`);

      } catch (error) {
        console.error('❌ Error sending message:', error);
        socket.emit('message-error', { 
          tempId,
          message: 'Failed to send message',
          error: error.message 
        });
      }
    });

    // TYPING INDICATORS
    socket.on('typing-start', (data) => {
      const { conversationId, recipientId } = data;
      console.log(`⌨️ ${socket.userInfo.name} is typing in ${conversationId}`);
      
      // Send to specific recipient if provided
      if (recipientId) {
        const recipient = onlineUsers.get(recipientId);
        if (recipient) {
          io.to(recipient.socketId).emit('user-typing', {
            conversationId,
            userId: socket.userId,
            userName: socket.userInfo.name,
            isTyping: true
          });
        }
      } else {
        // Broadcast to conversation room
        socket.to(conversationId).emit('user-typing', {
          conversationId,
          userId: socket.userId,
          userName: socket.userInfo.name,
          isTyping: true
        });
      }
    });

    socket.on('typing-stop', (data) => {
      const { conversationId, recipientId } = data;
      
      if (recipientId) {
        const recipient = onlineUsers.get(recipientId);
        if (recipient) {
          io.to(recipient.socketId).emit('user-typing', {
            conversationId,
            userId: socket.userId,
            isTyping: false
          });
        }
      } else {
        socket.to(conversationId).emit('user-typing', {
          conversationId,
          userId: socket.userId,
          isTyping: false
        });
      }
    });

    // MARK AS READ
    socket.on('mark-as-read', async (data) => {
      const { conversationId, messageIds } = data;
      console.log(`✅ Marking ${messageIds?.length || 0} messages as read in ${conversationId}`);

      try {
        // Mark messages as read
        await Message.updateMany(
          {
            _id: { $in: messageIds },
            conversation: conversationId
          },
          {
            $addToSet: { readBy: { user: socket.userId, readAt: new Date() } }
          }
        );

        // Notify sender(s) that messages were read
        socket.to(conversationId).emit('messages-read', {
          conversationId,
          messageIds,
          readBy: socket.userId
        });

      } catch (error) {
        console.error('❌ Error marking as read:', error);
      }
    });

    // GET ONLINE USERS
    socket.on('get-online-users', () => {
      socket.emit('online-users', Array.from(onlineUsers.values()).map(u => u.userInfo));
    });

    // DISCONNECT
    socket.on('disconnect', async () => {
      console.log(`👋 User disconnected: ${socket.userInfo.name}`);

      // Remove from online users
      onlineUsers.delete(socket.userId);

      // Update user status in database
      try {
        await User.findByIdAndUpdate(socket.userId, {
          socketId: null,
          status: 'offline',
          lastSeen: new Date()
        });
      } catch (error) {
        console.error('Error updating user status:', error);
      }

      // Broadcast updated online users list
      broadcastOnlineUsers(io);

      // Notify others that this user is offline
      socket.broadcast.emit('user-status-change', {
        userId: socket.userId,
        status: 'offline',
        lastSeen: new Date().toISOString()
      });
    });

    // ERROR HANDLING
    socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
    });
  });

  // Helper function to broadcast online users
  function broadcastOnlineUsers(io) {
    const users = Array.from(onlineUsers.values()).map(u => u.userInfo);
    io.emit('online-users', users);
    console.log(`👥 Broadcasting ${users.length} online users`);
  }

  return io;
}

module.exports = { initializeWebSocket };
