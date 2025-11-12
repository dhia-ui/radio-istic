# 🧪 TESTING CHECKLIST - Radio ISTIC Dashboard

## Overview
This document provides comprehensive testing procedures for the Radio ISTIC dashboard before and after deployment.

---

## 🔧 LOCAL TESTING (Before Deployment)

### Prerequisites
- [ ] Node.js 18+ installed
- [ ] MongoDB connection working
- [ ] All dependencies installed (`npm install`)
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000

---

### 1. Authentication Flow Testing

#### Test 1.1: User Registration
**Steps**:
1. Navigate to `http://localhost:3000/signup`
2. Fill in registration form:
   - First Name: "Test"
   - Last Name: "User"
   - Email: "test@example.com"
   - Password: "Test123!"
   - Phone: "1234567890"
   - Field: Select "GLSI"
   - Year: Select "1"
3. Click "Sign Up"

**Expected Results**:
- [ ] Form validation works (empty fields show errors)
- [ ] Password strength indicator shows
- [ ] On success: Redirect to `/members` page
- [ ] JWT token saved in localStorage
- [ ] User appears in MongoDB `users` collection

**Actual Results**: _______________

---

#### Test 1.2: User Login
**Steps**:
1. Navigate to `http://localhost:3000/login`
2. Enter credentials:
   - Email: "test@example.com"
   - Password: "Test123!"
3. Click "Login"

**Expected Results**:
- [ ] Loading spinner appears
- [ ] On success: Redirect to `/members` page
- [ ] User data loaded in auth context
- [ ] lastLogin updated in MongoDB

**Actual Results**: _______________

---

#### Test 1.3: Protected Routes
**Steps**:
1. Logout (if logged in)
2. Try to access `http://localhost:3000/members`
3. Should redirect to login
4. Login and try again

**Expected Results**:
- [ ] Unauthenticated users redirected to `/login`
- [ ] Authenticated users can access protected pages
- [ ] Protected pages: /members, /events, /bureau, /settings, /chat

**Actual Results**: _______________

---

#### Test 1.4: Logout
**Steps**:
1. Login
2. Click user menu → Logout
3. Check redirect

**Expected Results**:
- [ ] JWT token removed from localStorage
- [ ] WebSocket disconnected
- [ ] Redirected to login page
- [ ] Cannot access protected routes

**Actual Results**: _______________

---

### 2. Profile Management Testing

#### Test 2.1: View Profile
**Steps**:
1. Login
2. Navigate to `/settings`
3. Check displayed information

**Expected Results**:
- [ ] User's first name displayed
- [ ] User's last name displayed
- [ ] Email displayed
- [ ] Phone displayed
- [ ] Avatar displayed (or default)
- [ ] Field and year displayed

**Actual Results**: _______________

---

#### Test 2.2: Update Profile
**Steps**:
1. Go to `/settings`
2. Change first name to "Updated"
3. Change phone to "9876543210"
4. Change coordonation field
5. Click "Save Changes"

**Expected Results**:
- [ ] Success message appears
- [ ] Changes saved to MongoDB
- [ ] Refresh page → Changes persist
- [ ] Name appears on `/members` page
- [ ] Profile modal shows updated info

**Actual Results**: _______________

---

#### Test 2.3: Avatar Upload
**Steps**:
1. Go to `/settings`
2. Click "Upload Avatar"
3. Select JPEG image (< 5MB)
4. Upload

**Expected Results**:
- [ ] Upload progress indicator
- [ ] Success message
- [ ] Avatar displays immediately
- [ ] Refresh → Avatar persists
- [ ] Old avatar deleted from server
- [ ] File saved in `backend-api/public/uploads/avatars/`

**Actual Results**: _______________

---

#### Test 2.4: Avatar Upload Validation
**Steps**:
1. Try uploading PDF file
2. Try uploading 10MB image
3. Try uploading .exe file

**Expected Results**:
- [ ] PDF rejected: "Invalid file type"
- [ ] Large file rejected: "File too large"
- [ ] Executable rejected: "Invalid file type"
- [ ] Only JPEG, PNG, WEBP accepted
- [ ] Max 5MB enforced

**Actual Results**: _______________

---

### 3. WebSocket & Chat Testing

#### Test 3.1: WebSocket Connection
**Steps**:
1. Open DevTools Console (F12)
2. Login
3. Check console logs

**Expected Results**:
- [ ] Console shows: "✅ WebSocket connected to backend on port 5000"
- [ ] Backend logs show: "User connected: [userId]"
- [ ] User appears in online users list

**Actual Results**: _______________

---

#### Test 3.2: Send Chat Message
**Steps**:
1. Login as User A
2. Open `/chat`
3. Select a conversation
4. Type message: "Hello World"
5. Press Enter

