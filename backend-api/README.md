# Radio Istic Backend API

Backend REST API for Radio Istic Dashboard with MongoDB, JWT authentication, and real-time chat support.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm
- MongoDB Atlas account (or local MongoDB)
- (Optional) Cloudinary account for media uploads

### Installation

1. **Navigate to backend-api folder**:
   ```powershell
   cd backend-api
   ```

2. **Install dependencies**:
   ```powershell
   npm install
   ```

3. **Configure environment variables**:
   - Copy `.env.example` to `.env`
   - Update with your credentials:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/radio-istic
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the server**:
   ```powershell
   # Development (with nodemon)
   npm run dev

   # Production
   npm start
   ```

5. **Verify server is running**:
   - Open http://localhost:5000/api/health
   - Should see: `{"status":"OK","message":"Radio Istic API is running"}`

---

## 📚 API Documentation

### Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://radio-istic-api.onrender.com/api`

### Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Auth Endpoints

### Register New User

```http
POST /api/auth/register
```

**Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "field": "GLSI",
  "year": 2,
  "phone": "+216 12 345 678",
  "motivation": "I want to contribute to the club",
  "projects": "Built a chatbot",
  "skills": "JavaScript, React, Node.js"
}
```

**Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { /* user object */ }
}
```

### Login

```http
POST /api/auth/login
```

**Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { /* user object */ }
}
```

### Get Current User

```http
GET /api/auth/me
```

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "member",
    "points": 0,
    "status": "offline"
  }
}
```

### Update Profile

```http
PUT /api/auth/update-profile
```

**Headers**: `Authorization: Bearer <token>`

**Body**: Any of these fields
```json
{
  "firstName": "John",
  "phone": "+216 12 345 678",
  "motivation": "Updated motivation",
  "avatar": "/avatars/new-avatar.jpg"
}
```

### Change Password

```http
PUT /api/auth/change-password
```

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

---

## 👥 Members Endpoints

### Get All Members

```http
GET /api/members?field=GLSI&year=2&status=online&search=john&page=1&limit=20
```

**Query Parameters**:
- `field` - Filter by field (GLSI, IRS, LISI, LAI, IOT, LT)
- `year` - Filter by year (1, 2, 3)
- `status` - Filter by status (online, offline)
- `search` - Search by name or email
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)
- `sort` - Sort field (default: -points)

**Response**:
```json
{
  "success": true,
  "count": 20,
  "total": 42,
  "page": 1,
  "pages": 3,
  "members": [ /* array of members */ ]
}
```

### Get Member by ID

```http
GET /api/members/:id
```

### Get Leaderboard

```http
GET /api/members/leaderboard?limit=10
```

Returns top members sorted by points.

### Get Bureau Members

```http
GET /api/members/bureau
```

Returns all bureau members with their roles.

### Get Member Statistics

```http
GET /api/members/stats
```

Returns member counts by field, year, online status, etc.

### Update Member Points (Admin)

```http
PUT /api/members/:id/points
```

**Headers**: `Authorization: Bearer <token>` (admin/president only)

**Body**:
```json
{
  "points": 50,
  "action": "add"  // "add", "subtract", or "set"
}
```

### Update Member Role (Admin)

```http
PUT /api/members/:id/role
```

**Headers**: `Authorization: Bearer <token>` (admin only)

**Body**:
```json
{
  "role": "events-organizer",
  "isBureau": true
}
```

---

## 💬 Chat Endpoints

All chat endpoints require authentication.

### Get All Conversations

```http
GET /api/chat/conversations
```

**Headers**: `Authorization: Bearer <token>`

Returns all conversations for the logged-in user with unread counts.

### Get Conversation with Messages

```http
GET /api/chat/conversations/:id
```

**Headers**: `Authorization: Bearer <token>`

Returns conversation details and all messages. Automatically marks messages as read.

### Create/Get Conversation

```http
POST /api/chat/conversations
```

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "participantIds": ["userId1", "userId2"],
  "isGroup": false,
  "groupName": "Optional group name"
}
```

Finds existing conversation or creates new one.

### Send Message

```http
POST /api/chat/messages
```

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "conversationId": "conversationId",
  "content": "Hello, how are you?",
  "type": "text"
}
```

### Mark Message as Read

```http
PUT /api/chat/messages/:id/read
```

**Headers**: `Authorization: Bearer <token>`

### Delete Message

```http
DELETE /api/chat/messages/:id
```

**Headers**: `Authorization: Bearer <token>` (sender only)

Soft deletes the message.

### Get Unread Count

```http
GET /api/chat/unread-count
```

**Headers**: `Authorization: Bearer <token>`

Returns total unread message count across all conversations.

---

## 📅 Events Endpoints

### Get All Events

```http
GET /api/events?category=Sport&status=published&upcoming=true&page=1&limit=20
```

**Query Parameters**:
- `category` - Filter by category (Sport, Podcast, Social Events, Voyage, Training)
- `status` - Filter by status (draft, published, ongoing, completed, cancelled)
- `upcoming` - If true, only show future events (default: false)
- `page` - Page number
- `limit` - Items per page

### Get Event by ID

```http
GET /api/events/:id
```

Returns event details with participants and waitlist.

### Create Event (Organizer)

```http
POST /api/events
```

**Headers**: `Authorization: Bearer <token>` (events-organizer/admin/president)

**Body**:
```json
{
  "title": "Football Tournament",
  "description": "Annual football tournament",
  "category": "Sport",
  "startDate": "2025-12-01T10:00:00Z",
  "endDate": "2025-12-01T18:00:00Z",
  "location": "ISTIC Sports Complex",
  "maxParticipants": 50,
  "pointsReward": 10,
  "image": "/events/football-tournament.jpg"
}
```

