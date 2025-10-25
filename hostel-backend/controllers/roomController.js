const Room = require('../models/Room');

exports.createRoom = async (req, res) => {
  try {
    const { title, description, roomNumber, pricePerNight, capacity, amenities = [], images = [] } = req.body;
    const exists = await Room.findOne({ roomNumber });
    if (exists) return res.status(400).json({ message: 'Room number already exists' });

    const room = new Room({ title, description, roomNumber, pricePerNight, capacity, amenities, images });
    await room.save();
    res.json(room);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};