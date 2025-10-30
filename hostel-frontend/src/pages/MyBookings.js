import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get('/bookings/my').then(res => setBookings(res.data)).catch(err => console.error(err));
  }, []);

   useEffect(() => {
    api.get('/bookings/my').then(res => setBookings(res.data)).catch(err => console.error(err));
  }, []);

  return (
    <div className="container">
      <h2>My Bookings</h2>
      {bookings.length === 0 && <p>No bookings yet.</p>}
      {bookings.map(b => (
        <div key={b._id} className="card mb-2">
          <div className="card-body">
            <h5>{b.room.title}</h5>
            <p>{new Date(b.checkIn).toDateString()} — {new Date(b.checkOut).toDateString()}</p>
            <p>Status: {b.status} • Payment: {b.paymentStatus} • ${b.totalPrice}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
