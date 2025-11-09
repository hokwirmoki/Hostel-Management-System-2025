const Room = require('../models/Room');
const Booking = require('../models/Booking');

// Fetch all rooms (admin)
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    console.error('Error fetching rooms:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch available rooms (students)
exports.getAvailableRooms = async (req, res) => {
  try {
    const confirmedBookings = await Booking.find({ status: 'confirmed' }).select('room');
    const bookedRoomIds = confirmedBookings.map(b => b.room.toString());

    const availableRooms = await Room.find({ _id: { $nin: bookedRoomIds } });
    res.json(availableRooms);
  } catch (err) {
    console.error('Error fetching available rooms:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch single room by ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) {
    console.error('Error fetching room:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create room
exports.createRoom = async (req, res) => {
  try {
    const images = req.files ? req.files.map(file => '/uploads/' + file.filename) : [];
    const newRoom = new Room({ ...req.body, images });
    await newRoom.save();
    res.status(201).json({ message: 'Room created', room: newRoom });
  } catch (err) {
    console.error('Error creating room:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update room
exports.updateRoom = async (req, res) => {
  try {
    const images = req.files ? req.files.map(file => '/uploads/' + file.filename) : undefined;
    const updateData = images ? { ...req.body, images } : req.body;

    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ message: 'Room updated', room: updatedRoom });
  } catch (err) {
    console.error('Error updating room:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete room
exports.deleteRoom = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Room deleted' });
  } catch (err) {
    console.error('Error deleting room:', err);
    res.status(500).json({ message: 'Server error' });
  }
};