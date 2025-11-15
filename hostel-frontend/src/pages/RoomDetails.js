import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { useParams, Link } from 'react-router-dom';
import BookingForm from './BookingForm';
import { AuthContext } from '../context/AuthContext';

export default function RoomDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/rooms/${id}`);
        setRoom(res.data);
      } catch (err) {
        console.error('Error fetching room details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  if (loading) return <div className="container mt-5">Loading room details...</div>;
  if (!room) return <div className="container mt-5">Room not found</div>;

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        {room.images && room.images.length > 0 ? (
          <img
            src={`http://localhost:5000${room.images[0]}`}
            alt={room.title}
            className="card-img-top"

          />
        ) : (
          <img
            src="https://via.placeholder.com/600x300?text=Hostel+Room"
            alt="Default room"
            className="card-img-top"

          />
        )}

        <div className="card-body">
          <h3 className="card-title">{room.title}</h3>
          <p><strong>Description:</strong> {room.description}</p>
          <p><strong>Room Number:</strong> {room.roomNumber}</p>
          <p><strong>Capacity:</strong> {room.capacity} student(s)</p>
          <p><strong>Price per Semester:</strong> UGX {room.pricePerSemester?.toLocaleString()}</p>

          {room.amenities && room.amenities.length > 0 && (
            <p><strong>Amenities:</strong> {room.amenities.join(', ')}</p>
          )}

          {room.images && room.images.length > 1 && (
            <div className="mt-3 d-flex flex-wrap">
              {room.images.slice(1).map((img, idx) => (
                <img
                  key={idx}
                  src={`http://localhost:5000${img}`}
                  alt={`${room.title}-${idx}`}
                  style={{ width: '120px', height: '80px', objectFit: 'cover', marginRight: '8px', marginBottom: '8px' }}
                />
              ))}
            </div>
          )}

          {/* Booking section */}
          {user?.role === 'admin' ? (
            <p className={`mt-3 ${room.bookingStatus === 'booked' ? 'text-danger' : 'text-success'}`}>
              {room.bookingStatus === 'booked' ? 'Currently Booked' : 'Available'}
            </p>
          ) : (
            room.bookingStatus !== 'booked' ? (
              user ? (
                <BookingForm room={room} />
              ) : (
                <p className="mt-3">
                  <Link to="/login">Login</Link> to book this room
                </p>
              )
            ) : (
              <p className="mt-3 text-danger">Currently Booked</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}
