import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function RoomsList() {
  const [rooms, setRooms] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api.get('/rooms')
      .then(res => setRooms(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container">
      <h2>Hostel Rooms</h2>
      <div className="row">
        {rooms.length > 0 ? (
          rooms.map(r => (
            <div key={r._id} className="col-md-4">
              <div className="card mb-3">
                {r.images && r.images.length > 0 ? (
                  <img
                    src={`http://localhost:5000${r.images[0]}`}
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
