const express = require('express');
const router = express.Router();

// Minimal bookings route stubs
router.get('/', (req, res) => {
  return res.json({ bookings: [] });
});

router.post('/', (req, res) => {
  return res.json({ message: 'create booking - stub' });
});

module.exports = router;
