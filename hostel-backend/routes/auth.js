const express = require('express');
const router = express.Router();

// Minimal auth route stubs to allow server to start.
router.post('/register', (req, res) => {
  return res.json({ message: 'register endpoint - stub' });
});

router.post('/login', (req, res) => {
  return res.json({ message: 'login endpoint - stub' });
});

module.exports = router;
