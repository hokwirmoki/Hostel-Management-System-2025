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

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};