### Update Event

```http
PUT /api/events/:id
```

**Headers**: `Authorization: Bearer <token>` (event organizer/admin/president)

### Register for Event

```http
POST /api/events/:id/register
```

**Headers**: `Authorization: Bearer <token>`

Registers current user for the event. If full, adds to waitlist.

### Unregister from Event

```http
POST /api/events/:id/unregister
```

**Headers**: `Authorization: Bearer <token>`

### Delete Event

```http
DELETE /api/events/:id
```

**Headers**: `Authorization: Bearer <token>` (event organizer/admin/president)

### Get Event Statistics

```http
GET /api/events/stats/overview
```

Returns event counts by category and status.

---

## 🎨 Media Endpoints (Placeholder)

These endpoints are placeholders for future Cloudinary integration.

### Get All Media

```http
GET /api/media
```

### Upload Media (Media Manager)

```http
POST /api/media/upload
```

**Headers**: `Authorization: Bearer <token>` (media-responsable/admin)

### Delete Media

```http
DELETE /api/media/:id
```

**Headers**: `Authorization: Bearer <token>` (media-responsable/admin)

---

## 🤝 Sponsors Endpoints (Placeholder)

Placeholder endpoints for sponsor management.

### Get All Sponsors

```http
GET /api/sponsors
```

### Add Sponsor

```http
POST /api/sponsors
```

**Headers**: `Authorization: Bearer <token>` (sponsor-manager/admin/president)

### Update Sponsor

```http
PUT /api/sponsors/:id
```

**Headers**: `Authorization: Bearer <token>` (sponsor-manager/admin/president)

### Delete Sponsor

```http
DELETE /api/sponsors/:id
```

**Headers**: `Authorization: Bearer <token>` (sponsor-manager/admin/president)

---

## 📊 Database Models

### User Model

```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  avatar: String,
  field: Enum ['GLSI', 'IRS', 'LISI', 'LAI', 'IOT', 'LT'],
  year: Number (1-3),
  motivation: String,
  projects: String,
  skills: String,
  role: Enum [roles...],
  isBureau: Boolean,
  points: Number,
  status: Enum ['online', 'offline'],
  isActive: Boolean,
  lastLogin: Date,
  socketId: String
}
```

### Message Model

```javascript
{
  conversation: ObjectId (ref: Conversation),
  sender: ObjectId (ref: User),
  content: String,
  type: Enum ['text', 'image', 'file', 'system'],
  mediaUrl: String,
  readBy: [{ user: ObjectId, readAt: Date }],
  isDeleted: Boolean,
  timestamps: true
}
```

### Conversation Model

```javascript
{
  participants: [ObjectId] (ref: User),
  isGroup: Boolean,
  groupName: String,
  lastMessage: ObjectId (ref: Message),
  lastMessageTimestamp: Date,
  unreadCounts: Map<userId, count>
}
```

### Event Model

```javascript
{
  title: String,
  description: String,
  category: Enum ['Sport', 'Podcast', 'Social Events', 'Voyage', 'Social', 'Training'],
  startDate: Date,
  endDate: Date,
  location: String,
  image: String,
  maxParticipants: Number,
  participants: [ObjectId] (ref: User),
  waitlist: [ObjectId] (ref: User),
  organizer: ObjectId (ref: User),
  status: Enum ['draft', 'published', 'ongoing', 'completed', 'cancelled'],
  pointsReward: Number
}
```

---

## 🚀 Deployment

### Deploy to Render.com

1. **Create new Web Service** on Render
2. **Connect GitHub repository**
3. **Configure service**:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node
4. **Add environment variables**:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL`
   - `NODE_ENV=production`
5. **Deploy**

### MongoDB Atlas Setup

1. Create free cluster at mongodb.com
2. Create database user
3. Whitelist IP addresses (or 0.0.0.0/0 for all)
4. Get connection string
5. Add to `.env` as `MONGODB_URI`

---

## 🔒 Security Notes

- All passwords are hashed with bcrypt (10 salt rounds)
- JWT tokens expire in 7 days (configurable)
- Protected routes verify token and user existence
- Role-based authorization on sensitive endpoints
- Input validation with express-validator
- CORS configured for frontend URL only

---

## 🛠️ Development

### Project Structure

```
backend-api/
├── config/
│   └── database.js          # MongoDB connection
├── middleware/
│   ├── auth.js              # JWT auth & authorization
│   └── validate.js          # Request validation
├── models/
│   ├── User.js              # User schema
│   ├── Message.js           # Message schema
│   ├── Conversation.js      # Conversation schema
│   └── Event.js             # Event schema
├── routes/
│   ├── auth.js              # Auth routes
│   ├── members.js           # Member routes
│   ├── chat.js              # Chat routes
│   ├── events.js            # Event routes
│   ├── media.js             # Media routes (placeholder)
│   └── sponsors.js          # Sponsor routes (placeholder)
├── server.js                # Express server
├── package.json             # Dependencies
├── .env.example             # Environment template
└── README.md                # This file
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

---

## 📝 TODO

- [ ] Implement Cloudinary integration for media uploads
- [ ] Add Sponsor model and full CRUD operations
- [ ] Add email notifications for events
- [ ] Implement password reset flow
- [ ] Add rate limiting for API endpoints
- [ ] Add API request logging
- [ ] Add unit tests with Jest
- [ ] Add API documentation with Swagger

---

## 🤝 Contributing

1. Follow existing code structure
2. Use async/await for async operations
3. Add proper error handling
4. Validate all inputs
5. Test endpoints with Postman/Insomnia
6. Document new endpoints in this README

---

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Contact Radio Istic development team

---

**Built with ❤️ for Radio Istic @ ISTIC Borj Cédria**
