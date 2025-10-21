const Booking = require('../models/Booking');
const Room = require('../models/Room');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Utility: check date overlap
async function hasOverlap(roomId, checkInDate, checkOutDate) {
  return await Booking.findOne({
    room: roomId,
    status: { $ne: 'cancelled' },
    $and: [
      { checkIn: { $lt: checkOutDate } },
      { checkOut: { $gt: checkInDate } }
    ]
  });
}

exports.createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { roomId, checkIn, checkOut } = req.body;
    if (!roomId || !checkIn || !checkOut) return res.status(400).json({ message: 'Missing fields' });

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkInDate >= checkOutDate) return res.status(400).json({ message: 'checkOut must be after checkIn' });

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const conflict = await hasOverlap(roomId, checkInDate, checkOutDate);
    if (conflict) return res.status(400).json({ message: 'Room already booked for chosen dates' });

    const msPerDay = 1000 * 60 * 60 * 24;
    const nights = Math.ceil((checkOutDate - checkInDate) / msPerDay);
    const totalPrice = nights * room.pricePerNight;

    const booking = new Booking({
      user: userId,
      room: roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalPrice,
      paymentStatus: 'unpaid'
    });

    await booking.save();

    // send email (best-effort; will not crash if fails)
    const toEmail = req.body.email || 'no-reply@example.com';
    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: 'Booking Received',
      text: `Your booking for ${room.title} from ${checkInDate.toDateString()} to ${checkOutDate.toDateString()} is received.`
    }).catch(err => console.error('Email error', err));

    res.json({ booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ user: userId }).populate('room');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('room').populate('user', 'name email');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'confirmed', paymentStatus: req.body.paymentStatus || 'paid' }, { new: true }).populate('room').populate('user', 'name email');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: booking.user.email,
      subject: 'Booking Confirmed',
      text: `Your booking for ${booking.room.title} has been confirmed.`
    }).catch(err => console.error('Email error', err));

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};