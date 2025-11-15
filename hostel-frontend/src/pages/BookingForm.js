// BookingForm.js
import React, { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function BookingForm({ room }) {
  const [checkIn, setCheckIn] = useState('');
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!room || !room.pricePerSemester) {
      setError('Room price information not available.');
      return;
    }

    try {
      const res = await api.post(
        '/bookings',
        {
          roomId: room._id,
          checkIn,
          totalPrice: room.pricePerSemester,
          status: 'pending'
        }
      );

      alert(`Booking request created successfully. Booking ID: ${res.data.booking._id}`);
      navigate('/my-bookings');
    } catch (err) {
      // Handle errors returned by backend
      setError(err.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div className="card mt-3">
      <div className="card-body">
        <h5>Book this room</h5>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
          <div className="mb-2">
            <label>Check-in Date</label>
            <input
              type="date"
              className="form-control"
              value={checkIn}
              onChange={e => setCheckIn(e.target.value)}
              required
            />
          </div>

          <p><strong>Price:</strong> UGX {room.pricePerSemester?.toLocaleString()}</p>

          <button className="btn btn-primary">Request Booking</button>
        </form>
      </div>
    </div>
  );
}
