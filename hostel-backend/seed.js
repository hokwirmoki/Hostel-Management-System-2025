require('dotenv').config();
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Room = require('./models/Room');

(async () => {
  await connectDB();
  await User.deleteMany({});
  await Room.deleteMany({});

  const salt = await bcrypt.genSalt(10);
  const admin = new User({
    name: 'Admin',
    email: 'admin@hostel.test',
    password: await bcrypt.hash('adminpass', salt),
    role: 'admin'
  });
  await admin.save();

  const rooms = [
    { title: 'Single Room', description: 'Cozy single room', roomNumber: 'A101', pricePerNight: 10, capacity: 1, amenities: ['bed','locker'] },
    { title: 'Double Room', description: 'Room with two beds', roomNumber: 'A102', pricePerNight: 18, capacity: 2, amenities: ['bed','fan','locker'] },
    { title: 'Deluxe', description: 'Spacious', roomNumber: 'B201', pricePerNight: 25, capacity: 3, amenities: ['bed','ensuite','AC'] }
  ];
  for (const r of rooms) {
    const room = new Room(r);
    await room.save();
  }

  console.log('Seed complete');
  process.exit(0);
})();