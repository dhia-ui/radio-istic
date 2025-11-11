# Chat Integration - Real-time Messaging with WebSocket

## Overview
This document describes how the Radio Istic dashboard integrates real-time chat functionality using WebSocket for live messaging and MongoDB for message persistence.

## Architecture

### Components
1. **WebSocket Server** (`websocket-server/`) - Socket.IO server with MongoDB persistence
2. **WebSocket Context** (`lib/websocket-context.tsx`) - React context managing WebSocket connection
3. **Chat State** (`components/chat/use-chat-state.ts`) - Zustand store for chat UI state
4. **Chat Components** (`components/chat/`) - UI components for chat interface

### Data Flow
```
User types message → Chat Component → Chat State → WebSocket Context
                                                        ↓
                                                   Socket.IO Client
                                                        ↓
                                                   WebSocket Server
                                                        ↓
                                                   MongoDB (persist)
                                                        ↓
                                                   Broadcast to recipients
                                                        ↓
Recipient receives → WebSocket Context → Chat State → UI updates
```

## WebSocket Context (`lib/websocket-context.tsx`)

### Features
- **Automatic connection** when user is authenticated
- **Join/Leave conversations** to load history and receive live updates
- **Message history** loaded from MongoDB (last 100 messages per conversation)
- **Online status tracking** for all users
- **Typing indicators** to show when someone is typing
- **Read receipts** to mark messages as read
- **Message status updates** (sending → sent → delivered → read)

### Key Functions

#### `join(conversationId: string)`
Joins a conversation room and loads message history.
```typescript
join("conv-123")
// Server responds with 'conversation-history' event containing last 100 messages
```

#### `leave(conversationId: string)`
Leaves a conversation room.
```typescript
leave("conv-123")
```

#### `sendMessage(recipientId: string, message: string, conversationId: string)`
Sends a message to a recipient.
```typescript
sendMessage("user-456", "Hello!", "conv-123")
```

#### `markAsRead(conversationId: string, messageIds?: string[])`
Marks messages as read.
```typescript
markAsRead("conv-123") // Marks all messages in conversation
markAsRead("conv-123", ["msg-1", "msg-2"]) // Marks specific messages
```

#### `typing(conversationId: string, isTyping: boolean, recipientId: string)`
Broadcasts typing status to recipient.
```typescript
typing("conv-123", true, "user-456")  // Started typing
typing("conv-123", false, "user-456") // Stopped typing
```

### State Variables

#### `conversationHistories: Record<string, Message[]>`
Stores message history for each conversation loaded from server.
```typescript
{
  "conv-123": [
    { id: "msg-1", content: "Hello", senderId: "user-1", ... },
    { id: "msg-2", content: "Hi!", senderId: "user-2", ... }
  ]
}
```

#### `messages: Message[]`
Real-time messages received during current session.

#### `onlineUsers: string[]`
Array of user IDs currently online.

#### `typingUsers: Record<string, boolean>`
Map of conversation IDs to typing status.

## Chat State (`components/chat/use-chat-state.ts`)

### Features
- **Local conversation state** with messages
- **Optimistic UI updates** (message appears immediately)
- **Message status tracking** (sending → sent → delivered → read)
- **Reply functionality** to reply to specific messages
- **Conversation management** (open, close, navigate)

### Key Functions

#### `setCurrentUserId(userId: string)`
Sets the current user ID for determining message ownership.

#### `updateConversationMessages(conversationId: string, messages: ChatMessage[])`
Replaces all messages in a conversation (used when loading history).

#### `addMessage(conversationId: string, message: ChatMessage)`
Adds a new message to a conversation (used for real-time messages).

#### `updateMessageStatus(messageId: string, status: "sending" | "sent" | "delivered" | "read")`
Updates the status of a message.

#### `handleSendMessage()`
Prepares and returns a message object to send via WebSocket.

## Chat Component Integration (`components/chat/index.tsx`)

### Initialization Flow

1. **Set current user ID**
   ```typescript
   useEffect(() => {
     if (user?.id) {
       setCurrentUserId(user.id);
     }
   }, [user?.id]);
   ```

2. **Load conversation history**
   ```typescript
   useEffect(() => {
     if (activeConversation && conversationHistories[activeConversation.id]) {
       const history = conversationHistories[activeConversation.id];
       updateConversationMessages(activeConversation.id, transformedHistory);
     }
   }, [conversationHistories, activeConversation?.id]);
   ```

3. **Handle real-time messages**
   ```typescript
   useEffect(() => {
     wsMessages.forEach((wsMsg) => {
       addMessage(wsMsg.conversationId, transformedMessage);
     });
   }, [wsMessages]);
   ```

4. **Join/Leave conversations**
   ```typescript
   useEffect(() => {
     if (currentConversationId) {
       join(currentConversationId);
       markAsRead(currentConversationId);
     }
     return () => {
       if (previousConversationId) {
         leave(previousConversationId);
       }
     };
   }, [activeConversation?.id]);
   ```

### Sending Messages

```typescript
const handleSend = () => {
  const result = handleSendMessage(); // Prepare message
  if (!result) return;
  
  const { message, conversationId } = result;
  const recipient = findRecipient(conversationId);
  
  // Send via WebSocket
  sendMessage(recipient.id, message.content, conversationId);
  
  // Update status after sending
  setTimeout(() => {
    updateMessageStatus(message.id, "sent");
  }, 300);
};
```

## Message Persistence

### MongoDB Schema
```javascript
{
  _id: ObjectId,
  conversationId: String,
  senderId: String,
  content: String,
  timestamp: Date,
  status: String, // 'sent', 'delivered', 'read'
  createdAt: Date,
  updatedAt: Date
}
```

