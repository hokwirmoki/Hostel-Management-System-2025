const User = require("../models/User");
const Booking = require("../models/Booking");
const Room = require("../models/Room");

// Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Rooms
exports.addRoom = async (req, res) => {
  try {
    const { title, roomNumber, pricePerSemester, capacity, amenities } = req.body;
    const newRoom = new Room({
      title,
      roomNumber,
      pricePerSemester,
      capacity,
      amenities: amenities ? amenities.split(",") : [],
    });
    await newRoom.save();
    res.status(201).json({ message: "Room added successfully", room: newRoom });
  } catch (err) {
    console.error("Error adding room:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRoom) return res.status(404).json({ message: "Room not found" });
    res.json({ message: "Room updated successfully", room: updatedRoom });
  } catch (err) {
    console.error("Error updating room:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const deleted = await Room.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Room not found" });

    await Booking.deleteMany({ room: req.params.id });
    res.json({ message: "Room deleted successfully" });
    
    fetcghRooms();
    fetchBookings();

  } catch (err) {
    console.error("Error deleting room:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email role")
      .populate("room", "title roomNumber");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "confirmed";
    await booking.save();

    // Optionally update room bookingStatus
    await Room.findByIdAndUpdate(booking.room, { bookingStatus: "booked" });

    res.json({ message: "Booking confirmed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "cancelled";
    await booking.save();

    // update room bookingStatus
    await Room.findByIdAndUpdate(booking.room, { bookingStatus: "available" });

    res.json({ message: "Booking cancelled" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin rooms
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};