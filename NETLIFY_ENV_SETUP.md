# 🚨 NETLIFY ENVIRONMENT VARIABLES - EXACT STEPS

## Current Problem:
Your frontend is calling:
```
❌ https://backend-radio-2yxg.onrender.com/auth/login
```

It should call:
```
✅ https://backend-radio-2yxg.onrender.com/api/auth/login
```

---

## ✅ SOLUTION: Add Environment Variables (10 minutes)

### STEP 1: Go to Netlify
1. Open: **https://app.netlify.com**
2. Login if needed
3. You should see your sites list

### STEP 2: Select Your Site
1. Click on: **radioistic** site (or whatever it's named)
2. You'll see the site overview page

### STEP 3: Go to Site Settings
1. Click: **"Site settings"** button (top right area)
2. You'll see a left sidebar menu

### STEP 4: Open Environment Variables
1. In the left sidebar, scroll down
2. Click: **"Environment variables"** (under "Build & deploy" section)
3. You'll see a list of variables (might be empty)

### STEP 5: Add Variable #1 - API_URL
1. Click: **"Add a variable"** button (or "Add variable" dropdown)
2. Select: **"Add a single variable"**
3. In the form:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://backend-radio-2yxg.onrender.com/api`
   - **Scope:** All scopes (or select "Production" and "Deploy Previews")
4. Click: **"Create variable"** button
5. ✅ You should see it in the list

### STEP 6: Add Variable #2 - SOCKET_URL
1. Click: **"Add a variable"** again
2. Select: **"Add a single variable"**
3. In the form:
   - **Key:** `NEXT_PUBLIC_SOCKET_URL`
   - **Value:** `https://backend-radio-2yxg.onrender.com`
4. Click: **"Create variable"**
5. ✅ You should see it in the list

### STEP 7: Add Variable #3 - SITE_URL
1. Click: **"Add a variable"** again
2. Select: **"Add a single variable"**
3. In the form:
   - **Key:** `NEXT_PUBLIC_SITE_URL`
   - **Value:** `https://radioistic.netlify.app`
4. Click: **"Create variable"**
5. ✅ You should see all 3 variables now

### STEP 8: Trigger a New Deploy (CRITICAL!)
**⚠️ Variables only work AFTER a new deploy!**

1. Click: **"Deploys"** tab (top navigation)
2. Click: **"Trigger deploy"** button (dropdown)
3. Select: **"Deploy site"**
4. You'll see "Site deploy in progress"
5. **WAIT** for the deploy to finish (3-5 minutes)
6. Status will change to: **"Published"** (green checkmark)

### STEP 9: Verify Variables Took Effect
1. Go to your site: **https://radioistic.netlify.app**
2. Open browser DevTools: Press **F12**
3. Go to **Console** tab
4. Type and press Enter:
   ```javascript
   console.log(process.env)
   ```
5. OR check Network tab when trying to login
6. Should see requests going to `/api/auth/login` now

### STEP 10: Test Login/Signup
1. Clear browser cache: **Ctrl+Shift+Delete** > Clear data
2. Go to: **https://radioistic.netlify.app**
3. Try to **Sign Up** or **Login**
4. Should work! ✅

---

## 🔍 Troubleshooting

### Issue: Still getting CORS errors
**Solution:** 
- Make sure you triggered a NEW deploy after adding variables
- Check deploy logs: Deploys tab > Click latest deploy > Check "Deploy log"
- Verify variables are visible: Site settings > Environment variables

### Issue: Variables not showing in console
**Solution:**
- Variables MUST start with `NEXT_PUBLIC_` to be available in browser
- Must redeploy for changes to take effect
- Check spelling: `NEXT_PUBLIC_API_URL` (exact case)

### Issue: Deploy fails
**Solution:**
- Check deploy logs for errors
- Make sure your Git branch is up to date
- Try clearing build cache: Site settings > Build & deploy > Clear cache

---

## 📋 Quick Copy-Paste

**Variable 1:**
```
Key: NEXT_PUBLIC_API_URL
Value: https://backend-radio-2yxg.onrender.com/api
```

**Variable 2:**
```
Key: NEXT_PUBLIC_SOCKET_URL
Value: https://backend-radio-2yxg.onrender.com
```

**Variable 3:**
```
Key: NEXT_PUBLIC_SITE_URL
Value: https://radioistic.netlify.app
```

---

## ⏱️ Timeline
- Add variables: 2 minutes
- Trigger deploy: 30 seconds
- Wait for deploy: 3-5 minutes
- Test: 1 minute
- **Total: ~8 minutes**

---

## ✅ Success Criteria

After following all steps, you should:
1. ✅ See 3 environment variables in Netlify
2. ✅ See "Published" status on latest deploy
3. ✅ Be able to sign up/login without CORS errors
4. ✅ See `/api/auth/login` in Network tab (not `/auth/login`)

---

**Last Updated:** November 12, 2025  
**Status:** Waiting for Netlify environment variables + redeploy
