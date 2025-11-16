import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

export default function RoomsList() {
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    api.get('/rooms')
      .then(res => setRooms(res.data))
      .catch(err => console.error(err));
  }, []);

  // Filter rooms based on search term
  const filteredRooms = rooms.filter(room =>
    room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.roomNumber.toString().includes(searchTerm)
  );

  return (
    <div className="container">
      <h2>Hostel Rooms</h2>

      {/* Search bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by title or room number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="row">
        {filteredRooms.length > 0 ? (
          filteredRooms.map(r => (
            <div key={r._id} className="col-md-4">
              <div className="card mb-3">
                {r.images && r.images.length > 0 ? (
                  <img
  src={`${process.env.REACT_APP_API_URL}${r.images[0]}`}
  alt={r.title}
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
                  <h5>{r.title}</h5>
                  <p>Room {r.roomNumber} • UGX {r.pricePerSemester?.toLocaleString()} / semester</p>
                  {r.amenities && r.amenities.length > 0 && (
                    <p><strong>Amenities:</strong> {r.amenities.join(', ')}</p>
                  )}
                  <Link className="btn btn-sm btn-outline-primary" to={`/rooms/${r._id}`}>Details</Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center mt-3">No rooms available at the moment.</p>
        )}
      </div>
    </div>
  );
}
