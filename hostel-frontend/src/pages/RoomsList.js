import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function RoomsList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        console.log('Fetching rooms...');
        const response = await api.get('/rooms');
        console.log('Rooms response:', response.data);
        setRooms(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError(err?.response?.data?.message || 'Failed to load rooms. Please try again later.');
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) return (
    <div className="container mt-4">
      <div className="alert alert-info">
        <div className="spinner-border spinner-border-sm me-2" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        Loading rooms...
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mt-4">
      <div className="alert alert-danger">
        <i className="bi bi-exclamation-triangle me-2"></i>
        {error}
        <button 
          className="btn btn-outline-danger btn-sm ms-3"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mt-4">
      <h2>Available Rooms</h2>
      <div className="row">
        {rooms.map((room) => (
          <div key={room._id} className="col-md-4 mb-4">
            <div className="card">
              {room.image && (
                <img
                  src={room.image}
                  className="card-img-top"
                  alt={room.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{room.title}</h5>
                <p className="card-text">
                  <strong>Room Number:</strong> {room.roomNumber}<br />
                  <strong>Type:</strong> {room.type}<br />
                  <strong>Price:</strong> ${room.price}/night<br />
                  <strong>Status:</strong> {room.status}
                </p>
                <button 
                  className="btn btn-primary"
                  disabled={room.status === 'occupied'}
                  onClick={() => {
                    // TODO: Implement booking functionality
                    alert('Booking functionality coming soon!');
                  }}
                >
                  {room.status === 'occupied' ? 'Occupied' : 'Book Now'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {rooms.length === 0 && (
        <div className="alert alert-info">
          No rooms available at the moment.
        </div>
      )}
    </div>
  );
}