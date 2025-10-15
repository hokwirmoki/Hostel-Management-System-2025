import React, { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function BookingForm({ room }) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/bookings', {
        roomId: room._id,
        checkIn,
        checkOut,
        email: user.email
      });
      alert('Booking request created: ' + res.data.booking._id);
      navigate('/my-bookings');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    }
  };

  const getNights = () => {
    if (!checkIn || !checkOut) return 0;
    const msPerDay = 1000*60*60*24;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const nights = Math.ceil((d2 - d1) / msPerDay);
    return nights > 0 ? nights : 0;
  };

  const nights = getNights();
  const total = nights * room.pricePerNight;

  return (
    <div className="card mt-3">
      <div className="card-body">
        <h5>Book this room</h5>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
          <div className="mb-2">
            <label>Check in</label>
            <input type="date" className="form-control" value={checkIn} onChange={e=>setCheckIn(e.target.value)} required />
          </div>
          <div className="mb-2">
            <label>Check out</label>
            <input type="date" className="form-control" value={checkOut} onChange={e=>setCheckOut(e.target.value)} required />
          </div>
          <p>Nights: {nights} • Total: ${total}</p>
          <button className="btn btn-primary" disabled={nights <= 0}>Request Booking</button>
        </form>
      </div>
    </div>
  );
}