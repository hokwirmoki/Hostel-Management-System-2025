// This file adapts the existing admin.js route (if present) to the expected import name
try {
  module.exports = require('./admin');
} catch (err) {
  const express = require('express');
  const router = express.Router();
  // fallback stub
  router.get('/', (req, res) => res.json({ message: 'admin routes - stub' }));
  module.exports = router;
}
