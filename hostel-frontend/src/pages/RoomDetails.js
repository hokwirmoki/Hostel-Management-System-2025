import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { useParams, Link } from 'react-router-dom';
import BookingForm from './BookingForm';
import { AuthContext } from '../context/AuthContext';

export default function RoomDetails() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api.get(`/rooms/${id}`).then(res => setRoom(res.data)).catch(err => console.error(err));
  }, [id]);

  if (!room) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h2>{room.title}</h2>
      <p>{room.description}</p>
      <p>Price: ${room.pricePerNight} / night</p>
      {user ? <BookingForm room={room} /> : <p><Link to="/login">Login</Link> to book</p>}
    </div>
  );
}
