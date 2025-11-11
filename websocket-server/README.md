# Radio Istic WebSocket Server# Radio Istic WebSocket Server



Real-time WebSocket server for Radio Istic Dashboard with MongoDB message persistence.## Deployment to Render.com



## 🚀 Quick Start1. Push this folder to GitHub

2. Go to Render.com Dashboard

### Prerequisites3. Click "New +" → "Web Service"

4. Connect your GitHub repository

- Node.js 18+ and npm5. Configure:

- MongoDB Atlas (same database as backend-api)   - **Name**: radio-istic-websocket

- Running backend-api (for user authentication)   - **Environment**: Node

   - **Build Command**: `npm install`

### Installation   - **Start Command**: `npm start`

   - **Plan**: Free

1. **Navigate to websocket-server folder**:6. Add Environment Variables (if needed)

   ```powershell7. Deploy

   cd websocket-server

   ```## Your Server URL

After deployment, you'll get: `https://radio-istic-websocket.onrender.com`

2. **Install dependencies**:

   ```powershellUse this URL in your frontend configuration.

   npm install

   ```## Local Development



3. **Configure environment variables**:```bash

   - Copy `.env.example` to `.env`npm install

   - Add your MongoDB URI (same as backend-api):npm run dev

   ```env```

   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/radio-istic

   PORT=3001Server will run on http://localhost:3001

   ALLOWED_ORIGINS=http://localhost:3000,https://radioistic.netlify.app

   ```## Testing



4. **Start the server**:Open browser console and test connection:

   ```powershell```javascript

   # Development (with nodemon)const socket = io('http://localhost:3001');

   npm run devsocket.on('connect', () => console.log('Connected!'));

```

   # Production
   npm start
   ```

5. **Verify server is running**:
   - Open http://localhost:3001/health
   - Should see: `{"status":"healthy","uptime":...}`

---

## 🔌 WebSocket Events

### Client → Server Events

#### `authenticate`
Authenticate user when connecting.

```javascript
socket.emit('authenticate', {
  id: 'userId',
  email: 'user@example.com',
  name: 'John Doe',
  avatar: '/avatars/john.jpg'
});
```

**Response**: 
- `online-users` - List of currently online users
- Broadcasts `user-status-change` to all clients

---

#### `join-conversation`
Join a conversation room and load message history.

```javascript
socket.emit('join-conversation', {
  conversationId: '507f1f77bcf86cd799439011',
  userId: 'userId'
});
```

**Response**:
```javascript
socket.on('conversation-history', (data) => {
  console.log(data.conversationId);
  console.log(data.messages); // Array of last 100 messages
});
```

---

#### `send-message`
Send a message in a conversation.

```javascript
socket.emit('send-message', {
  conversationId: '507f1f77bcf86cd799439011',
  recipientId: 'recipientUserId',
  message: 'Hello, how are you?',
  senderId: 'currentUserId',
  senderName: 'John Doe'
});
```

**Responses**:
- `message-sent` - Confirmation to sender
- `receive-message` - Message broadcast to conversation room
- `message-delivered` - Delivery confirmation (if recipient online)

Message is **automatically saved to MongoDB** with:
- Unique `_id` from database
- Timestamp
- Read receipts tracking
- Conversation reference

---

#### `typing-start`
Notify that user is typing.

```javascript
socket.emit('typing-start', {
  conversationId: '507f1f77bcf86cd799439011',
  recipientId: 'recipientUserId',
  userName: 'John Doe'
});
```

**Response**: Recipient receives `user-typing` event.

---

#### `typing-stop`
Notify that user stopped typing.

```javascript
socket.emit('typing-stop', {
  conversationId: '507f1f77bcf86cd799439011',
  recipientId: 'recipientUserId'
});
```

---

#### `mark-as-read`
Mark messages as read.

```javascript
socket.emit('mark-as-read', {
  conversationId: '507f1f77bcf86cd799439011',
  messageIds: ['msgId1', 'msgId2'],
  userId: 'currentUserId',
  recipientId: 'senderId'
});
```

**Database Effect**: Updates `readBy` array in MongoDB for each message.

**Response**: Broadcasts `messages-read` to conversation room.

---

### Server → Client Events

#### `online-users`
Sent after authentication with list of online users.

```javascript
socket.on('online-users', (users) => {
  // Array of { id, name, email, avatar, online }
});
```

---

#### `user-status-change`
Broadcast when any user goes online/offline.

