// config/db.js
const mongoose = require('mongoose');

const connectDB = async() => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/hosteldb';
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch (err) {
        // Don't exit the process on DB connection failure in development.
        // Some routes (like the sample /api/rooms) do not depend on the DB and
        // it's convenient to keep the server up for frontend development.
        console.error('MongoDB connection error:', err.message);
        console.warn('Continuing without a database connection (development mode).');
        return;
    }
};

module.exports = connectDB;