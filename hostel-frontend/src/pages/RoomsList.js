import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

export default function RoomsList() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    api.get('/rooms').then(res => setRooms(res.data)).catch(err => console.error(err));
  }, []);

  return (
    <div className="container">
      <h2>Rooms</h2>
      <div className="row">
        {rooms.map(r => (
          <div key={r._id} className="col-md-4">
            <div className="card mb-3">
              <div className="card-body">
                <h5>{r.title}</h5>
                <p>Room {r.roomNumber} • ${r.pricePerNight}/night</p>
                <Link className="btn btn-sm btn-outline-primary" to={`/rooms/${r._id}`}>Details</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