```javascript
socket.on('user-status-change', (data) => {
  console.log(data.userId);
  console.log(data.status); // 'online' or 'offline'
  console.log(data.timestamp);
});
```

---

#### `conversation-history`
Message history loaded when joining a conversation.

```javascript
socket.on('conversation-history', (data) => {
  console.log(data.conversationId);
  console.log(data.messages); // Last 100 messages, oldest first
});
```

Message format:
```javascript
{
  id: 'mongodbId',
  conversationId: 'convId',
  content: 'Message text',
  senderId: 'userId',
  senderName: 'John Doe',
  senderAvatar: '/avatars/john.jpg',
  timestamp: '2025-11-11T10:30:00.000Z',
  type: 'text',
  readBy: ['userId1', 'userId2']
}
```

---

#### `receive-message`
New message in conversation.

```javascript
socket.on('receive-message', (message) => {
  // Same format as conversation-history messages
});
```

---

#### `message-sent`
Confirmation that your message was sent.

```javascript
socket.on('message-sent', (message) => {
  // Message with MongoDB _id
});
```

---

#### `message-delivered`
Confirmation that message was delivered to recipient.

```javascript
socket.on('message-delivered', (data) => {
  console.log(data.messageId);
  console.log(data.status); // 'delivered'
});
```

---

#### `messages-read`
Notification that messages were read.

```javascript
socket.on('messages-read', (data) => {
  console.log(data.conversationId);
  console.log(data.messageIds);
  console.log(data.readBy); // userId who read
  console.log(data.readAt); // timestamp
});
```

---

#### `user-typing`
Notification that someone is typing.

```javascript
socket.on('user-typing', (data) => {
  console.log(data.conversationId);
  console.log(data.userName);
  console.log(data.isTyping); // true or false
});
```

---

#### `error`
Error notification.

```javascript
socket.on('error', (error) => {
  console.error(error.message);
});
```

---

## 📊 Database Integration

### Collections Used

The WebSocket server uses the same MongoDB database as the backend-api:

#### **messages**
- Stores all chat messages permanently
- Indexed by `conversation` and `createdAt`
- Supports read receipts per user
- Soft delete capability

#### **conversations**
- Stores conversation metadata
- Tracks participants
- Last message reference
- Unread counts per user

#### **users**
- Real-time status updates (online/offline)
- Socket ID tracking
- Last seen timestamp

### Message Persistence Flow

1. **User sends message** via `send-message` event
2. **Server creates Message document** in MongoDB
3. **Server updates Conversation** last message
4. **Server broadcasts** message with MongoDB `_id`
5. **Message persists** across sessions

### Loading History

1. **User joins conversation** via `join-conversation`
2. **Server queries** last 100 messages from MongoDB
3. **Server populates** sender details
4. **Server emits** `conversation-history` to client
5. **Client displays** persistent message history

---

## 🏗️ Architecture

### Dual Storage Strategy

- **In-Memory**: Fast lookups for online users, socket IDs
- **MongoDB**: Persistent storage for messages, conversations

### Connection Flow

```
Frontend                WebSocket Server              MongoDB
   |                           |                          |
   |---- connect ------------>|                          |
   |                           |                          |
   |---- authenticate -------->|                          |
   |                           |-- update user status -->|
   |<--- online-users ---------|                          |
   |                           |                          |
   |---- join-conversation --->|                          |
   |                           |-- query messages ------->|
   |                           |<-- return history -------|
   |<--- conversation-history -|                          |
   |                           |                          |
   |---- send-message -------->|                          |
   |                           |-- save message --------->|
   |                           |<-- return _id -----------|
   |<--- message-sent ---------|                          |
   |<--- receive-message ------|                          |
```

### Graceful Degradation

If MongoDB connection fails:
- ✅ WebSocket server continues running
- ✅ Real-time messaging still works
- ❌ Messages not persisted to database
- ❌ History not available on reload

---

## 🚀 Deployment

### Deploy to Render.com

1. **Same account as backend-api**
2. **New Web Service**:
   - Name: radio-istic-websocket
   - Repository: (same as backend-api)
   - Root Directory: `websocket-server`
   - Build Command: `npm install`
   - Start Command: `npm start`
3. **Environment Variables**:
   - `MONGODB_URI`: (same as backend-api)
   - `PORT`: 3001
   - `NODE_ENV`: production
   - `ALLOWED_ORIGINS`: https://radioistic.netlify.app
4. **Deploy**

### Post-Deployment

