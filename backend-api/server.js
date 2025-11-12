const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/database');
const { initializeWebSocket } = require('./websocket-server');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Create HTTP server
const httpServer = http.createServer(app);

// Connect to MongoDB
connectDB();

// Security Middleware - Apply before other middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false, // Disable for API
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// CORS Configuration
const corsOptions = {
  origin: [
    'https://radioistic.netlify.app',
    'http://localhost:3000',
    'http://localhost:5173',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (avatars, uploads, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use('/avatars', express.static(path.join(__dirname, 'public', 'avatars')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/members', require('./routes/members'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/events', require('./routes/events'));
app.use('/api/media', require('./routes/media'));
app.use('/api/sponsors', require('./routes/sponsors'));
app.use('/api/club-life', require('./routes/club-life'));
app.use('/api/comments', require('./routes/comments'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Radio Istic API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API endpoint not found' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Initialize WebSocket server
const io = initializeWebSocket(httpServer);

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Radio Istic API server running on port ${PORT}`);
  console.log(`� WebSocket server running on port ${PORT}`);
  console.log(`�📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: localhost:3000, localhost:5173, radioistic.netlify.app`);
});
