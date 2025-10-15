const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const Room = require("../models/Room");

// ✅ Only admins can access these routes
router.post("/rooms", auth, role("admin"), async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    await newRoom.save();
    res.status(201).json({ message: "Room added successfully", newRoom });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/rooms", auth, role("admin"), async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
