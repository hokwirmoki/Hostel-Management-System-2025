// routes/bookings.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.post('/', auth, bookingController.createBooking);
router.get('/my', auth, bookingController.getMyBookings);
router.get('/', auth, role('admin'), bookingController.getAllBookings);
router.put('/:id/confirm', auth, role('admin'), bookingController.confirmBooking);
router.put('/:id/cancel', auth, bookingController.cancelBooking);

module.exports = router;
