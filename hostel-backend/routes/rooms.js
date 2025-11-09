const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const roomController = require('../controllers/roomController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Student view: available rooms
router.get('/', roomController.getAvailableRooms);

// Admin view: all rooms
router.get('/all', auth, role('admin'), roomController.getRooms);

// Get room by ID
router.get('/:id', roomController.getRoomById);

// Create room
router.post('/', auth, role('admin'), upload.array('images', 5), roomController.createRoom);

// Update room
router.put('/:id', auth, role('admin'), upload.array('images', 5), roomController.updateRoom);

// Delete room
router.delete('/:id', auth, role('admin'), roomController.deleteRoom);

module.exports = router;