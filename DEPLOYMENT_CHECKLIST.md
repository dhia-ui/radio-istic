# Radio Istic - Deployment Checklist & Commands

## 🎯 Quick Start: Local Testing (Do This First)

### Prerequisites
- Node.js installed
- MongoDB Atlas account (or local MongoDB)
- 3 terminal windows (or use background processes)

---

## 📋 STEP 1: Setup Environment Variables

### Create `.env.local` file in project root
```powershell
# Run this in PowerShell from project root
@"
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
"@ | Out-File -FilePath .env.local -Encoding UTF8
```

### Create `backend-api/.env` file
```powershell
# Run this in PowerShell from project root
@"
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/radio-istic?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
CORS_ORIGIN=http://localhost:3000
"@ | Out-File -FilePath backend-api\.env -Encoding UTF8
```
**⚠️ IMPORTANT**: Replace `USERNAME:PASSWORD` and `cluster.mongodb.net` with your actual MongoDB Atlas credentials!

### Create `websocket-server/.env` file
```powershell
# Run this in PowerShell from project root
@"
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/radio-istic?retryWrites=true&w=majority
SOCKET_PORT=3001
CORS_ORIGIN=http://localhost:3000
"@ | Out-File -FilePath websocket-server\.env -Encoding UTF8
```
**⚠️ IMPORTANT**: Use the same MongoDB credentials as backend!

---

## 📋 STEP 2: Install Dependencies

### Terminal 1 - Backend API
```powershell
# Navigate to backend-api folder
cd backend-api

# Install dependencies
npm install

# Verify .env exists
Get-Content .env
```

### Terminal 2 - WebSocket Server
```powershell
# Navigate to websocket-server folder (from project root)
cd websocket-server

# Install dependencies
npm install

# Verify .env exists
Get-Content .env
```

### Terminal 3 - Frontend
```powershell
# Stay in project root (dashboard folder)

# Install dependencies if not already done
npm install

# Verify .env.local exists
Get-Content .env.local
```

---

## 📋 STEP 3: Start All Servers (3 Terminals)

### Terminal 1 - Start Backend API
```powershell
# In backend-api folder
cd backend-api
npm run dev
```
**Expected Output:**
```
🚀 Server running on port 5000
✅ MongoDB Connected
```

### Terminal 2 - Start WebSocket Server
```powershell
# In websocket-server folder
cd websocket-server
npm run dev
```
**Expected Output:**
```
✅ MongoDB Connected
🚀 WebSocket server running on port 3001
```

### Terminal 3 - Start Frontend
```powershell
# In project root
npm start
```
**Expected Output:**
```
✅ Next.js ready on http://localhost:3000
✅ Socket.io server ready on http://localhost:3001
🚀 Both servers running successfully!
```

---

## 📋 STEP 4: Verify Everything Works (Local Testing)

### Test 1: Backend API Health Check
```powershell
# Test members endpoint
Invoke-RestMethod -Uri "http://localhost:5000/api/members" -Method Get

# Test auth endpoint (should return error without credentials - that's OK)
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method Get
```
**Expected:** JSON response with member data or error message (both are OK)

### Test 2: Frontend Loads
```powershell
# Open browser
Start-Process "http://localhost:3000"
```
**Checklist:**
- [ ] Page loads without errors
- [ ] No console errors in browser DevTools (F12)
- [ ] Login page shows

### Test 3: Register & Login
1. Open http://localhost:3000/signup
2. Register a new user:
   - First Name: Test
   - Last Name: User
   - Email: test@test.com
   - Password: Test123!
   - Field: GLSI
   - Year: 2
3. Click Register
4. Should redirect to dashboard

### Test 4: Check API Calls in Browser
1. Open DevTools (F12) → Network tab
2. Navigate to http://localhost:3000/members
3. Look for API calls to `http://localhost:5000/api/members`
4. Should see Status: 200

### Test 5: WebSocket Connection
1. Open http://localhost:3000/chat
2. Open DevTools Console
3. Look for Socket.IO connection logs
4. Backend terminal should show: "User connected: [userId]"