**Expected Results**:
- [ ] Message appears instantly
- [ ] Message has timestamp
- [ ] Message status: "sent"
- [ ] Message saved to MongoDB `messages` collection
- [ ] conversationId matches

**Actual Results**: _______________

---

#### Test 3.3: Real-Time Message Delivery
**Steps**:
1. Open 2 browser windows
2. Login as User A in window 1
3. Login as User B in window 2
4. User A sends message to User B
5. Check User B's window

**Expected Results**:
- [ ] User B receives message in real-time
- [ ] No page refresh needed
- [ ] Message appears in correct conversation
- [ ] Notification sound/badge (if implemented)
- [ ] Message persists after page refresh

**Actual Results**: _______________

---

#### Test 3.4: Typing Indicators
**Steps**:
1. Use 2 browser windows (User A & User B)
2. User A starts typing in chat
3. Check User B's window

**Expected Results**:
- [ ] User B sees "User A is typing..."
- [ ] Indicator disappears when User A stops
- [ ] Indicator accurate and real-time

**Actual Results**: _______________

---

#### Test 3.5: Online/Offline Status
**Steps**:
1. Open 2 windows (User A & User B)
2. User A closes browser tab
3. Check User B's online users list

**Expected Results**:
- [ ] User A appears online when connected
- [ ] User A disappears when disconnected
- [ ] Online status indicator (green dot)
- [ ] Offline status indicator (gray dot)

**Actual Results**: _______________

---

#### Test 3.6: Message Read Status
**Steps**:
1. User A sends message
2. User B opens conversation
3. Check message status

**Expected Results**:
- [ ] Initially: "sent"
- [ ] When delivered: "delivered"
- [ ] When read: "read"
- [ ] Status updates in real-time

**Actual Results**: _______________

---

### 4. API Endpoint Testing

#### Test 4.1: Health Check
**Command**:
```bash
curl http://localhost:5000/api/health
```

**Expected Response**:
```json
{
  "status": "OK",
  "uptime": 123,
  "timestamp": 1234567890
}
```

**Actual Response**: _______________

---

#### Test 4.2: Register Endpoint
**Command**:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"API",
    "lastName":"Test",
    "email":"api@test.com",
    "password":"test123",
    "field":"GLSI",
    "year":1
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "token": "jwt.token.here",
  "user": {...}
}
```

**Actual Response**: _______________

---

#### Test 4.3: Login Endpoint
**Command**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"api@test.com",
    "password":"test123"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "token": "jwt.token.here",
  "user": {...}
}
```

**Actual Response**: _______________

---

