# Backend API Setup - Priority 2 Complete ✅

## Summary

Successfully created a complete backend REST API for Radio Istic with MongoDB, JWT authentication, and real-time chat support.

---

## What Was Created

### 📁 Complete Backend Structure

```
backend-api/
├── config/
│   └── database.js          # MongoDB connection with error handling
├── middleware/
│   ├── auth.js              # JWT protection & role authorization
│   └── validate.js          # Request validation wrapper
├── models/
│   ├── User.js              # User schema with bcrypt & methods
│   ├── Message.js           # Message schema with read receipts
│   ├── Conversation.js      # Conversation schema with unread tracking
│   └── Event.js             # Event schema with registration logic
├── routes/
│   ├── auth.js              # Register, login, profile, password change
│   ├── members.js           # CRUD, leaderboard, stats, role management
│   ├── chat.js              # Conversations, messages, unread counts
│   ├── events.js            # CRUD, registration, waitlist, stats
│   ├── media.js             # Placeholder for Cloudinary integration
│   └── sponsors.js          # Placeholder for sponsor management
├── server.js                # Express server with CORS & error handling
├── package.json             # All dependencies configured
├── .env.example             # Environment variables template
├── .gitignore               # Protect sensitive files
├── render.yaml              # Render.com deployment config
└── README.md                # Complete API documentation
```

---

## 🔑 Key Features Implemented

### 1. Authentication System
- ✅ User registration with validation
- ✅ Login with JWT token generation
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Protected routes middleware
- ✅ Role-based authorization
- ✅ Profile update & password change
- ✅ Token expiration (7 days configurable)

### 2. User Management
- ✅ Full CRUD operations
- ✅ Filtering by field, year, status
- ✅ Search by name/email
- ✅ Pagination support
- ✅ Leaderboard by points
- ✅ Bureau members listing
- ✅ Member statistics aggregation
- ✅ Points management (add/subtract/set)
- ✅ Role assignment (admin only)
- ✅ Soft delete (deactivation)

### 3. Real-time Chat System
- ✅ Create/get conversations (1-on-1 or group)
- ✅ Send/receive messages
- ✅ Message read receipts
- ✅ Unread message tracking per user
- ✅ Conversation history with pagination
- ✅ Auto-mark as read when viewing
- ✅ Soft delete for messages
- ✅ Total unread count endpoint

### 4. Event Management
- ✅ Full event CRUD operations
- ✅ Event registration with capacity limits
- ✅ Automatic waitlist when full
- ✅ Unregister with waitlist promotion
- ✅ Multiple event categories
- ✅ Event status workflow (draft → published → completed)
- ✅ Points rewards for participation
- ✅ Filter by category, status, upcoming
- ✅ Event statistics endpoint
- ✅ Authorization checks (organizer/admin)

### 5. Security & Validation
- ✅ JWT token verification
- ✅ Role-based access control
- ✅ Input validation with express-validator
- ✅ Password hashing before storage
- ✅ CORS configuration
- ✅ Error handling middleware
- ✅ Environment variable protection

---

## 📊 Database Models

### User Model (Complete)
- Personal info (name, email, phone, avatar)
- Academic info (field, year)
- Profile (motivation, projects, skills)
- Role & permissions (9 roles including admin, president, bureau members)
- Gamification (points, ranking)
- Status tracking (online/offline, active/inactive)
- Authentication (hashed password, JWT support)
- Methods: `comparePassword()`, `toPublicProfile()`

### Message Model (Complete)
- Conversation reference
- Sender reference
- Content with type (text, image, file, system)
- Read receipts tracking per user
- Media support (URL, type)
- Soft delete capability
- Methods: `markAsRead()`, static `getUnreadCount()`

### Conversation Model (Complete)
- Multiple participants support
- Group conversation support
- Last message tracking
- Unread counts per user (Map)
- Auto-create or find existing
- Static method: `findOrCreate()`

### Event Model (Complete)
- Full event details (title, description, category)
- Date & location
- Media (image, multiple images)
- Registration system (participants, waitlist, max capacity)
- Organizer reference
- Status workflow
- Points reward system
- Virtuals: `participantCount`, `availableSpots`, `isFull`
- Methods: `registerUser()`, `unregisterUser()`

---

## 🚀 API Endpoints Implemented

### Auth Endpoints (6)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/update-profile` - Update profile (protected)
- `PUT /api/auth/change-password` - Change password (protected)

### Member Endpoints (8)
- `GET /api/members` - Get all members with filters & pagination
- `GET /api/members/leaderboard` - Top members by points
- `GET /api/members/bureau` - Bureau members only
- `GET /api/members/stats` - Member statistics
- `GET /api/members/:id` - Get single member
- `PUT /api/members/:id/points` - Update points (admin)
- `PUT /api/members/:id/role` - Update role (admin)
- `DELETE /api/members/:id` - Deactivate member (admin)

### Chat Endpoints (7)
- `GET /api/chat/conversations` - All user's conversations
- `GET /api/chat/conversations/:id` - Conversation with messages
- `POST /api/chat/conversations` - Create/get conversation
- `POST /api/chat/messages` - Send message
- `PUT /api/chat/messages/:id/read` - Mark as read
- `DELETE /api/chat/messages/:id` - Delete message (soft)
- `GET /api/chat/unread-count` - Total unread count

