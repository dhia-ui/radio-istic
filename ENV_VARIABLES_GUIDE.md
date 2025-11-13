# 🔐 ENVIRONMENT VARIABLES GUIDE

## 📦 BACKEND API (Express + MongoDB)

**Folder:** `/backend-api`  
**Deploy to:** Render / Railway / Heroku

### ✅ Required Variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/radio-istic?retryWrites=true&w=majority
# 📝 Get from: MongoDB Atlas > Connect > Connect your application
# ⚠️ Replace username, password, and cluster URL with your actual values

# JWT Configuration
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
# 📝 Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# ⚠️ MUST be at least 32 characters, keep it secret!

JWT_EXPIRE=7d
# 📝 Token expiration time (7 days recommended)

# Server Configuration
NODE_ENV=production
# 📝 Sets app to production mode (enables security features)

PORT=5000
# 📝 Server port (Render will override automatically)

# CORS Configuration
CORS_ORIGIN=https://your-app.netlify.app
# 📝 Your frontend URL (update AFTER deploying to Netlify)
# ⚠️ NO trailing slash! Must match exactly!

FRONTEND_URL=https://your-app.netlify.app
# 📝 Same as CORS_ORIGIN
```

### 📝 How to Set on Render:

1. Go to your Render service dashboard
2. Click **"Environment"** tab
3. Click **"Add Environment Variable"**
4. Add each variable one by one (key = value)
5. Click **"Save Changes"**
6. Render will auto-redeploy

---

## 📡 WEBSOCKET SERVER (Socket.IO)

**Folder:** `/websocket-server`  
**Deploy to:** Render (same or separate from backend)

### ✅ Required Variables:

```env
# MongoDB Connection (SAME as backend)
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/radio-istic?retryWrites=true&w=majority
# 📝 Use the EXACT same value as backend API

# Server Configuration
PORT=3001
# 📝 WebSocket server port (or let Render assign)

NODE_ENV=production
# 📝 Sets app to production mode
```

### ⚠️ IMPORTANT: Update CORS Origins in Code

The WebSocket server has **hardcoded CORS origins** in `websocket-server/server.js` (lines 14-18).

**Current values:**
```javascript
const allowedOrigins = [
  'https://radioistic.netlify.app',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:3001'
];
```

**You need to UPDATE this to:**
```javascript
const allowedOrigins = [
  'https://YOUR-ACTUAL-APP.netlify.app',  // ← Your Netlify URL
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:3001'
];
```

Then commit and push the change:
```bash
git add websocket-server/server.js
git commit -m "Update WebSocket CORS for production"
git push origin bureau-management-deployment
```

---

## 🌐 FRONTEND (Next.js)

**Folder:** `/` (project root)  
**Deploy to:** Vercel / Netlify

### ✅ Required Variables:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
# 📝 Your Render backend URL + /api
# ⚠️ Update AFTER deploying backend to Render

# WebSocket Server URL
NEXT_PUBLIC_SOCKET_URL=https://your-websocket.onrender.com
# 📝 Your WebSocket server URL (could be same as backend or separate)
# ⚠️ If WebSocket runs with backend, use backend URL WITHOUT /api

# Site URL
NEXT_PUBLIC_SITE_URL=https://your-app.netlify.app
# 📝 Your Netlify URL (for canonical URLs and metadata)
```

### 📝 How to Set on Netlify:

1. Go to your Netlify site dashboard
2. Click **"Site settings"**
3. Click **"Environment variables"**
4. Click **"Add a variable"**
5. Add each variable (key = value)
6. Click **"Save"**
7. Trigger a redeploy

---

## 🔄 DEPLOYMENT ORDER (IMPORTANT!)

Follow this order to avoid circular dependencies:

### 1️⃣ Deploy Backend First
- Set all backend env variables EXCEPT `CORS_ORIGIN` and `FRONTEND_URL`
- Use temporary values: `http://localhost:3000`
- Deploy and get your Render URL: `https://your-backend.onrender.com`

### 2️⃣ Deploy WebSocket Server
- Update CORS origins in code with your backend URL
- Set `MONGODB_URI`, `PORT`, `NODE_ENV`
- Deploy and get WebSocket URL: `https://your-websocket.onrender.com`

### 3️⃣ Deploy Frontend
- Set `NEXT_PUBLIC_API_URL` to your backend URL + `/api`
- Set `NEXT_PUBLIC_SOCKET_URL` to your WebSocket URL
- Set `NEXT_PUBLIC_SITE_URL` to temporary value: `https://temp.netlify.app`
- Deploy and get your Netlify URL: `https://your-app.netlify.app`

### 4️⃣ Update Backend CORS
- Go back to Render backend
- Update `CORS_ORIGIN` = `https://your-app.netlify.app` (your actual Netlify URL)
- Update `FRONTEND_URL` = `https://your-app.netlify.app`
- Save (will auto-redeploy)

### 5️⃣ Update Frontend Site URL
- Go back to Netlify
- Update `NEXT_PUBLIC_SITE_URL` = `https://your-app.netlify.app` (your actual URL)
- Trigger redeploy

### 6️⃣ Test Everything!
- Visit your Netlify URL
- Try to sign up / login
- Check chat functionality
- Look for errors in browser console

---

## 🚨 COMMON MISTAKES TO AVOID

### ❌ Trailing Slashes
```env
# WRONG
CORS_ORIGIN=https://my-app.netlify.app/

# CORRECT
CORS_ORIGIN=https://my-app.netlify.app
```

### ❌ Missing /api in Frontend API URL
```env
# WRONG
NEXT_PUBLIC_API_URL=https://backend.onrender.com

# CORRECT
NEXT_PUBLIC_API_URL=https://backend.onrender.com/api
```

### ❌ HTTP instead of HTTPS
```env
# WRONG (for production)
CORS_ORIGIN=http://my-app.netlify.app

# CORRECT
CORS_ORIGIN=https://my-app.netlify.app
```

### ❌ Using localhost in Production
```env
# WRONG (for production)
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# CORRECT
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```

### ❌ Weak JWT Secret
```env
# WRONG (too short, predictable)
JWT_SECRET=secret123

# CORRECT (32+ random characters)
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
```

---

## 🧪 TESTING YOUR ENVIRONMENT VARIABLES

### Test Backend:
```bash
curl https://your-backend.onrender.com/api/health
# Should return: {"status":"OK","message":"Radio Istic API is running"}
```

### Test WebSocket:
```bash
curl https://your-websocket.onrender.com/health
# Should return: {"status":"healthy","uptime":123,"memory":{...}}
```

### Test Frontend:
1. Open your Netlify URL in browser
2. Open DevTools (F12) → Console tab
3. Should see: "✅ API URL: https://your-backend.onrender.com/api"
4. Should NOT see CORS errors or connection errors

---

## 📞 NEED HELP?

If you get errors:
1. Check spelling of variable names (case-sensitive!)
2. Verify no extra spaces before/after values
3. Check URLs are correct (copy-paste from browser)
4. Review deployment logs for specific errors
5. Test each service individually before testing together

---

**Last Updated:** November 12, 2025
