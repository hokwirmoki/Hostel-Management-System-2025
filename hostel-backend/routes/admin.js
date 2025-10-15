// routes/admin.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { isAdmin } = require("../middleware/isAdmin");
const {
  getAllUsers,
  deleteUser,
  getAllBookings,
  approveBooking,
  rejectBooking,
} = require("../controllers/adminController");

// Protected and admin-only routes
router.get("/users", auth, isAdmin, getAllUsers);
router.delete("/users/:id", auth, isAdmin, deleteUser);

router.get("/bookings", auth, isAdmin, getAllBookings);
router.put("/bookings/:id/approve", auth, isAdmin, approveBooking);
router.put("/bookings/:id/reject", auth, isAdmin, rejectBooking);

module.exports = router;
