// server/routes/room.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/auth');
const Room = require('../models/Room');
const Message = require('../models/Message');

// Create a new room (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const roomId = uuidv4();
    const room = new Room({ roomId, owner: req.user.id });
    await room.save();
    res.status(201).json({ roomId, message: 'Room created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get room details (protected, just to verify existence)
router.get('/:roomId', authMiddleware, async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ roomId: room.roomId, owner: room.owner });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get previous chat messages for a room (protected)
router.get('/:roomId/messages', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId })
      .sort({ createdAt: 1 })
      .select('-_id username message createdAt');
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