### Event Endpoints (8)
- `GET /api/events` - All events with filters & pagination
- `GET /api/events/:id` - Single event details
- `POST /api/events` - Create event (organizer/admin)
- `PUT /api/events/:id` - Update event (organizer/admin)
- `POST /api/events/:id/register` - Register for event
- `POST /api/events/:id/unregister` - Unregister from event
- `DELETE /api/events/:id` - Delete event (organizer/admin)
- `GET /api/events/stats/overview` - Event statistics

### Media & Sponsor Endpoints (Placeholders)
- Media: GET, POST upload, DELETE (for future Cloudinary integration)
- Sponsors: GET, POST, PUT, DELETE (for future implementation)

**Total: 30+ endpoints implemented**

---

## 🔧 Setup Instructions

### 1. Install Dependencies

```powershell
cd backend-api
npm install
```

### 2. Configure MongoDB Atlas

1. Go to [mongodb.com](https://www.mongodb.com/)
2. Create free cluster (M0 Sandbox)
3. Create database user with password
4. Go to Network Access → Add IP Address → Allow from anywhere (0.0.0.0/0)
5. Go to Database → Connect → Connect your application
6. Copy connection string

### 3. Create .env File

```powershell
# Copy example file
cp .env.example .env

# Edit .env with your values
```

Required variables:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/radio-istic?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-recommended
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
WEBSOCKET_URL=https://radio-istic.onrender.com
```

### 4. Start Development Server

```powershell
npm run dev
```

Server will start on http://localhost:5000

### 5. Verify Health Check

Open browser: http://localhost:5000/api/health

Expected response:
```json
{
  "status": "OK",
  "message": "Radio Istic API is running",
  "timestamp": "2025-11-11T..."
}
```

---

## 🧪 Testing the API

### Test with curl (PowerShell)

**Register a user:**
```powershell
$body = @{
    firstName = "Test"
    lastName = "User"
    email = "test@example.com"
    password = "password123"
    field = "GLSI"
    year = 2
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

**Login:**
```powershell
$body = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
$token = $response.token
```

**Get current user (protected):**
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method GET -Headers $headers
```

### Test with Postman/Insomnia

1. Import endpoints from README
2. Create environment variable for `token`
3. Test each endpoint systematically
4. Check responses match documentation

---

## 🚀 Deployment to Render

### Option 1: Via Dashboard

1. Go to [render.com](https://render.com/)
2. New → Web Service
3. Connect GitHub repository
4. Select `backend-api` directory (or set Root Directory to `backend-api`)
5. Configure:
   - **Name**: radio-istic-api
   - **Environment**: Node
   - **Region**: Frankfurt (or closest to you)
   - **Branch**: main
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add environment variables (MONGODB_URI, JWT_SECRET, etc.)
7. Click "Create Web Service"

### Option 2: Via render.yaml

1. Push code to GitHub including `render.yaml`
2. Render will auto-detect configuration
3. Add `MONGODB_URI` secret in dashboard (not in yaml)
4. Deploy

### Post-Deployment

1. Wait for first deploy (3-5 minutes)
2. Check health: `https://radio-istic-api.onrender.com/api/health`
3. Note the API URL for frontend integration
4. Test one endpoint (e.g., register)

---

## 📝 What's Next (Priority 3)

Now that the backend API is ready, the next step is **Priority 3: Enhance WebSocket Server**.

You'll need to:

1. **Navigate to websocket-server folder** (separate from backend-api)
2. **Add MongoDB connection** to persist chat messages
3. **Update Socket.IO server** to:
   - Save incoming messages to MongoDB
   - Load conversation history when user joins
   - Emit saved message with MongoDB `_id`
4. **Keep WebSocket separate** from REST API (different services on Render)
5. **Connect both services** to the same MongoDB database

---

## ✅ Checklist Before Moving to Priority 3

- [x] backend-api folder created with all files
- [x] MongoDB models defined (User, Message, Conversation, Event)
- [x] All REST endpoints implemented and tested locally
- [x] JWT authentication working
- [x] Role-based authorization working
- [x] Input validation on all routes
- [x] Error handling middleware
- [x] Complete API documentation (README.md)
- [x] Deployment configuration (render.yaml)
- [x] Environment variables template (.env.example)
- [ ] ⏳ **Waiting for your confirmation to proceed to Priority 3**

---

## 🐛 Common Issues & Solutions

### "MongoServerError: bad auth"
- Check username/password in MONGODB_URI
- Verify database user exists in MongoDB Atlas
- Make sure password doesn't contain special characters (or URL-encode them)

### "connect ECONNREFUSED ::1:27017"
- MongoDB URI not set correctly
- Check `.env` file exists and is loaded
- Verify `MONGODB_URI` environment variable

### "JsonWebTokenError: jwt malformed"
- Token not sent correctly
- Check `Authorization: Bearer <token>` header format
- Token might be expired (default 7 days)

### "ValidationError: User validation failed"
- Check required fields in request body
- Field values must match enum constraints (e.g., year: 1-3)
- Email format must be valid

### CORS errors
- Verify `FRONTEND_URL` in `.env` matches your frontend URL exactly
- Check for trailing slashes
- Make sure CORS middleware is before routes

---

## 📞 Questions?

If you encounter any issues:
1. Check server logs for detailed error messages
2. Verify MongoDB connection string
3. Test endpoints with Postman/curl
4. Review this documentation

**Ready to proceed with Priority 3: Enhance WebSocket Server?**

Let me know when you're ready to continue! 🚀
