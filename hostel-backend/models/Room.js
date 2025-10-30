const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    roomNumber: { type: String, required: true, unique: true },
    pricePerNight: { type: Number, required: true },
    capacity: { type: Number, default: 1 },
    amenities: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);