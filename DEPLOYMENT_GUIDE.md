# 🚀 Radio Istic - Complete Deployment Guide

This guide will walk you through deploying your Radio Istic Dashboard with all features working correctly.

## 📋 Prerequisites

- GitHub account
- Netlify account (for frontend hosting)
- Render.com account (for WebSocket server)
- Supabase account (for database)

---

## 🗄️ STEP 1: Set Up Supabase Database

### 1.1 Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: radio-istic
   - **Database Password**: (create a strong password and save it)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait for database to be ready (1-2 minutes)

### 1.2 Create Database Tables

1. In your Supabase project, go to **SQL Editor**
2. Click "New query"
3. Paste this SQL code:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  avatar TEXT,
  field TEXT,
  year INTEGER,
  role TEXT DEFAULT 'member',
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id TEXT NOT NULL,
  sender_id UUID REFERENCES users(id),
  recipient_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  status TEXT DEFAULT 'sent',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  post_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create likes table
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  post_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can view all profiles" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Policies for messages table
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can insert own messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Policies for comments table
CREATE POLICY "Anyone can view comments" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for likes table
CREATE POLICY "Anyone can view likes" ON likes
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own likes" ON likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes" ON likes
  FOR DELETE USING (auth.uid() = user_id);
```

4. Click "Run" to execute
5. Verify tables were created in the **Table Editor**

### 1.3 Get Supabase Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (the long string starting with `eyJ...`)
3. Save these - you'll need them later

---

## 🌐 STEP 2: Deploy WebSocket Server to Render

### 2.1 Push WebSocket Server to GitHub

```bash
# Navigate to websocket-server directory
cd websocket-server

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial WebSocket server setup"

# Create a new repository on GitHub called "radio-istic-websocket"
# Then push to it
git remote add origin https://github.com/YOUR_USERNAME/radio-istic-websocket.git
git branch -M main
git push -u origin main
```

### 2.2 Deploy to Render

1. Go to [https://render.com](https://render.com)
2. Sign in and go to Dashboard
3. Click **New +** → **Web Service**
4. Connect your GitHub account if not already connected
5. Select the `radio-istic-websocket` repository
6. Configure the service:
   - **Name**: `radio-istic-websocket`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: **Free**
7. Click **Create Web Service**
8. Wait for deployment (2-3 minutes)
9. **Copy your Render URL** (e.g., `https://radio-istic-websocket.onrender.com`)

### 2.3 Test WebSocket Server

Open your browser and visit: `https://radio-istic-websocket.onrender.com`

You should see:
```json
{
  "status": "online",
  "connectedUsers": 0,
  "timestamp": "2025-11-10T..."
}
```

---

## 🎨 STEP 3: Deploy Frontend to Netlify

### 3.1 Update Environment Variables

1. In your main project, open `.env.local`
2. Update with your actual values:

```env
NEXT_PUBLIC_SOCKET_URL=https://radio-istic-websocket.onrender.com
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=https://radioistic.netlify.app
```

### 3.2 Push Changes to GitHub

```bash
# Make sure you're in the main project directory
cd ..

# Add all changes
git add .

# Commit
git commit -m "Add WebSocket server, Supabase integration, and Spotify player"

# Push to GitHub
git push origin main
```

### 3.3 Configure Netlify