1. Note WebSocket URL: `wss://radio-istic.onrender.com`
2. Update frontend `NEXT_PUBLIC_SOCKET_URL` environment variable
3. Test connection from frontend
4. Monitor logs for MongoDB connection success

---

## 🧪 Testing

### Test with Socket.IO Client

```javascript
const io = require('socket.io-client');

const socket = io('http://localhost:3001', {
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('Connected:', socket.id);
  
  // Authenticate
  socket.emit('authenticate', {
    id: 'testUserId',
    email: 'test@example.com',
    name: 'Test User',
    avatar: '/avatars/test.jpg'
  });
});

socket.on('online-users', (users) => {
  console.log('Online users:', users);
});

// Join conversation
socket.emit('join-conversation', {
  conversationId: 'convId123',
  userId: 'testUserId'
});

socket.on('conversation-history', (data) => {
  console.log('History:', data.messages);
});

// Send message
socket.emit('send-message', {
  conversationId: 'convId123',
  recipientId: 'recipientId',
  message: 'Test message',
  senderId: 'testUserId',
  senderName: 'Test User'
});

socket.on('message-sent', (msg) => {
  console.log('Message saved with ID:', msg.id);
});
```

---

## 🔧 Development

### Project Structure

```
websocket-server/
├── config/
│   └── database.js         # MongoDB connection
├── models/
│   ├── User.js            # User schema
│   ├── Message.js         # Message schema
│   └── Conversation.js    # Conversation schema
├── server.js              # Main WebSocket server
├── package.json           # Dependencies
├── .env.example           # Environment template
└── render.yaml            # Render deployment config
```

### Available Scripts

```powershell
# Development with hot reload
npm run dev

# Production
npm start

# Build (no-op, satisfies Render)
npm run build
```

### Environment Variables

```env
# Required
MONGODB_URI=mongodb+srv://...         # Same as backend-api
PORT=3001                              # WebSocket server port

# Optional
NODE_ENV=development                   # development or production
ALLOWED_ORIGINS=http://localhost:3000  # Comma-separated CORS origins
```

---

## 🐛 Troubleshooting

### "MongoDB connection failed"
- Check `MONGODB_URI` is correct (same as backend-api)
- Verify MongoDB Atlas IP whitelist includes Render IPs (or 0.0.0.0/0)
- Server continues without persistence

### "CORS error"
- Verify `ALLOWED_ORIGINS` includes your frontend URL
- Check for trailing slashes
- Ensure frontend uses same protocol (http/https)

### "Messages not persisting"
- Check MongoDB connection logs
- Verify `Message.db.readyState === 1` (connected)
- Check conversation exists in database

### "History not loading"
- User must call `join-conversation` before messages arrive
- Check conversationId matches database
- Verify conversation has messages

### "Connection drops immediately"
- Check Render logs for errors
- Verify environment variables set correctly
- Test health endpoint: /health

---

## 📝 Differences from Backend API

| Feature | Backend API (REST) | WebSocket Server |
|---------|-------------------|------------------|
| Purpose | CRUD operations | Real-time messaging |
| Protocol | HTTP/HTTPS | WebSocket (wss://) |
| Port | 5000 | 3001 |
| Database | Full CRUD via Mongoose | Read/Write messages only |
| Authentication | JWT tokens | Socket authentication event |
| Deployment | Separate Render service | Separate Render service |
| Persistence | All data | Messages + user status |

Both services connect to **the same MongoDB database** but serve different purposes.

---

## ✅ Features Implemented

- ✅ MongoDB integration with graceful degradation
- ✅ Message persistence to database
- ✅ Conversation history loading (last 100 messages)
- ✅ Real-time message broadcasting
- ✅ Read receipts with database sync
- ✅ User online/offline status tracking
- ✅ Typing indicators
- ✅ Socket room management per conversation
- ✅ Auto-create conversations on first message
- ✅ Error handling and logging
- ✅ CORS configuration
- ✅ Health check endpoint
- ✅ Render deployment config

---

## 🔮 Future Enhancements

- [ ] Add message encryption
- [ ] Implement message editing
- [ ] Add file upload support
- [ ] Implement group chat rooms
- [ ] Add voice message support
- [ ] Implement message reactions
- [ ] Add push notifications
- [ ] Implement rate limiting
- [ ] Add Redis for scaling multiple servers

---

## 📞 Questions?

For issues or questions:
- Check server logs for detailed errors
- Verify MongoDB connection string
- Test with Socket.IO client library
- Review this documentation

**Ready for Priority 4: Update Frontend to Use Real API?**

Let me know when you're ready to continue! 🚀
