const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIo = require('socket.io');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const gigRoutes = require('./routes/gigs');
const bidRoutes = require('./routes/bids');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('✅ New client connected:', socket.id);

  // Join user room
  socket.on('join-user-room', (userId) => {
    if (userId) {
      socket.join(`user-${userId}`);
      console.log(`👤 User ${userId} joined their room: user-${userId}`);
    } else {
      console.warn('⚠️ Attempted to join room without userId');
    }
  });

  // Leave user room (optional, for cleanup)
  socket.on('leave-user-room', (userId) => {
    if (userId) {
      socket.leave(`user-${userId}`);
      console.log(`👋 User ${userId} left their room`);
    }
  });

  // Handle disconnect
  socket.on('disconnect', (reason) => {
    console.log(`❌ Client disconnected: ${socket.id}, reason: ${reason}`);
  });

  // Handle connection errors
  socket.on('error', (error) => {
    console.error('❌ Socket error:', error);
  });
});

// Make io accessible to routes
app.set('io', io);

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Swagger Documentation
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'GigFlow API Documentation',
  customfavIcon: '/favicon.ico'
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/bids', bidRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    error: message,
  });
});

const PORT = process.env.PORT || 5001;

// Handle server errors (e.g., EADDRINUSE) and process-level failures
server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  }
  console.error('Server error:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Attempt graceful shutdown
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, io };