1. Go to [https://netlify.com](https://netlify.com)
2. Sign in and go to **Sites**
3. Find your **radioistic** site
4. Go to **Site configuration** → **Environment variables**
5. Click **Add a variable** and add these:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SOCKET_URL` | `https://radio-istic-websocket.onrender.com` |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `NEXT_PUBLIC_SITE_URL` | `https://radioistic.netlify.app` |

6. Click **Save**

### 3.4 Trigger Redeploy

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait for build to complete (3-5 minutes)

---

## ✅ STEP 4: Verify Everything Works

### 4.1 Test Checklist

Visit `https://radioistic.netlify.app` and verify:

- [x] Site loads without errors
- [x] Light/Dark theme toggle works
- [x] Can sign up for a new account
- [x] Can log in
- [x] Real-time chat works (open in two browsers)
- [x] Podcasts page shows Spotify player
- [x] YouTube videos load
- [x] No console errors

### 4.2 Check Browser Console

Press `F12` and check console. You should see:
```
🔌 Connecting to WebSocket server: https://radio-istic-websocket.onrender.com
✅ WebSocket connected
🔐 User authenticated: your-email@example.com
```

### 4.3 Test Real-Time Chat

1. Open site in two different browsers (or incognito)
2. Log in with different accounts in each
3. Try sending messages
4. Messages should appear instantly in both browsers

---

## 🎵 STEP 5: Add Spotify Podcast Episodes (Optional)

### 5.1 Get Spotify Episode IDs

1. Go to [Spotify for Podcasters](https://podcasters.spotify.com/)
2. Upload your podcast episodes
3. For each episode, get the Episode ID from the URL:
   ```
   https://open.spotify.com/episode/2ePzduTwuu4OsYRw9DTJb5
                                      ^^^^^^^^^^^^^^^^^^^^^^
                                      This is the Episode ID
   ```

### 5.2 Update Podcasts Page

Edit `app/podcasts/page.tsx`:

```typescript
<SpotifyPlayer episodeId="YOUR_EPISODE_ID_HERE" />
```

---

## 🐛 Troubleshooting

### WebSocket Not Connecting

**Problem**: Console shows "Connection error"

**Solution**:
1. Verify Render service is running
2. Check `NEXT_PUBLIC_SOCKET_URL` in Netlify env vars
3. Ensure URL doesn't have trailing slash
4. Wait 30 seconds (Render free tier has cold starts)

### Supabase Errors

**Problem**: "Invalid API key" or "Failed to fetch"

**Solution**:
1. Verify credentials in `.env.local` and Netlify
2. Check Supabase project is not paused
3. Verify SQL tables were created successfully

### Light Theme Not Working

**Problem**: Text invisible in light mode

**Solution**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+Shift+R)
3. Verify globals.css has light theme fixes

### Chat Messages Not Sending

**Problem**: Messages don't appear

**Solution**:
1. Check WebSocket connection in console
2. Verify user is authenticated
3. Check Render logs for errors
4. Ensure both users are online

---

## 📊 Monitoring

### Check Render Logs

1. Go to Render Dashboard
2. Click your service
3. Go to **Logs** tab
4. Watch for connection events:
   ```
   ✅ User connected: ABC123
   🔐 User authenticated: user@example.com
   💬 Message received: {...}
   ```

### Check Netlify Deploy Logs

1. Go to Netlify Dashboard
2. Click your site
3. Go to **Deploys**
4. Click latest deploy
5. Review build logs for errors

---

## 🎉 Success!

Your Radio Istic Dashboard is now fully deployed with:

✅ Real-time messaging
✅ Persistent authentication
✅ Database storage
✅ Spotify podcast player
✅ YouTube integration
✅ Working light/dark themes
✅ Professional production setup

---

## 📝 Maintenance Tips

### Update WebSocket Server

```bash
cd websocket-server
# Make changes
git add .
git commit -m "Update server"
git push
# Render auto-deploys
```

### Update Frontend

```bash
# Make changes
git add .
git commit -m "Update frontend"
git push
# Netlify auto-deploys
```

### Backup Database

1. Go to Supabase Dashboard
2. Click **Database** → **Backups**
3. Download backup SQL file
4. Store safely

---

## 🆘 Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review Render and Netlify logs
3. Check Supabase logs in Dashboard
4. Verify all environment variables
5. Test with `npm run dev` locally first

---

## 🔐 Security Notes

**Important**: Before going fully public:

1. **Hash passwords** in auth-context.tsx (currently plain text)
2. **Add rate limiting** to prevent spam
3. **Enable HTTPS** only (Netlify does this automatically)
4. **Review Supabase RLS policies** for your use case
5. **Set up Supabase Auth** instead of custom auth

---

Good luck with your Radio Istic Dashboard! 🎙️📻
