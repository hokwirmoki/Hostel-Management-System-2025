const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { isAdmin } = require("../middleware/isAdmin");
const {
  // User management
  getAllUsers,
  // deleteUser,

  // Room management
  getAllRooms,
  addRoom,
  updateRoom,
  deleteRoom,

  // Booking management
  getAllBookings,
  approveBooking,  
  rejectBooking  
} = require("../controllers/adminController");

// Apply authentication and admin check middleware to all routes
router.use(auth, isAdmin);

// --------------------- USERS ---------------------
router.get("/users", getAllUsers);
// router.delete("/users/:id", deleteUser);

// --------------------- ROOMS ---------------------
router.get("/rooms", getAllRooms);
router.post("/rooms", addRoom);
router.put("/rooms/:id", updateRoom);
router.delete("/rooms/:id", deleteRoom);

// --------------------- BOOKINGS ---------------------
router.get("/bookings", getAllBookings);

// "Confirm" booking (Approve)
router.put("/bookings/:id/confirm", approveBooking);

// "Cancel" booking (Reject)
router.put("/bookings/:id/cancel", rejectBooking);

module.exports = router;
