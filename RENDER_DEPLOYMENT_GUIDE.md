# 🚀 Complete Render Deployment Guide

## Deploy Radio Istic to Render (Backend API + WebSocket + Frontend)

This guide walks you through deploying all three services from your GitHub repository to Render.

---

## 📋 Prerequisites

Before starting:
1. ✅ GitHub repository: `dhia-ui/radio-istic` (branch: `feature/priority-5-cleanup-mock-data-removal`)
2. ✅ MongoDB Atlas cluster with connection string
3. ✅ Render account (sign up at https://render.com - free)

---

## 🎯 Deployment Order

Deploy in this order:
1. **Backend API** (provides REST endpoints)
2. **WebSocket Server** (provides real-time chat)
3. **Frontend** (Next.js application)

---

## 📦 STEP 1: Deploy Backend API to Render

### 1.1 Create New Web Service

1. Go to https://render.com/dashboard
2. Click **"New +"** → **"Web Service"**
3. Click **"Build and deploy from a Git repository"** → **Next**
4. Connect your GitHub account (if not already connected)
5. Find and select repository: **`dhia-ui/radio-istic`**
6. Click **"Connect"**

### 1.2 Configure Backend API Service

Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `radio-istic-backend-api` |
| **Region** | Choose closest to you (e.g., Frankfurt, Oregon, Singapore) |
| **Branch** | `feature/priority-5-cleanup-mock-data-removal` (or `main` after merging) |
| **Root Directory** | `backend-api` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

### 1.3 Add Environment Variables

Click **"Advanced"** → Add these environment variables:

```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://dhiaguetiti_db_user:pvFLnVUjjlSDXiz8@cluster0.o1rwzg0.mongodb.net/radio-istic?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=Nx56B^LWMNTt8740sTpFNFigLck4ZpC&*ltcDLAPs%bR7Y^i5*gTuG8S*uN6W^P$
JWT_EXPIRE=7d
CORS_ORIGIN=https://radio-istic-frontend.onrender.com
```

**⚠️ IMPORTANT**: You'll update `CORS_ORIGIN` later with your actual frontend URL!

### 1.4 Deploy

1. Click **"Create Web Service"**
2. Wait 3-5 minutes for build and deployment
3. Once deployed, you'll see: **"Live ✅"**
4. Copy your Backend API URL (e.g., `https://radio-istic-backend-api.onrender.com`)

### 1.5 Test Backend API

Open in browser or use curl:
```powershell
Invoke-RestMethod -Uri "https://radio-istic-backend-api.onrender.com/api/members" -Method Get
```

Expected: JSON response with members data or empty array.

---

## 📦 STEP 2: Deploy WebSocket Server to Render

### 2.1 Create Another Web Service

1. From Render Dashboard, click **"New +"** → **"Web Service"**
2. Select same repository: **`dhia-ui/radio-istic`**
3. Click **"Connect"**

### 2.2 Configure WebSocket Service

| Setting | Value |
|---------|-------|
| **Name** | `radio-istic-websocket` |
| **Region** | **Same as backend** (important for latency) |
| **Branch** | `feature/priority-5-cleanup-mock-data-removal` |
| **Root Directory** | `websocket-server` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

### 2.3 Add Environment Variables

```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://dhiaguetiti_db_user:pvFLnVUjjlSDXiz8@cluster0.o1rwzg0.mongodb.net/radio-istic?retryWrites=true&w=majority&appName=Cluster0
CORS_ORIGIN=https://radio-istic-frontend.onrender.com
```

**⚠️ NOTE**: Render automatically assigns PORT (usually 10000). Don't change it.

### 2.4 Deploy

1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. Copy your WebSocket URL (e.g., `https://radio-istic-websocket.onrender.com`)

---

## 📦 STEP 3: Deploy Frontend to Render

### 3.1 Create Static Site or Web Service

**Option A: Static Site (Recommended - Faster)**

1. Click **"New +"** → **"Static Site"**
2. Select repository: **`dhia-ui/radio-istic`**

**Option B: Web Service (If Static Site doesn't work)**

1. Click **"New +"** → **"Web Service"**
2. Select repository: **`dhia-ui/radio-istic`**

### 3.2 Configure Frontend Service

| Setting | Value |
|---------|-------|
| **Name** | `radio-istic-frontend` |
| **Region** | **Same as backend** |
| **Branch** | `feature/priority-5-cleanup-mock-data-removal` |
| **Root Directory** | *(leave empty - project root)* |
| **Environment** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` (for Web Service) or leave empty (for Static Site) |
| **Instance Type** | `Free` |

### 3.3 Add Environment Variables

**CRITICAL**: Add these environment variables with YOUR actual URLs from Steps 1 & 2:

```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://radio-istic-backend-api.onrender.com/api
NEXT_PUBLIC_SOCKET_URL=https://radio-istic-websocket.onrender.com
```

**⚠️ Replace** `radio-istic-backend-api` and `radio-istic-websocket` with your actual service names!

### 3.4 Deploy

1. Click **"Create Web Service"** (or **"Create Static Site"**)
2. Wait 5-10 minutes (Next.js builds take longer)
3. Once deployed, copy your Frontend URL (e.g., `https://radio-istic-frontend.onrender.com`)

---

## 🔄 STEP 4: Update CORS Settings

Now that all services are deployed, update CORS to allow connections:

### 4.1 Update Backend API CORS

1. Go to **Backend API** service on Render
2. Click **"Environment"** tab
3. Find `CORS_ORIGIN` variable
4. Update value to your frontend URL:
   ```
   https://radio-istic-frontend.onrender.com
   ```
5. Click **"Save Changes"** (this will redeploy)

### 4.2 Update WebSocket CORS

1. Go to **WebSocket Server** service on Render
2. Click **"Environment"** tab
3. Find `CORS_ORIGIN` variable
4. Update value to your frontend URL:
   ```
   https://radio-istic-frontend.onrender.com
   ```
5. Click **"Save Changes"** (this will redeploy)

---

## ✅ STEP 5: Test Your Deployed Application

### 5.1 Open Frontend

Visit your frontend URL: `https://radio-istic-frontend.onrender.com`

### 5.2 Test Registration

1. Click **"Sign Up"**
2. Fill in form:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Password: Test123!
   - Field: GLSI
   - Year: 2
3. Click **"Register"**
4. Should redirect to dashboard

### 5.3 Test Features

- [ ] **Login** works
- [ ] **Members page** loads users from MongoDB
- [ ] **Bureau page** shows statistics
- [ ] **Events page** loads
- [ ] **Chat page** shows members
- [ ] **WebSocket** connects (check browser console)
- [ ] **Send message** in chat works
- [ ] **Profile update** saves

### 5.4 Check Logs

If something doesn't work:

1. **Backend API Logs**:
   - Go to Backend service → **"Logs"** tab
   - Look for errors (MongoDB connection, JWT issues)

2. **WebSocket Logs**:
   - Go to WebSocket service → **"Logs"** tab
   - Look for connection attempts

3. **Frontend Logs**:
   - Open browser DevTools (F12) → **"Console"** tab
   - Look for API call errors

---

## 🔧 Common Issues & Fixes

### Issue 1: "Failed to fetch" errors

**Cause**: CORS not configured correctly

**Fix**:
1. Check `CORS_ORIGIN` in backend/websocket matches frontend URL exactly
2. Include `https://` in the URL
3. No trailing slash
4. Redeploy after changing environment variables

### Issue 2: "WebSocket connection failed"

**Cause**: Wrong WebSocket URL or CORS issue

**Fix**:
1. Check `NEXT_PUBLIC_SOCKET_URL` in frontend env vars
2. Should be `https://` not `wss://` (Render handles SSL automatically)
3. Check WebSocket logs for connection attempts

### Issue 3: "MongoDB connection error"

**Cause**: MongoDB Atlas network access not configured

**Fix**:
1. Go to MongoDB Atlas → **"Network Access"**
2. Click **"Add IP Address"**
3. Choose **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Save and wait 1-2 minutes

### Issue 4: "Service build failed"

**Cause**: Missing dependencies or wrong build command

**Fix**:
1. Check Render build logs for specific error
2. Verify `package.json` has all dependencies
3. Ensure `Root Directory` is set correctly
4. Try manual deploy from Render dashboard

### Issue 5: "Free instance spins down after inactivity"

**Note**: Render free tier spins down after 15 minutes of inactivity

**Fix**:
- First request after spin-down takes 30-60 seconds
- Consider upgrading to paid plan ($7/month) for always-on
- Or use a ping service to keep it alive

---

## 📊 Service URLs Summary

After deployment, you should have:

```bash
# Backend API
https://radio-istic-backend-api.onrender.com

# WebSocket Server  
https://radio-istic-websocket.onrender.com

# Frontend
https://radio-istic-frontend.onrender.com
```

---

## 🔐 Security Checklist

Before going to production:

- [ ] Changed default JWT_SECRET to strong random string (✅ Done)
- [ ] MongoDB user has strong password (✅ Done)
- [ ] CORS_ORIGIN set to frontend URL only (not *)
- [ ] Environment variables are set correctly
- [ ] No sensitive data in frontend code
- [ ] MongoDB Network Access configured
- [ ] All services show "Live ✅" status

---

## 🎉 Next Steps

### Option 1: Keep on Render

Your app is live! Share the URL and start using it.

**URL**: `https://radio-istic-frontend.onrender.com`

### Option 2: Add Custom Domain

1. Buy a domain (e.g., radioistic.com)
2. In Render dashboard → Frontend service → **"Settings"**
3. Click **"Custom Domain"**
4. Add your domain and follow DNS instructions
5. Render provides free SSL certificate

### Option 3: Monitor Performance

1. Check Render **"Metrics"** tab for each service
2. Monitor MongoDB Atlas usage
3. Set up alerts for errors

---

## 💡 Cost Breakdown

### Render Free Tier:
- ✅ 3 services (backend, websocket, frontend) = **FREE**
- ⚠️ Spins down after 15 min inactivity
- ⚠️ 750 hours/month limit (combined across services)
- ⚠️ Slower cold starts (30-60 seconds)

### Render Paid Tier ($7/month per service):
- ✅ Always-on (no spin down)
- ✅ Faster performance
- ✅ More memory/CPU
- Total: $21/month for all 3 services

### MongoDB Atlas:
- ✅ M0 Free tier: **FREE forever**
- ✅ 512 MB storage
- ✅ Good for development/small apps

---

## 📞 Support

If you encounter issues:

1. **Check Render Docs**: https://render.com/docs
2. **Check this guide** for common issues
3. **Review service logs** on Render dashboard
4. **Check browser console** for frontend errors
5. **Test API endpoints** directly with curl/Postman

---

## ✅ Deployment Verification Checklist

- [ ] All 3 services show "Live ✅" on Render dashboard
- [ ] Backend API responds to `/api/members`
- [ ] Frontend loads without errors
- [ ] Can register new user
- [ ] Can login
- [ ] Members page shows data
- [ ] Chat connects to WebSocket
- [ ] Messages send and persist
- [ ] MongoDB shows data in Atlas dashboard

**If all checked ✅ - Congratulations! Your app is live! 🎉**

---

## 🚀 Quick Deploy Commands

After making code changes locally:

```powershell
# Commit and push to GitHub
git add .
git commit -m "Your commit message"
git push

# Render auto-deploys!
# No additional commands needed
# Check Render dashboard for deployment status
```

---

**Deployment Date**: November 11, 2025  
**Guide Version**: 1.0  
**Status**: Ready for production deployment 🚀
