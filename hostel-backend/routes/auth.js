const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Register a new user
router.post('/register', authController.register);

// Login and return JWT + user
router.post('/login', authController.login);

// Get current authenticated user
router.get('/me', auth, authController.me);

module.exports = router;