const express = require('express');
const router = express.Router();

// Sample room data for testing
const sampleRooms = [
  {
    _id: '1',
    title: 'Deluxe Room',
    roomNumber: '101',
    type: 'Deluxe',
    price: 100,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: '2',
    title: 'Standard Room',
    roomNumber: '102',
    type: 'Standard',
    price: 75,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'
  }
];

router.get('/', (req, res) => {
  return res.json(sampleRooms);
});

router.get('/:id', (req, res) => {
  const room = sampleRooms.find(r => r._id === req.params.id);
  if (!room) {
    return res.status(404).json({ message: 'Room not found' });
  }
  return res.json(room);
});

module.exports = router;
