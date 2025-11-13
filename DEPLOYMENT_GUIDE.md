# 🚀 DEPLOYMENT GUIDE - Radio ISTIC Dashboard

## Quick Links
- [Backend Deployment (Render)](#backend-deployment-render)
- [Frontend Deployment (Netlify)](#frontend-deployment-netlify)
- [Post-Deployment Testing](#post-deployment-testing)
- [Troubleshooting](#troubleshooting)

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### 1. Local Testing
- [ ] Run `npm run build` on frontend → Should complete without errors
- [ ] Start backend: `cd backend-api && npm start` → Should connect to MongoDB
- [ ] Start frontend: `npm run dev` → Should load on localhost:3000
- [ ] Test full authentication flow:
  - [ ] Sign up new user
  - [ ] Login with email/password
  - [ ] Update profile (name, phone, coordination)
  - [ ] Upload avatar image
  - [ ] Logout
- [ ] Test WebSocket chat:
  - [ ] Open 2 browser windows (2 different users)
  - [ ] Send messages between users
  - [ ] Verify messages persist (check MongoDB)
  - [ ] Check typing indicators work
  - [ ] Verify online/offline status updates
- [ ] Test all pages:
  - [ ] Members page loads
  - [ ] Events page loads
  - [ ] Bureau page loads
  - [ ] Settings page loads
  - [ ] Chat page loads
- [ ] Check browser console → No errors
- [ ] Check backend logs → No errors

### 2. Code Quality
- [ ] Run `npm run lint` → Fix all errors
- [ ] Run `npm audit` → Fix critical vulnerabilities
- [ ] Remove all `console.log()` for production (optional)
- [ ] Verify `.env` files are in `.gitignore`
- [ ] Remove any test API keys or secrets

### 3. Environment Variables
- [ ] All `.env` files NOT committed to Git
- [ ] `.env.example` files complete and documented
- [ ] MongoDB URI is production connection string
- [ ] JWT_SECRET is strong (32+ characters)
- [ ] CORS origins match production domains

### 4. Security
- [ ] Run `git log --all --full-history -- "*env*"` → Should show no .env commits
- [ ] Check for hardcoded secrets in code → None found
- [ ] Verify rate limiting enabled on auth routes
- [ ] Verify helmet security headers enabled
- [ ] Verify file upload validation working

---

## 🔧 BACKEND DEPLOYMENT (Render)

### Step 1: Prepare Backend
1. Open terminal in `backend-api` directory
2. Verify package.json has correct scripts:
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js",
       "build": "echo 'No build required'"
     }
   }
   ```

### Step 2: Create Render Web Service
1. Go to https://dashboard.render.com
2. Click **"New +"** → Select **"Web Service"**
3. Connect your GitHub repository
4. Configure service:
   - **Name**: `radio-istic-api` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main` or `master`
   - **Root Directory**: `backend-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free` (for testing) or `Starter` (for production)

### Step 3: Add Environment Variables
Click **"Environment"** → Add the following:

```bash
# Required - MongoDB Connection
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/radio-istic?retryWrites=true&w=majority

# Required - JWT Configuration
JWT_SECRET=<generate-new-secret-see-below>
JWT_EXPIRE=7d

# Required - Server Configuration
NODE_ENV=production
PORT=5000

# Required - CORS (Update after getting Netlify URL)
CORS_ORIGIN=https://your-app.netlify.app
FRONTEND_URL=https://your-app.netlify.app

# Optional - Cloudinary (for future file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Generate JWT_SECRET**:
```bash
# Run this in terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy the output → Use as JWT_SECRET
```

**Get MongoDB URI**:
1. Go to MongoDB Atlas → https://cloud.mongodb.com
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy connection string
5. Replace `<password>` with your database password
6. Add `/radio-istic` after `.net/` (database name)

### Step 4: Deploy
1. Click **"Create Web Service"**
2. Wait for build to complete (3-5 minutes)
3. Check logs for:
   ```
   ✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
   📦 Database: radio-istic
   🚀 Radio Istic API server running on port 5000
   ```
4. If successful, copy your Render URL: `https://radio-istic-api.onrender.com`

### Step 5: Test Backend API
Test endpoints with curl or Postman:

```bash
# Health check
curl https://your-app.onrender.com/api/health

# Should return:
# {"status":"OK","uptime":123,"timestamp":1234567890}

# Test register (create test user)
curl -X POST https://your-app.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"Test",
    "lastName":"User",
    "email":"test@example.com",
    "password":"test123",
    "field":"GLSI",
    "year":1
  }'

# Should return:
# {"success":true,"token":"...", "user":{...}}
```

---

## 🌐 FRONTEND DEPLOYMENT (Netlify)

### Step 1: Prepare Frontend
1. Open terminal in project root
2. Create production environment file:
   ```bash
   # Create .env.production
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
   NEXT_PUBLIC_SOCKET_URL=https://your-backend.onrender.com
   NEXT_PUBLIC_SITE_URL=https://your-app.netlify.app
   ```
3. Add to `.gitignore`:
   ```
   .env.production
   ```

### Step 2: Update Netlify Configuration
Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18.17.0"
```

### Step 3: Create Netlify Site
1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to GitHub
4. Select your repository
5. Configure build settings:
   - **Base directory**: Leave empty
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Branch**: `main` or `master`

### Step 4: Add Environment Variables
Click **"Site settings"** → **"Environment variables"** → Add:

```bash
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
NEXT_PUBLIC_SOCKET_URL=https://your-backend.onrender.com
NEXT_PUBLIC_SITE_URL=https://your-app.netlify.app
```

**IMPORTANT**: Replace `your-backend.onrender.com` with your actual Render URL from Step 4 above!

### Step 5: Deploy
1. Click **"Deploy site"**
2. Wait for build (5-10 minutes)
3. Once deployed, copy your Netlify URL: `https://your-app.netlify.app`

### Step 6: Update Backend CORS
1. Go back to Render dashboard
2. Open your backend service
3. Click **"Environment"**
4. Update these variables with your Netlify URL:
   ```bash
   CORS_ORIGIN=https://your-actual-app.netlify.app
   FRONTEND_URL=https://your-actual-app.netlify.app
   ```
5. Click **"Save Changes"**
6. Render will automatically redeploy (1-2 minutes)

### Step 7: Update MongoDB Atlas IP Whitelist
1. Go to MongoDB Atlas
2. Click "Network Access"
3. Click "Add IP Address"
4. Select "Allow Access from Anywhere" (0.0.0.0/0)
   - **Note**: For better security, add only Render IPs (see Render docs)
5. Click "Confirm"

---

## ✅ POST-DEPLOYMENT TESTING

### 1. Test Authentication
- [ ] Go to `https://your-app.netlify.app`
- [ ] Click "Sign Up"
- [ ] Create new account
- [ ] Verify redirect to members page
- [ ] Check MongoDB Atlas → New user should appear
- [ ] Logout
- [ ] Login with same credentials
- [ ] Should work without errors

### 2. Test WebSocket Connection
- [ ] Open browser DevTools (F12)
- [ ] Go to Console tab
- [ ] Should see: `✅ WebSocket connected to backend on port 5000`
- [ ] Open 2 browser windows (or 2 devices)
- [ ] Login as different users
- [ ] Send chat message from User A
- [ ] User B should receive message in real-time
- [ ] Check MongoDB → Message should be saved

### 3. Test File Upload
- [ ] Login to production site
- [ ] Go to Settings page
- [ ] Upload new avatar image
- [ ] Should see success message
- [ ] Refresh page → Avatar should persist
- [ ] Check Render logs → Should see upload activity

### 4. Test All Pages
- [ ] Members page loads
- [ ] Events page loads
- [ ] Bureau page loads
- [ ] Training page loads
- [ ] Media page loads
- [ ] Club Life page loads
- [ ] Sponsors page loads
- [ ] Chat page works

### 5. Performance Check
- [ ] Open Lighthouse in Chrome DevTools
- [ ] Run audit
- [ ] Performance should be 70+ (acceptable)
- [ ] Accessibility should be 90+ (good)
- [ ] Best Practices should be 90+ (good)

### 6. Mobile Testing
- [ ] Open site on mobile device
- [ ] Test navigation
- [ ] Test chat
- [ ] Test file upload
- [ ] Check responsive design

---

## 🐛 TROUBLESHOOTING

### Issue: Backend not connecting to MongoDB
**Symptoms**: Render logs show "❌ MongoDB connection failed"

**Solutions**:
1. Check MongoDB Atlas IP whitelist includes 0.0.0.0/0
2. Verify MONGODB_URI in Render environment variables
3. Check MongoDB password doesn't contain special characters
4. Use URL encoding for password: `myPass@123` → `myPass%40123`

### Issue: Frontend can't reach backend API
**Symptoms**: Network errors in browser console, 404 or CORS errors

**Solutions**:
1. Verify NEXT_PUBLIC_API_URL is correct in Netlify env vars
2. Check backend CORS_ORIGIN matches Netlify URL exactly
3. Ensure backend is running (check Render dashboard)
4. Test backend API directly with curl (see Step 5 above)
5. Check Render logs for errors

### Issue: WebSocket connection fails
**Symptoms**: Chat doesn't work, console shows WebSocket error

**Solutions**:
1. Verify NEXT_PUBLIC_SOCKET_URL points to Render URL (NOT localhost)
2. Check backend is running on port 5000
3. Verify JWT token is valid (check localStorage in DevTools)
4. Check Render logs for Socket.IO errors
5. Test with `wss://` protocol if `https://` doesn't work

### Issue: File uploads fail
**Symptoms**: Avatar upload returns error or doesn't save

**Solutions**:
1. Check Render filesystem limits (free tier has 512MB)
2. Verify upload middleware is working (check backend logs)
3. Consider implementing Cloudinary for production
4. Check file size limit (max 5MB)

### Issue: Build fails on Netlify
**Symptoms**: Deployment fails, build logs show errors

**Solutions**:
1. Run `npm run build` locally first
2. Check for TypeScript errors: `npm run lint`
3. Verify all dependencies are in package.json
4. Check Node version matches (18.x)
5. Review Netlify build logs for specific error

### Issue: "Application Error" on Render
**Symptoms**: Backend shows generic error page

**Solutions**:
1. Check Render logs for crash reason
2. Verify PORT environment variable is set to 5000
3. Check if MongoDB connection succeeded
4. Verify all required env vars are set
5. Check for syntax errors in server.js

### Issue: CORS errors in production
**Symptoms**: Browser console shows "blocked by CORS policy"

**Solutions**:
1. Verify CORS_ORIGIN in Render matches Netlify URL exactly
2. No trailing slashes: ✅ `https://app.netlify.app` ❌ `https://app.netlify.app/`
3. Check protocol: must be `https://` (not `http://`)
4. Redeploy backend after changing CORS settings

---

## 📊 MONITORING & MAINTENANCE

### Daily Checks
- [ ] Check Render dashboard for uptime
- [ ] Check MongoDB Atlas for connection spikes
- [ ] Review error logs in Render

### Weekly Checks
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Check disk usage on Render
- [ ] Review MongoDB storage (free tier = 512MB)
- [ ] Check for user-reported issues

### Monthly Checks
- [ ] Update dependencies: `npm update`
- [ ] Review MongoDB indexes performance
- [ ] Check for new Next.js/React versions
- [ ] Backup MongoDB data

### Setup Monitoring (Optional)
1. **UptimeRobot** (Free): Monitor site uptime
   - Add monitor for `https://your-app.netlify.app`
   - Add monitor for `https://your-backend.onrender.com/api/health`

2. **Sentry** (Free tier): Error tracking
   - Already installed in project!
   - Add DSN to environment variables
   - Get real-time error notifications

3. **MongoDB Atlas Alerts**: Database monitoring
   - Go to Atlas → Alerts
   - Enable alerts for connection spikes, high CPU, low storage

---

## 🎉 SUCCESS CRITERIA

Your deployment is successful if:
- ✅ Frontend loads at Netlify URL
- ✅ Backend API responds to health check
- ✅ Users can sign up and login
- ✅ WebSocket chat works in real-time
- ✅ File uploads work
- ✅ Data persists in MongoDB
- ✅ No errors in browser console
- ✅ No errors in Render logs
- ✅ Mobile responsive
- ✅ All pages load under 3 seconds

---

## 📞 SUPPORT

If you encounter issues not covered here:
1. Check Render documentation: https://render.com/docs
2. Check Netlify documentation: https://docs.netlify.com
3. Check MongoDB Atlas docs: https://docs.atlas.mongodb.com
4. Review project logs carefully
5. Test locally first before debugging production

---

**Last Updated**: After audit fixes on November 12, 2025
**Deployment Time**: ~30-45 minutes (first time)
