const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth'); 

// Create a new booking
router.post('/', auth, bookingController.createBooking);

// Get bookings (User)
router.get('/my', auth, bookingController.getMyBookings);

// Get all bookings (Admin)
router.get('/', auth, bookingController.getAllBookings);

// Update booking status (admin only)
router.put('/:id/status', auth, bookingController.updateBookingStatus);

module.exports = router;