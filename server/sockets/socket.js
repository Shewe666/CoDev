// server/sockets/socket.js
module.exports = (io) => {
  // In-memory store: { roomId: { code: '', clients: {} } }
  const roomData = {};

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // User joins a room
    socket.on('join', ({ roomId, username }) => {
      socket.join(roomId);

      // Initialize room if first person
      if (!roomData[roomId]) {
        roomData[roomId] = { code: '', clients: {} };
      }

      // Store client info
      roomData[roomId].clients[socket.id] = { socketId: socket.id, username };

      // Tell everyone in the room about current participants
      io.in(roomId).emit('joined', {
        clients: Object.values(roomData[roomId].clients),
        username,
        socketId: socket.id,
      });

      // Send current code to the new user only
      socket.emit('sync-code', { code: roomData[roomId].code });
    });

    // Broadcast code changes to others in the room
    socket.on('code-change', ({ roomId, code }) => {
      if (roomData[roomId]) {
        roomData[roomId].code = code;
        // broadcast to everyone EXCEPT the sender
        socket.to(roomId).emit('code-change', { code });
      }
    });

    // Chat message received - save to DB and broadcast
    socket.on('send-message', async ({ roomId, username, message }) => {
      try {
        const Message = require('../models/Message');
        await Message.create({ roomId, username, message });
      } catch (e) {
        console.error('Error saving message:', e);
      }
      // Send to everyone in the room (including sender so they see it)
      io.in(roomId).emit('receive-message', { username, message, createdAt: new Date() });
    });

    // User explicitly leaves the room
    socket.on('leave', ({ roomId }) => {
      const username = roomData[roomId]?.clients[socket.id]?.username;
      socket.leave(roomId);
      if (roomData[roomId]) {
        delete roomData[roomId].clients[socket.id];
        // Tell remaining users
        io.in(roomId).emit('joined', {
          clients: Object.values(roomData[roomId].clients),
        });
        if (username) {
          io.in(roomId).emit('disconnected', { socketId: socket.id, username });
        }
      }
    });

    // Handle unexpected disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      for (const roomId in roomData) {
        if (roomData[roomId].clients[socket.id]) {
          const username = roomData[roomId].clients[socket.id].username;
          delete roomData[roomId].clients[socket.id];
          io.in(roomId).emit('joined', {
            clients: Object.values(roomData[roomId].clients),
          });
          io.in(roomId).emit('disconnected', { socketId: socket.id, username });
        }
      }
    });
  });
};
