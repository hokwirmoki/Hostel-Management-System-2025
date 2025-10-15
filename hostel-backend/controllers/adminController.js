// controllers/adminController.js
const User = require("../models/User");
const Booking = require("../models/Booking");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve booking
exports.approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "approved";
    await booking.save();

    res.json({ message: "Booking approved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reject booking
exports.rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "rejected";
    await booking.save();

    res.json({ message: "Booking rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
