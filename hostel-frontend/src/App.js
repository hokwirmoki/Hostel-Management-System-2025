import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import RoomsList from './pages/RoomsList';
import RoomDetails from './pages/RoomDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';

import AddRoom from './pages/AddRoom';
import EditRoom from './pages/EditRoom';
import Profile from './pages/Profile'; // ✅ import the new Profile page

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<RoomsList />} />
        <Route path="/rooms" element={<RoomsList />} />
        <Route path="/rooms/:id" element={<RoomDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/my-bookings"
          element={
            <PrivateRoute>
              <MyBookings />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"   // ✅ New route for user profile
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/add-room"
          element={
            <PrivateRoute role="admin">
              <AddRoom />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/edit-room/:id"
          element={
            <PrivateRoute role="admin">
              <EditRoom />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}