### History Loading
- When a user joins a conversation, the server queries MongoDB for the last 100 messages
- Messages are sorted by timestamp (newest first)
- History is sent via `conversation-history` event
- Frontend updates the conversation with historical messages

## WebSocket Events

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `authenticate` | `{ id, email, name, avatar }` | Authenticate user on connection |
| `join-conversation` | `{ conversationId, userId }` | Join conversation and load history |
| `leave-conversation` | `{ conversationId, userId }` | Leave conversation room |
| `send-message` | `{ conversationId, recipientId, message, senderId, senderName }` | Send a message |
| `typing-start` | `{ conversationId, recipientId, userName }` | Start typing indicator |
| `typing-stop` | `{ conversationId, recipientId }` | Stop typing indicator |
| `mark-as-read` | `{ conversationId, messageIds, recipientId }` | Mark messages as read |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `online-users` | `Array<User>` | List of currently online users |
| `user-status-change` | `{ userId, status }` | User came online/offline |
| `conversation-history` | `{ conversationId, messages }` | Historical messages (last 100) |
| `receive-message` | `Message` | New message received |
| `message-sent` | `Message` | Confirmation message was sent |
| `message-delivered` | `{ messageId }` | Message was delivered |
| `messages-read` | `{ messageIds }` | Messages were read |
| `user-typing` | `{ conversationId, isTyping }` | Someone is typing |

## Authentication Flow

1. User logs in → JWT token stored
2. WebSocket connects → `authenticate` event with user data
3. Server validates user → adds to online users list
4. Server broadcasts `user-status-change` to all connected clients
5. User opens conversation → `join-conversation` event
6. Server loads history from MongoDB → emits `conversation-history`
7. Frontend displays historical and real-time messages

## Environment Variables

```bash
# Frontend (.env.local)
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001  # Dev
# NEXT_PUBLIC_SOCKET_URL=https://radio-istic.onrender.com  # Production

# WebSocket Server (.env)
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/radio-istic
NODE_ENV=development
```

## Error Handling

### Connection Errors
- Automatic reconnection with exponential backoff
- Maximum 5 reconnection attempts
- User notified if connection fails

### Message Sending Errors
- Optimistic UI update (message shows immediately)
- Status changes from "sending" → "sent" → "delivered" → "read"
- If sending fails, status shows "failed"
- Toast notification shows error to user

### History Loading Errors
- If history fails to load, show empty conversation
- User can still send new messages
- Messages persist even if history doesn't load

## Testing

### Manual Testing Steps

1. **Authentication**
   - Login with valid credentials
   - Check WebSocket connection in console: "✅ WebSocket connected"
   - Verify user appears in online users list

2. **Message History**
   - Open an existing conversation
   - Verify last 100 messages load
   - Check messages are in correct order (oldest → newest)

3. **Send Message**
   - Type a message and send
   - Message appears immediately with "sending" status
   - Status changes to "sent" after server confirmation
   - Message persists after page refresh

4. **Real-time Updates**
   - Open same conversation in two browser windows
   - Send message in window 1
   - Verify it appears in window 2 instantly

5. **Read Receipts**
   - Send message to another user
   - Other user opens conversation
   - Message status changes to "read"

6. **Typing Indicators**
   - Open conversation in two windows
   - Start typing in window 1
   - Typing indicator appears in window 2

7. **Online Status**
   - User comes online → green dot appears
   - User goes offline → gray dot appears
   - Status updates in real-time

## Troubleshooting

### Messages not sending
1. Check WebSocket connection: `isConnected` should be `true`
2. Verify user is authenticated
3. Check browser console for errors
4. Verify recipient ID is correct

### History not loading
1. Check MongoDB connection on server
2. Verify conversation ID exists in database
3. Check server logs for errors
3. Ensure `join-conversation` event is emitted

### Real-time updates not working
1. Verify both users are in the same conversation room
2. Check WebSocket connection for both users
3. Ensure conversation ID matches between users
4. Check server is broadcasting correctly

### User shows as offline
1. Verify WebSocket connection
2. Check `authenticate` event was sent
3. Verify server received authentication
4. Check online users list on server

## Performance Considerations

### Message Pagination
- Currently loads last 100 messages
- For conversations with 1000+ messages, implement pagination
- Load older messages on scroll

### Optimistic Updates
- Messages appear immediately before server confirmation
- Prevents UI lag when sending messages
- Status updates show progression

### Connection Management
- Only one WebSocket connection per user
- Automatic cleanup on component unmount
- Reconnection with exponential backoff

### Memory Management
- Conversation history stored in React state
- Cleared when leaving conversation
- Only active conversation messages in memory

## Future Enhancements

1. **Message Pagination** - Load older messages on demand
2. **File Attachments** - Send images, videos, files
3. **Voice Messages** - Record and send audio
4. **Message Reactions** - React to messages with emojis
5. **Message Editing** - Edit sent messages
6. **Message Deletion** - Delete messages for everyone
7. **Group Chats** - Support for multi-user conversations
8. **Push Notifications** - Desktop/mobile notifications
9. **Voice/Video Calls** - WebRTC integration
10. **Message Search** - Search across all conversations

## Conclusion

The chat integration provides a complete real-time messaging experience with:
- ✅ Persistent message storage in MongoDB
- ✅ Real-time message delivery via WebSocket
- ✅ Message history loading (last 100 messages)
- ✅ Read receipts and message status
- ✅ Online status tracking
- ✅ Typing indicators
- ✅ Optimistic UI updates
- ✅ Automatic reconnection

All messages are stored in MongoDB and synchronized across all connected clients in real-time.
