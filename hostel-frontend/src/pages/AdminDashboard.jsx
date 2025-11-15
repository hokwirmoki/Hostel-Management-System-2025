import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function AdminDashboard() {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // ✅ Fetch rooms
  const fetchRooms = useCallback(async () => {
    setLoadingRooms(true);
    try {
      const res = await api.get('/admin/rooms');
      setRooms(res.data);
    } catch (err) {
      console.error('Error fetching rooms:', err.response || err);
    } finally {
      setLoadingRooms(false);
    }
  }, []);

  // ✅ Fetch bookings
  const fetchBookings = useCallback(async () => {
    setLoadingBookings(true);
    try {
      const res = await api.get('/admin/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings:', err.response || err);
    } finally {
      setLoadingBookings(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
    fetchBookings();
  }, [fetchRooms, fetchBookings]);

  // ✅ Status color helper
  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-success fw-bold';
      case 'pending':
        return 'text-warning fw-bold';
      case 'cancelled':
        return 'text-danger fw-bold';
      default:
        return '';
    }
  };

  // Handle booking status update (Confirm/Cancel)
  const handleBookingAction = async (id, action) => {
    const endpoint = action === 'confirmed'
      ? `/admin/bookings/${id}/confirm`
      : `/admin/bookings/${id}/cancel`;

    if (!window.confirm(`Are you sure you want to proceed?`)) return;

    try {
      const res = await api.put(endpoint);
      if (res.status === 200) {
        alert(`Booking ${action} successfully!`);
        fetchBookings();
        fetchRooms();
      } else {
        alert(`Booking ${action} unsuccessful!`);
      }
    } catch (err) {
      console.error(`Error updating booking (${action}):`, err.response || err);
      alert(`Error trying to ${action} this booking.`);
    }
  };

  // Handle room deletion
  const handleDeleteRoom = async (id) => {
    if (!window.confirm('Delete this room?')) return;

    try {
      await api.delete(`/rooms/${id}`);
      alert('Room deleted successfully!');
      fetchRooms();
    } catch (err) {
      console.error('Error deleting room:', err.response || err);
      alert('Error deleting room.');
    }
  };

  // Filter rooms based on search query
  const filteredRooms = rooms.filter(room =>
    room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.roomNumber.toString().includes(searchQuery)
  );

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>
      <p className="mb-3">Manage all hostel rooms and bookings</p>

      {/* ---------------------- ROOMS MANAGEMENT ---------------------- */}
      <div className="text-end mb-3">
        <Link to="/admin/add-room" className="btn btn-primary">
          Add New Room
        </Link>
      </div>

      {/* Search box */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search rooms by title or room number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loadingRooms ? (
        <p>Loading rooms...</p>
      ) : (
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Title</th>
              <th>Room Number</th>
              <th>Price (UGX)</th>
              <th>Capacity</th>
              <th>Amenities</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                <tr key={room._id}>
                  <td>{room.title}</td>
                  <td>{room.roomNumber}</td>
                  <td>{room.pricePerSemester?.toLocaleString()} / Semester</td>
                  <td>{room.capacity}</td>
                  <td>{room.amenities?.join(', ')}</td>
                  <td>
                    <Link
                      to={`/admin/edit-room/${room._id}`}
                      className="btn btn-sm btn-warning me-2"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteRoom(room._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No rooms available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* ---------------------- BOOKINGS MANAGEMENT ---------------------- */}
      <h3 className="mt-5">Booked Rooms</h3>

      {loadingBookings ? (
        <p>Loading bookings...</p>
      ) : (
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Title</th>
              <th>Room Number</th>
              <th>Booked By</th>
              <th>Check In</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings
              .filter(b => b.room)
              .map((b) => (
                <tr key={b._id}>
                  <td>{b.room?.title || 'N/A'}</td>
                  <td>{b.room?.roomNumber || 'N/A'}</td>
                  <td>
                    {b.user?.name
                      ? `${b.user.name} (${b.user.email})`
                      : b.user?.email || 'N/A'}
                  </td>
                  <td>{b.checkIn ? new Date(b.checkIn).toLocaleDateString() : 'N/A'}</td>
                  <td className={getStatusClass(b.status)}>{b.status || 'N/A'}</td>
                  <td>
                    {b.status !== 'confirmed' && (
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => handleBookingAction(b._id, 'confirmed')}
                      >
                        Confirm
                      </button>
                    )}
                    {b.status !== 'cancelled' && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleBookingAction(b._id, 'cancelled')}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No bookings yet</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}