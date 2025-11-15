import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my');
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  if (!user) return <p>Please login to view your bookings.</p>;

  return (
    <div className="container mt-4">
      <h2>My Bookings</h2>
      {bookings.length === 0 && <p>No bookings yet.</p>}

      <div className="row">
        {bookings
        .filter(b => b.room)
        .map(b => (
          <div key={b._id} className="col-md-6">
            <div className="card mb-3 shadow-sm">
              {/* Show first image with backend URL */}
              {b.room?.images && b.room.images.length > 0 ? (
                <img
                  src={`http://localhost:5000${b.room.images[0]}`}
                  alt={b.room.title}
                  className="card-img-top"

                />
              ) : (
                <img
                  src="https://via.placeholder.com/600x200?text=Hostel+Room"
                  alt="Default room"
                  className="card-img-top"

                />
              )}

              <div className="card-body">
                <h5 className="card-title">{b.room?.title}</h5>
                <p>
                  Room {b.room?.roomNumber} • UGX {b.room?.pricePerSemester?.toLocaleString()} / semester
                </p>
                <p>
                  {new Date(b.checkIn).toLocaleDateString()} —{' '}
                  {new Date(b.checkOut).toLocaleDateString()}
                </p>
                <p>Status: {b.status} • Payment: {b.paymentStatus} • UGX {b.totalPrice?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}