import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    api.get('/bookings').then(res => setBookings(res.data)).catch(err => console.error(err));
    api.get('/rooms').then(res => setRooms(res.data)).catch(err => console.error(err));
  }, []);

  const confirmBooking = async (id) => {
    try {
      await api.put(`/bookings/${id}/confirm`, { paymentStatus: 'paid' });
      setBookings(b => b.map(x => x._id === id ? { ...x, status: 'confirmed', paymentStatus: 'paid' } : x));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>

      <h4>Bookings</h4>
      {bookings.map(b => (
        <div key={b._id} className="card mb-2">
          <div className="card-body">
            <h5>{b.room?.title}</h5>
            <p>{new Date(b.checkIn).toDateString()} — {new Date(b.checkOut).toDateString()}</p>
            <p>Status: {b.status} • Payment: {b.paymentStatus}</p>
            {b.status !== 'confirmed' && <button className="btn btn-success" onClick={() => confirmBooking(b._id)}>Confirm</button>}
          </div>
        </div>
      ))}

      <h4 className="mt-4">Rooms</h4>
      <div className="row">
        {rooms.map(r => (
          <div key={r._id} className="col-md-4">
            <div className="card mb-3">
              <div className="card-body">
                <h5>{r.title}</h5>
                <p>Room {r.roomNumber}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}