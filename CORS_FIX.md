# 🚨 CORS FIX - REQUIRED STEPS

## ❌ Current Problem:
```
Access to fetch at 'https://backend-radio-2yxg.onrender.com/auth/login' 
from origin 'https://radioistic.netlify.app' has been blocked by CORS policy
```

## ✅ Solution:

### STEP 1: Fix Backend CORS (Render) - **REQUIRED!**

1. Go to: **https://dashboard.render.com**
2. Click on: **backend-radio-2yxg** service
3. Click: **Environment** tab
4. Add/Update these variables:

```env
CORS_ORIGIN=https://radioistic.netlify.app
FRONTEND_URL=https://radioistic.netlify.app
```

5. Click **"Save Changes"**
6. Wait for automatic redeploy (2-3 minutes)

---

### STEP 2: Update Frontend URLs (Netlify) - **REQUIRED!**

1. Go to: **https://app.netlify.com**
2. Select your **radioistic** site
3. Go to: **Site settings** → **Environment variables**
4. Add these 3 variables:

```env
NEXT_PUBLIC_API_URL=https://backend-radio-2yxg.onrender.com/api
NEXT_PUBLIC_SOCKET_URL=https://backend-radio-2yxg.onrender.com
NEXT_PUBLIC_SITE_URL=https://radioistic.netlify.app
```

5. Go to: **Deploys** → **Trigger deploy** → **Deploy site**
6. Wait for redeploy (3-5 minutes)

---

### STEP 3: Verify It Works

1. Wait for both services to finish redeploying
2. Go to: **https://radioistic.netlify.app**
3. Open browser DevTools (F12) → Console tab
4. Try to sign up or login
5. Should work without CORS errors!

---

## 📋 Quick Copy-Paste

### For Render Backend:
```
CORS_ORIGIN=https://radioistic.netlify.app
FRONTEND_URL=https://radioistic.netlify.app
```

### For Netlify Frontend:
```
NEXT_PUBLIC_API_URL=https://backend-radio-2yxg.onrender.com/api
NEXT_PUBLIC_SOCKET_URL=https://backend-radio-2yxg.onrender.com
NEXT_PUBLIC_SITE_URL=https://radioistic.netlify.app
```

---

## 🔍 How to Check If It's Fixed:

### Test Backend CORS:
```bash
curl -I https://backend-radio-2yxg.onrender.com/api/health
```
Should show: `Access-Control-Allow-Origin: https://radioistic.netlify.app`

### Test Frontend Connection:
1. Go to https://radioistic.netlify.app
2. Open DevTools → Network tab
3. Try to login
4. Check response headers - should see CORS headers
5. No errors = Fixed! ✅

---

## ⚠️ Common Mistakes:

❌ **Wrong:** `CORS_ORIGIN=https://radioistic.netlify.app/` (trailing slash)
✅ **Correct:** `CORS_ORIGIN=https://radioistic.netlify.app`

❌ **Wrong:** `NEXT_PUBLIC_API_URL=https://backend-radio-2yxg.onrender.com` (missing /api)
✅ **Correct:** `NEXT_PUBLIC_API_URL=https://backend-radio-2yxg.onrender.com/api`

---

## ⏱️ Timeline:
- **Step 1 (Render):** 2-3 minutes
- **Step 2 (Netlify):** 3-5 minutes
- **Total:** ~8 minutes to fix

---

**Last Updated:** November 12, 2025
**Status:** Waiting for environment variables to be set
