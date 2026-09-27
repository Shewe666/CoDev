// server/server.js
// Load .env from the project root (one level up from /server)
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/room');
const socketHandler = require('./sockets/socket');

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

// Simple health check
app.get('/', (req, res) => res.send('CoDev server is running'));

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    console.error('Make sure MONGODB_URI is set in your .env file');
  });

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Initialize socket event handlers
socketHandler(io);

server.listen(PORT, () => {
  console.log(`CoDev backend running on http://localhost:${PORT}`);
});