#### Test 4.4: Protected Endpoint
**Command**:
```bash
# First get token from login
TOKEN="your.jwt.token"

curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response**:
```json
{
  "success": true,
  "data": {...user data...}
}
```

**Actual Response**: _______________

---

### 5. Security Testing

#### Test 5.1: Rate Limiting
**Steps**:
1. Make 6 rapid POST requests to `/api/auth/login`
2. Check response

**Expected Results**:
- [ ] First 5 requests succeed
- [ ] 6th request: 429 Too Many Requests
- [ ] Response: "Too many login attempts"
- [ ] Wait 15 minutes → Works again

**Actual Results**: _______________

---

#### Test 5.2: JWT Validation
**Steps**:
1. Make request with invalid token
2. Make request with expired token
3. Make request with no token

**Expected Results**:
- [ ] Invalid token: 401 Unauthorized
- [ ] Expired token: 401 Unauthorized
- [ ] No token: 401 Unauthorized
- [ ] Error message: "Not authorized"

**Actual Results**: _______________

---

#### Test 5.3: Password Hashing
**Steps**:
1. Create new user
2. Check MongoDB `users` collection
3. Examine password field

**Expected Results**:
- [ ] Password is hashed (bcrypt)
- [ ] NOT plain text
- [ ] Starts with "$2b$" or "$2a$"
- [ ] comparePassword() method works

**Actual Results**: _______________

---

#### Test 5.4: NoSQL Injection
**Steps**:
1. Try login with:
   ```json
   {
     "email": {"$ne": null},
     "password": {"$ne": null}
   }
   ```

**Expected Results**:
- [ ] Request rejected
- [ ] 400 Bad Request
- [ ] Sanitization middleware blocks injection

**Actual Results**: _______________

---

### 6. Database Testing

#### Test 6.1: Data Persistence
**Steps**:
1. Create new user
2. Stop backend server
3. Start backend server
4. Login with same user

**Expected Results**:
- [ ] User data persists
- [ ] Can login after restart
- [ ] All profile data intact

**Actual Results**: _______________

---

#### Test 6.2: Relationships
**Steps**:
1. Check Messages collection
2. Find message with senderId
3. Verify user exists

**Expected Results**:
- [ ] Message has valid senderId
- [ ] User found in Users collection
- [ ] Foreign key constraints work

**Actual Results**: _______________

---

#### Test 6.3: Indexes
**Steps**:
```javascript
// In MongoDB shell or Compass
db.users.getIndexes()
```

**Expected Results**:
- [ ] Index on `email` (unique)
- [ ] Index on `points` (leaderboard)
- [ ] Index on `field` + `year` (filtering)
- [ ] Default index on `_id`

**Actual Results**: _______________

---

### 7. Frontend UI Testing

#### Test 7.1: Responsive Design
**Steps**:
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test different screen sizes:
   - Mobile: 375px
   - Tablet: 768px
   - Desktop: 1920px

**Expected Results**:
- [ ] Mobile: Hamburger menu appears
- [ ] Tablet: Sidebar collapses
- [ ] Desktop: Full sidebar visible
- [ ] No horizontal scroll
- [ ] All content readable

**Actual Results**: _______________

---

#### Test 7.2: Dark Mode
**Steps**:
1. Click theme toggle
2. Switch between light/dark
3. Refresh page

**Expected Results**:
- [ ] Theme switches instantly
- [ ] All components adapt
- [ ] Choice persists after refresh
- [ ] Stored in localStorage

**Actual Results**: _______________

---

#### Test 7.3: Loading States
**Steps**:
1. Slow down network (DevTools → Network → Slow 3G)
2. Navigate to Members page
3. Observe loading

**Expected Results**:
- [ ] Loading skeleton appears
- [ ] No blank screen
- [ ] Graceful loading experience

**Actual Results**: _______________

---

#### Test 7.4: Error Handling
**Steps**:
1. Stop backend server
2. Try to login

**Expected Results**:
- [ ] Error message displayed
- [ ] "Cannot connect to server" or similar
- [ ] No console errors
- [ ] User can retry

**Actual Results**: _______________

---

### 8. Performance Testing

#### Test 8.1: Page Load Time
**Steps**:
1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Check load time

**Expected Results**:
- [ ] First load: < 3 seconds
- [ ] Subsequent loads: < 1 second
- [ ] LCP (Largest Contentful Paint): < 2.5s
- [ ] FID (First Input Delay): < 100ms

**Actual Results**: _______________

---

#### Test 8.2: Lighthouse Audit
**Steps**:
1. Open DevTools
2. Go to Lighthouse tab
3. Run audit (Desktop mode)

**Expected Results**:
- [ ] Performance: 70+
- [ ] Accessibility: 90+
- [ ] Best Practices: 90+
- [ ] SEO: 80+

**Actual Results**: _______________

---

## 🚀 PRODUCTION TESTING (After Deployment)

### 1. Smoke Tests
- [ ] Production URL loads
- [ ] SSL certificate valid (https://)
- [ ] Backend API responds
- [ ] Database connection works

### 2. Critical Path
- [ ] Users can sign up
- [ ] Users can login
- [ ] Chat works in real-time
- [ ] File uploads work
- [ ] Data persists

### 3. Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### 4. Load Testing (Optional)
**Tool**: Apache Bench or Artillery

```bash
# Test 100 requests with 10 concurrent
ab -n 100 -c 10 https://your-backend.onrender.com/api/health
```

**Expected Results**:
- [ ] 95% of requests < 1 second
- [ ] No failed requests
- [ ] Server stable under load

---

## 📋 TEST SUMMARY

**Total Tests**: 40+  
**Critical Tests**: 20  
**Must Pass Before Deploy**: All critical tests  

**Test Coverage**:
- ✅ Authentication: 4 tests
- ✅ Profile Management: 4 tests
- ✅ WebSocket/Chat: 6 tests
- ✅ API Endpoints: 4 tests
- ✅ Security: 4 tests
- ✅ Database: 3 tests
- ✅ Frontend UI: 4 tests
- ✅ Performance: 2 tests
- ✅ Production: 4 tests

---

## 🐛 Bug Report Template

If you find a bug, document it like this:

**Bug ID**: #001  
**Severity**: High/Medium/Low  
**Found In**: Test X.X  
**Description**: What happened  
**Expected**: What should happen  
**Actual**: What actually happened  
**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Screenshots**: (attach if applicable)  
**Browser/Device**: Chrome 119 / Windows 11  
**Date**: YYYY-MM-DD  

---

## ✅ SIGN-OFF

**Tested By**: _______________  
**Date**: _______________  
**Environment**: Local / Production  
**Result**: Pass / Fail / Partial  
**Notes**: _______________

---

**Last Updated**: November 12, 2025  
**Version**: 1.0
