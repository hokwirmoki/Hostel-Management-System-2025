const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Get logged-in user profile
router.get('/profile', authMiddleware, getProfile);

// Update logged-in user profile
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;
        