require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Connect to DB only if not testing
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/', (req, res) => res.send('Hostel Booking API is running'));

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
});

// Start server only if this file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app; // export app for Supertest
