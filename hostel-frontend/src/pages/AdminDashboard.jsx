// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user'))?.token;
        const headers = { Authorization: `Bearer ${token}` };

        const [roomsRes, usersRes, bookingsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/rooms', { headers }),
          axios.get('http://localhost:5000/api/admin/users', { headers }),
          axios.get('http://localhost:5000/api/admin/bookings', { headers }),
        ]);

        setRooms(roomsRes.data);
        setUsers(usersRes.data);
        setBookings(bookingsRes.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <section>
        <h3>Rooms</h3>
        <ul>{rooms.map(r => <li key={r._id}>{r.name}</li>)}</ul>
      </section>

      <section>
        <h3>Users</h3>
        <ul>{users.map(u => <li key={u._id}>{u.username}</li>)}</ul>
      </section>

      <section>
        <h3>Bookings</h3>
        <ul>{bookings.map(b => <li key={b._id}>{b.roomName} - {b.userName}</li>)}</ul>
      </section>
    </div>
  );
}
