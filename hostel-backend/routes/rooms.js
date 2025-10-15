// routes/rooms.js
const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/', roomController.getRooms);
router.get('/:id', roomController.getRoomById);
router.post('/', auth, role('admin'), roomController.createRoom);
router.put('/:id', auth, role('admin'), roomController.updateRoom);
router.delete('/:id', auth, role('admin'), roomController.deleteRoom);

module.exports = router;