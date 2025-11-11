# 🚀 Quick Start: Deploy to Render

## 📝 What You Need

```
✅ GitHub Repository: dhia-ui/radio-istic
✅ MongoDB URI: mongodb+srv://dhiaguetiti_db_user:***@cluster0.o1rwzg0.mongodb.net/radio-istic
✅ JWT Secret: Nx56B^LWMNTt8740sTpFNFigLck4ZpC&*ltcDLAPs%bR7Y^i5*gTuG8S*uN6W^P$
✅ Render Account: https://render.com (sign up free)
```

---

## 🎯 Deploy in This Order

### 1️⃣ Backend API (5 minutes)

1. Go to: https://render.com/dashboard
2. Click: **New +** → **Web Service**
3. Connect: **dhia-ui/radio-istic** repository
4. Settings:
   ```
   Name: radio-istic-backend-api
   Root Directory: backend-api
   Build Command: npm install
   Start Command: npm start
   ```
5. Environment Variables (click Advanced):
   ```bash
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://dhiaguetiti_db_user:pvFLnVUjjlSDXiz8@cluster0.o1rwzg0.mongodb.net/radio-istic?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=Nx56B^LWMNTt8740sTpFNFigLck4ZpC&*ltcDLAPs%bR7Y^i5*gTuG8S*uN6W^P$
   CORS_ORIGIN=https://YOUR-FRONTEND-URL.onrender.com
   ```
6. Click: **Create Web Service**
7. **COPY YOUR URL**: e.g., `https://radio-istic-backend-api.onrender.com`

---

### 2️⃣ WebSocket Server (5 minutes)

1. Click: **New +** → **Web Service**
2. Select: **dhia-ui/radio-istic** (same repo)
3. Settings:
   ```
   Name: radio-istic-websocket
   Root Directory: websocket-server
   Build Command: npm install
   Start Command: npm start
   ```
4. Environment Variables:
   ```bash
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://dhiaguetiti_db_user:pvFLnVUjjlSDXiz8@cluster0.o1rwzg0.mongodb.net/radio-istic?retryWrites=true&w=majority&appName=Cluster0
   CORS_ORIGIN=https://YOUR-FRONTEND-URL.onrender.com
   ```
5. Click: **Create Web Service**
6. **COPY YOUR URL**: e.g., `https://radio-istic-websocket.onrender.com`

---

### 3️⃣ Frontend (10 minutes)

1. Click: **New +** → **Web Service**
2. Select: **dhia-ui/radio-istic** (same repo)
3. Settings:
   ```
   Name: radio-istic-frontend
   Root Directory: (leave empty)
   Build Command: npm install && npm run build
   Start Command: npm start
   ```
4. Environment Variables (USE YOUR URLS FROM STEPS 1 & 2):
   ```bash
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://radio-istic-backend-api.onrender.com/api
   NEXT_PUBLIC_SOCKET_URL=https://radio-istic-websocket.onrender.com
   ```
5. Click: **Create Web Service**
6. **COPY YOUR URL**: e.g., `https://radio-istic-frontend.onrender.com`

---

### 4️⃣ Update CORS (2 minutes)

**Important**: Now update backend and websocket with your actual frontend URL!

1. Go to **Backend API** service → **Environment** tab
2. Edit `CORS_ORIGIN` → Set to: `https://radio-istic-frontend.onrender.com` (your actual URL)
3. Click **Save Changes**

4. Go to **WebSocket** service → **Environment** tab
5. Edit `CORS_ORIGIN` → Set to: `https://radio-istic-frontend.onrender.com` (your actual URL)
6. Click **Save Changes**

Both will auto-redeploy (takes 1-2 minutes).

---

## ✅ Test Your App

1. Open: `https://radio-istic-frontend.onrender.com` (your frontend URL)
2. Click **"Sign Up"** and create an account
3. Test:
   - ✅ Login works
   - ✅ Members page loads
   - ✅ Bureau dashboard shows stats
   - ✅ Chat opens and shows members
   - ✅ Can send messages

---

## 🔧 If Something Doesn't Work

### Check MongoDB Access
1. Go to: https://cloud.mongodb.com
2. Navigate to: **Network Access**
3. Make sure: **0.0.0.0/0** is allowed (or add it)

### Check Service Logs
1. Go to service on Render dashboard
2. Click **"Logs"** tab
3. Look for errors (connection refused, MongoDB errors, etc.)

### Check Browser Console
1. Press F12 in your browser
2. Go to **Console** tab
3. Look for red errors (API calls, CORS, WebSocket)

---

## 🎉 Success!

If everything works, you have:
- ✅ Backend API live on Render
- ✅ WebSocket server live on Render
- ✅ Frontend live on Render
- ✅ All connected and working
- ✅ Data stored in MongoDB Atlas
- ✅ Real-time chat working

**Share your app URL**: `https://radio-istic-frontend.onrender.com`

---

## 📚 Need More Help?

See full guide: `RENDER_DEPLOYMENT_GUIDE.md`

**Total time**: ~20 minutes for complete deployment! 🚀