### Test 6: All Pages Load Data
```powershell
# Open all pages to verify
Start-Process "http://localhost:3000/members"
Start-Process "http://localhost:3000/bureau"
Start-Process "http://localhost:3000/about"
Start-Process "http://localhost:3000/events"
Start-Process "http://localhost:3000/chat"
```
**Checklist:**
- [ ] Members page shows list of users from database
- [ ] Bureau page shows statistics
- [ ] About page shows bureau members
- [ ] Events page loads (even if empty)
- [ ] Chat page shows member list

---

## 🚀 PRODUCTION DEPLOYMENT

### Option A: Deploy to Render (Recommended - Free Tier Available)

#### 📋 STEP 5: Deploy Backend API to Render

1. **Create Render Account**: Go to https://render.com and sign up

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `dhia-ui/radio-istic`
   - Name: `radio-istic-backend-api`
   - Root Directory: `backend-api`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: `Free` (or paid for better performance)

3. **Add Environment Variables** (in Render dashboard):
   ```
   MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/radio-istic?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_make_it_long_and_random
   PORT=5000
   CORS_ORIGIN=https://your-frontend-domain.netlify.app
   NODE_ENV=production
   ```

4. **Deploy** - Click "Create Web Service"

5. **Get Your API URL** - After deploy, copy the URL (e.g., `https://radio-istic-backend-api.onrender.com`)

#### 📋 STEP 6: Deploy WebSocket Server to Render

1. **Create Another Web Service**:
   - Click "New +" → "Web Service"
   - Same repository: `dhia-ui/radio-istic`
   - Name: `radio-istic-websocket`
   - Root Directory: `websocket-server`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: `Free`

2. **Add Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/radio-istic?retryWrites=true&w=majority
   SOCKET_PORT=3001
   CORS_ORIGIN=https://your-frontend-domain.netlify.app
   NODE_ENV=production
   ```

3. **Deploy** - Click "Create Web Service"

4. **Get Your WebSocket URL** - Copy the URL (e.g., `https://radio-istic-websocket.onrender.com`)

#### 📋 STEP 7: Deploy Frontend to Netlify

1. **Create Netlify Account**: Go to https://netlify.com and sign up

2. **Deploy from GitHub**:
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select `dhia-ui/radio-istic`
   - Base directory: (leave empty - root)
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Add Environment Variables** (in Netlify dashboard → Site settings → Environment variables):
   ```
   NEXT_PUBLIC_API_URL=https://radio-istic-backend-api.onrender.com/api
   NEXT_PUBLIC_SOCKET_URL=https://radio-istic-websocket.onrender.com
   ```
   **⚠️ IMPORTANT**: Replace URLs with your actual Render service URLs!

4. **Deploy** - Click "Deploy site"

5. **Update CORS** - Go back to Render services and update `CORS_ORIGIN` with your Netlify URL

---

## 📋 STEP 8: Update Production CORS Settings

### Update Backend API on Render
1. Go to Render dashboard → `radio-istic-backend-api` → Environment
2. Update `CORS_ORIGIN` to your Netlify URL: `https://your-site-name.netlify.app`
3. Click "Save Changes" (will trigger redeploy)

### Update WebSocket Server on Render
1. Go to Render dashboard → `radio-istic-websocket` → Environment
2. Update `CORS_ORIGIN` to your Netlify URL: `https://your-site-name.netlify.app`
3. Click "Save Changes" (will trigger redeploy)

---

## 📋 STEP 9: Verify Production Deployment

### Test Production API
```powershell
# Replace with your actual Render API URL
Invoke-RestMethod -Uri "https://radio-istic-backend-api.onrender.com/api/members" -Method Get
```

### Test Production Frontend
1. Open your Netlify URL: `https://your-site-name.netlify.app`
2. Open DevTools (F12) → Console
3. Look for errors (should be none)
4. Test signup/login
5. Check that all pages load data
6. Test chat (WebSocket connection)

### Common Production Issues & Fixes

