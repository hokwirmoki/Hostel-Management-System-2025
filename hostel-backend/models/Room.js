// models/Room.js
const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  roomNumber: { type: String, required: true, unique: true },
  pricePerNight: { type: Number, required: true },
  capacity: { type: Number, default: 1 },
  amenities: [String],
  images: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Room', RoomSchema);
