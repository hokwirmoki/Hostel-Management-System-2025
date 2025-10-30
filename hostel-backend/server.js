// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/adminRoutes'); // <--- add admin routes here

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // logs incoming requests

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes); // <--- place admin routes here before app.listen

// Health check
app.get('/', (req, res) => res.send('Hostel Booking API is running'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
});

// Start server (bind explicitly to IPv4 to avoid localhost resolution issues on some Windows setups)
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
const server = app.listen(PORT, HOST, () => {
    console.log(`Server started on ${HOST}:${PORT} (pid=${process.pid})`);
});

// In case of errors on listen, log them
server.on('error', (err) => {
    console.error('Server error:', err);
});