**Issue: "Failed to fetch" errors**
- Fix: Check CORS_ORIGIN matches frontend URL exactly (including https://)
- Verify Render services are running (check logs)

**Issue: WebSocket connection fails**
- Fix: Ensure NEXT_PUBLIC_SOCKET_URL uses https:// (not ws:// or wss://)
- Check WebSocket server logs on Render
- Verify CORS_ORIGIN is set correctly

**Issue: 401 Unauthorized errors**
- Fix: JWT_SECRET must be the same on backend and consistent
- Try logging out and logging back in (token may be from old deployment)

**Issue: MongoDB connection errors**
- Fix: Check MongoDB Atlas Network Access allows Render IPs (0.0.0.0/0 for testing)
- Verify MONGODB_URI is correct in all services

---

## 📋 STEP 10: Post-Deployment Checklist

### Security Checklist
- [ ] JWT_SECRET is strong (at least 32 characters, random)
- [ ] MongoDB credentials are secure (not default passwords)
- [ ] CORS_ORIGIN only allows your frontend domain
- [ ] MongoDB Network Access configured (whitelist IPs or allow all for Render)
- [ ] No sensitive data in frontend code or .env files committed to Git

### Functionality Checklist
- [ ] Registration works
- [ ] Login works and redirects to dashboard
- [ ] Members page loads data from MongoDB
- [ ] Bureau page shows statistics
- [ ] Events page works (create/register/unregister)
- [ ] Chat page loads members
- [ ] WebSocket messages send/receive in real-time
- [ ] Profile updates save to database
- [ ] Logout clears token and redirects to login

### Performance Checklist
- [ ] API responses < 2 seconds
- [ ] Pages load < 3 seconds
- [ ] WebSocket connects < 1 second
- [ ] Images load properly
- [ ] No console errors in browser

---

## 🆘 Troubleshooting Commands

### Check if a port is in use (Windows)
```powershell
# Check port 5000
netstat -ano | findstr :5000

# Check port 3001
netstat -ano | findstr :3001

# Check port 3000
netstat -ano | findstr :3000
```

### Kill a process using a port
```powershell
# Find process ID (PID) from netstat output above, then:
Stop-Process -Id <PID> -Force
```

### Check Node processes
```powershell
Get-Process -Name node | Select-Object Id, ProcessName, StartTime
```

### Kill all Node processes (nuclear option)
```powershell
Get-Process -Name node | Stop-Process -Force
```

### View logs in real-time (if using separate backend/websocket terminals)
```powershell
# Backend logs
cd backend-api
npm run dev

# WebSocket logs
cd websocket-server
npm run dev
```

### Test MongoDB connection
```powershell
# Install MongoDB Node.js driver globally
npm install -g mongodb

# Test connection (replace with your URI)
node -e "require('mongodb').MongoClient.connect('mongodb+srv://...', (err, client) => { if(err) console.error(err); else console.log('Connected!'); process.exit(); })"
```

### Clear browser cache and localStorage
```javascript
// Run in browser console (F12)
localStorage.clear()
location.reload()
```

---

## 📝 Quick Reference URLs

### Local Development
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **WebSocket**: http://localhost:3001

### Production (Example - Replace with Your URLs)
- **Frontend**: https://your-site-name.netlify.app
- **Backend API**: https://radio-istic-backend-api.onrender.com/api
- **WebSocket**: https://radio-istic-websocket.onrender.com

### Important Endpoints
- **Register**: POST /api/auth/register
- **Login**: POST /api/auth/login
- **Get User**: GET /api/auth/me
- **Members**: GET /api/members
- **Events**: GET /api/events
- **Chat History**: GET /api/chat/conversations

---

## ✅ Final Verification Script

Run this after everything is deployed:

```powershell
# Test all endpoints (replace URLs with your production URLs)
$apiUrl = "https://radio-istic-backend-api.onrender.com/api"

Write-Host "Testing Members endpoint..." -ForegroundColor Yellow
Invoke-RestMethod -Uri "$apiUrl/members" -Method Get

Write-Host "`nTesting Events endpoint..." -ForegroundColor Yellow
Invoke-RestMethod -Uri "$apiUrl/events" -Method Get

Write-Host "`nAll tests passed! ✅" -ForegroundColor Green
```

---

## 🎉 Success Criteria

You're done when:
1. ✅ All 3 servers start without errors locally
2. ✅ You can register and login
3. ✅ All pages show data from MongoDB
4. ✅ Chat connects via WebSocket
5. ✅ Production deployment works (if you deployed)
6. ✅ No errors in browser console
7. ✅ No errors in server logs

---

## 📞 Need Help?

Common issues and solutions are in the Troubleshooting section above. If stuck:
1. Check server logs (terminal output)
2. Check browser console (F12 → Console tab)
3. Check network tab (F12 → Network tab)
4. Verify environment variables are set correctly
5. Ensure MongoDB Atlas allows connections from your IP/Render

**Good luck! 🚀**
