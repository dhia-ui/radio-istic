# 🔐 YOUR DEPLOYMENT CONFIGURATION

## ✅ JWT Secret Generated
```
878492d0986d7f170b3e31224c6ca865f3c42f1231982daa7f42cb59989a7e6f
```
⚠️ **Keep this secret! Don't share publicly!**

---

## 📦 BACKEND API - Copy to Render

Go to Render → Your Service → Environment → Add these variables:

```env
MONGODB_URI=mongodb+srv://dhiaguetiti_db_user:pvFLnVUjjISIXiz8@cluster0.o1rwzg0.mongodb.net/radio-istic?retryWrites=true&w=majority

JWT_SECRET=878492d0986d7f170b3e31224c6ca865f3c42f1231982daa7f42cb59989a7e6f

JWT_EXPIRE=7d

NODE_ENV=production

PORT=5000

CORS_ORIGIN=https://radioistic.netlify.app

FRONTEND_URL=https://radioistic.netlify.app
```

### 📝 TODO:
- [x] ✅ MongoDB URI configured
- [x] ✅ JWT Secret generated  
- [x] ✅ Frontend URL set: https://radioistic.netlify.app
- [ ] Copy these variables to Render environment

---

## 📡 WEBSOCKET SERVER - Copy to Render

Go to Render → Your WebSocket Service → Environment → Add these variables:

```env
MONGODB_URI=mongodb+srv://dhiaguetiti_db_user:pvFLnVUjjISIXiz8@cluster0.o1rwzg0.mongodb.net/radio-istic?retryWrites=true&w=majority

NODE_ENV=production

PORT=3001
```

### 📝 TODO:
- [x] ✅ MongoDB URI configured (same as backend)
- [x] ✅ Netlify URL already configured in server.js
- [ ] Copy these variables to Render environment

---

## 🌐 FRONTEND - Copy to Netlify

Go to Netlify → Site Settings → Environment Variables → Add these:

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api

NEXT_PUBLIC_SOCKET_URL=https://your-websocket.onrender.com

NEXT_PUBLIC_SITE_URL=https://radioistic.netlify.app
```

### 📝 TODO:
- [ ] Deploy backend first, then copy the Render URL
- [ ] Deploy websocket, then copy the Render URL
- [ ] Replace placeholder URLs with actual deployment URLs

---

## 🚀 DEPLOYMENT CHECKLIST

### Step 1: Get MongoDB URI
- [ ] Go to https://cloud.mongodb.com
- [ ] Click "Connect" on your cluster
- [ ] Choose "Connect your application"
- [ ] Copy connection string
- [ ] Replace `<password>` with your actual password
- [ ] Add `/radio-istic` after `.net/`

### Step 2: Deploy Backend to Render
- [ ] Go to https://dashboard.render.com
- [ ] Create new Web Service
- [ ] Connect GitHub repository `dhia-ui/radio-istic`
- [ ] Branch: `bureau-management-deployment`
- [ ] Root Directory: `backend-api`
- [ ] Build Command: `npm install`
- [ ] Start Command: `node server.js`
- [ ] Add all backend environment variables
- [ ] Wait for deployment
- [ ] Copy Render URL: `https://XXXXX.onrender.com`
- [ ] Test: `curl https://XXXXX.onrender.com/api/health`

### Step 3: Deploy WebSocket to Render
- [ ] Create another Web Service (or same as backend)
- [ ] Root Directory: `websocket-server` (if separate)
- [ ] Build Command: `npm install`
- [ ] Start Command: `node server.js`
- [ ] Add websocket environment variables
- [ ] Copy Render URL: `https://YYYYY.onrender.com`
- [ ] Test: `curl https://YYYYY.onrender.com/health`

### Step 4: Deploy Frontend to Netlify
- [ ] Go to https://app.netlify.com
- [ ] Import project from GitHub
- [ ] Repository: `dhia-ui/radio-istic`
- [ ] Branch: `bureau-management-deployment`
- [ ] Build command: `npm run build`
- [ ] Publish directory: `.next`
- [ ] Add frontend environment variables (with actual backend/websocket URLs)
- [ ] Deploy
- [ ] Copy Netlify URL: `https://ZZZZZ.netlify.app`

### Step 5: Update Backend CORS
- [ ] Go back to Render → Backend Service → Environment
- [ ] Update `CORS_ORIGIN=https://radioistic.netlify.app`
- [ ] Update `FRONTEND_URL=https://radioistic.netlify.app`
- [ ] Save (auto-redeploys)

### Step 6: Update Frontend Site URL
- [ ] Go back to Netlify → Environment Variables
- [ ] Update `NEXT_PUBLIC_SITE_URL=https://radioistic.netlify.app`
- [ ] Trigger redeploy

### Step 7: Test Everything
- [ ] Visit your Netlify URL
- [ ] Try to sign up
- [ ] Try to login
- [ ] Test chat functionality
- [ ] Check browser console for errors
- [ ] Verify data saves in MongoDB

---

## 🎯 QUICK COPY-PASTE FOR RENDER

### Backend Service Configuration:
```
Name: radio-istic-backend
Region: Choose closest to users
Branch: bureau-management-deployment
Root Directory: backend-api
Environment: Node
Build Command: npm install
Start Command: node server.js
```

### WebSocket Service Configuration (if separate):
```
Name: radio-istic-websocket
Region: Same as backend
Branch: bureau-management-deployment
Root Directory: websocket-server
Environment: Node
Build Command: npm install
Start Command: node server.js
```

---

## 🎯 QUICK COPY-PASTE FOR NETLIFY

### Frontend Configuration:
```
Repository: dhia-ui/radio-istic
Branch: bureau-management-deployment
Build command: npm run build
Publish directory: .next
Node version: 18
```

---

## 📞 MONGODB ATLAS SETUP

1. Go to https://cloud.mongodb.com
2. Create account or login
3. Create new cluster (Free tier M0)
4. Database Access → Add New User:
   - Username: `radioistic`
   - Password: (generate strong password)
   - Role: `Read and write to any database`
5. Network Access → Add IP Address:
   - Select: `Allow access from anywhere (0.0.0.0/0)`
   - Or add Render IPs specifically
6. Connect → Connect your application:
   - Driver: Node.js
   - Version: 4.1 or later
   - Copy connection string
7. Your connection string will look like:
   ```
   mongodb+srv://radioistic:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
8. Update it to:
   ```
   mongodb+srv://radioistic:<password>@cluster0.xxxxx.mongodb.net/radio-istic?retryWrites=true&w=majority
   ```

---

**Generated:** November 12, 2025  
**JWT Secret:** ✅ Secure 64-character hex string  
**Status:** Ready to deploy!
