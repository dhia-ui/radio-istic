# ⚡ Quick Start Guide - Radio Istic Dashboard

## 🚀 Get Started in 3 Minutes

### Step 1: Setup Environment (30 seconds)

```bash
# Copy environment variables
copy .env.local.example .env.local

# Edit .env.local if needed (optional for development)
# Default values work out of the box!
```

### Step 2: Install Dependencies (1 minute)

```bash
npm install
```

### Step 3: Start the Server (1 minute)

```bash
npm run dev
```

**That's it!** 🎉

Your application is now running:
- 🌐 **Next.js**: http://localhost:3000
- 🔌 **WebSocket**: http://localhost:3001

---

## 📋 What's Working Out of the Box

✅ **Complete UI** with dark theme and neon effects  
✅ **Member Directory** with 40+ members  
✅ **Events System** with upcoming events  
✅ **Authentication** with role-based access  
✅ **WebSocket Server** ready for real-time chat  
✅ **Avatar Upload API** with file validation  
✅ **3D Effects & Glassmorphism** CSS classes  

---

## 🎯 Quick Features Test

### Test the Dashboard
1. Go to http://localhost:3000
2. You should see the homepage with stats and hero section
3. Dark theme with neon blue/lime accents is active

### Test Member Directory
1. Click "Members" in the sidebar (or go to `/members`)
2. See 40+ member profiles
3. Try filtering by field or year
4. Click on a member to see their profile modal

### Test Events
1. Click "Events" (or go to `/events`)
2. See upcoming events (tournaments, podcasts, trips)
3. Each event shows date, location, participants

### Test Login
1. Click "Login" (or go to `/login`)
2. Use any email from the members list
3. Example: `aziz.mehri@radioistic.tn` (President)
4. Password: any text (mock authentication)

---

## 🛠️ Development Commands

```bash
# Start development (Next.js + Socket.io)
npm run dev

# Start Next.js only (without WebSocket)
npm run dev:next-only

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## 📁 Key Files to Know

### Configuration
- `package.json` - Dependencies and scripts
- `.env.local` - Environment variables
- `app/globals.css` - Global styles and theme
- `server.js` - Socket.io server

### Core Features
- `lib/socket-client.ts` - WebSocket client
- `hooks/use-socket.ts` - WebSocket React hook
- `components/avatar-picker.tsx` - Avatar selection
- `lib/auth-context.tsx` - Authentication

### Documentation
- `README.md` - Full project documentation
- `IMPLEMENTATION_GUIDE.md` - Next steps guide
- `SUMMARY.md` - What's been completed
- `QUICK_START.md` - This file!

---

## 🎨 Using 3D Effects

Add these classes to any element:

```tsx
// 3D Card with lift on hover
<div className="card-3d-lift">Content</div>

// Glassmorphism background
<div className="glass">Content</div>

// Neon glow effect
<button className="neon-glow-blue">Click me</button>

// Floating animation
<div className="floating">Floats up and down</div>

// 3D Avatar ring
<Avatar className="avatar-ring-3d" />
```

---

## 💬 Testing WebSocket

### Check Connection
1. Open browser console (F12)
2. Start the app with `npm run dev`
3. Look for: `✅ Next.js ready on http://localhost:3000`
4. Look for: `✅ Socket.io server ready on http://localhost:3001`
5. Check browser console for: `[Socket.io] Connected: <socket-id>`

### Manual Test
Open browser console and try:

```javascript
// The socket is automatically initialized when you log in
// Check if it's connected
console.log('Socket connected:', window.socket?.connected)
```

---

## 📸 Testing Avatar Upload

1. Log in to the app
2. Go to Settings page (implement integration first - see IMPLEMENTATION_GUIDE.md)
3. Click "Change Avatar"
4. Either:
   - Select a preset avatar from the gallery, OR
   - Drag & drop an image (max 5MB, JPG/PNG/WEBP)
5. Click "Save Avatar" or "Upload Avatar"

**Note:** Avatar picker is built but needs to be integrated into settings page. See `IMPLEMENTATION_GUIDE.md` Step 5.

---

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Error: Port 3000 is already in use
# Solution: Kill the process or change port in .env.local
PORT=3001 npm run dev
```

### Module Not Found
```bash
# Error: Cannot find module 'X'
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### WebSocket Not Connecting
```bash
# Check if Socket.io server is running
# Look for: "✅ Socket.io server ready on http://localhost:3001"
# If not, server.js might have errors - check terminal output
```

### CSS Not Loading
```bash
# Restart development server
# Press Ctrl+C to stop
# Run: npm run dev
```

---

## 📚 Next Steps

Once you've tested the basic features:

1. **Read `IMPLEMENTATION_GUIDE.md`** for detailed next steps
2. **Add default avatars** to `public/avatars/defaults/`
3. **Integrate avatar picker** into settings page
4. **Apply 3D effects** to more components
5. **Complete chat implementation** with real WebSocket

---

## 💡 Tips

### Development
- Use `console.log` freely - they'll be removed in production
- Test on both desktop and mobile (responsive design is built-in)
- Use browser DevTools to inspect 3D effects (check computed styles)

### Design
- All colors are in `app/globals.css` under `:root` and `.dark`
- 3D effects are in `styles/3d-effects.css`
- Modify variables in `globals.css` to customize theme

### Performance
- Images are automatically optimized by Next.js
- Lazy loading is enabled by default
- Socket.io has auto-reconnection built-in

---

## 🎯 Your First Task

**Goal:** Apply a 3D effect to the homepage hero section

1. Open `app/page.tsx`
2. Find the hero section (look for "Rejoignez la communauté")
3. Add `card-3d-lift glass` to the className
4. Save and see the effect!

**Before:**
```tsx
<div className="relative overflow-hidden rounded-xl bg-gradient-to-br ...">
```

**After:**
```tsx
<div className="relative overflow-hidden rounded-xl bg-gradient-to-br ... card-3d-lift glass">
```

Save, refresh browser, and hover over the hero section! ✨

---

## 🆘 Need Help?

1. Check `SUMMARY.md` for what's completed
2. Read `IMPLEMENTATION_GUIDE.md` for detailed steps
3. See `README.md` for full documentation
4. Check console logs for errors
5. Contact Radio Istic development team

---

## 🎉 Congratulations!

You now have a **production-ready foundation** for the Radio Istic Dashboard!

The infrastructure is complete. Now it's time to:
- ✅ Add your content (avatars, events, members)
- ✅ Complete feature integration
- ✅ Apply 3D effects everywhere
- ✅ Test thoroughly
- ✅ Deploy to production

**Happy coding!** 🚀

---

**Last Updated:** November 9, 2025  
**Version:** 1.0.0  
**Status:** Ready to Build 🏗️
