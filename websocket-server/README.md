# Radio Istic WebSocket Server

## Deployment to Render.com

1. Push this folder to GitHub
2. Go to Render.com Dashboard
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: radio-istic-websocket
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
6. Add Environment Variables (if needed)
7. Deploy

## Your Server URL
After deployment, you'll get: `https://radio-istic-websocket.onrender.com`

Use this URL in your frontend configuration.

## Local Development

```bash
npm install
npm run dev
```

Server will run on http://localhost:3001

## Testing

Open browser console and test connection:
```javascript
const socket = io('http://localhost:3001');
socket.on('connect', () => console.log('Connected!'));
```
