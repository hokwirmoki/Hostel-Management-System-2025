const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');

// CREATE BOOKING
exports.createBooking = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.body;
    const userId = req.user.id; 

    if (!roomId || !checkIn) {
      return res.status(400).json({ message: 'Room and check-in date are required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const totalPrice = room.pricePerSemester;

    // Auto-calculate checkOut (4 months from checkIn)
    const defaultCheckOut =
      checkOut || new Date(new Date(checkIn).setMonth(new Date(checkIn).getMonth() + 4));

    const booking = new Booking({
      user: user._id,
      room: room._id,
      checkIn,
      checkOut: defaultCheckOut,
      totalPrice,
      status: 'pending',
      paymentStatus: 'unpaid',
    });

    await booking.save();

    // Populate user and room after saving
    await booking.populate('user', 'name email');
    await booking.populate('room', 'title roomNumber pricePerSemester images');

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET BOOKINGS FOR LOGGED-IN USER
exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id; 

    const bookings = await Booking.find({ user: userId })
      .populate('room', 'title roomNumber pricePerSemester images')
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    console.error('Error fetching user bookings:', err);
    res.status(500).json({ message: 'Failed to fetch user bookings' });
  }
};

// GET ALL BOOKINGS (for admin)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('room', 'title roomNumber pricePerSemester images')
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};

// UPDATE BOOKING STATUS (admin)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    await booking.populate('user', 'name email');
    await booking.populate('room', 'title roomNumber');

    res.json({ message: 'Booking status updated', booking });
  } catch (err) {
    console.error('Error updating booking:', err);
    res.status(500).json({ message: 'Failed to update booking' });
  }
};