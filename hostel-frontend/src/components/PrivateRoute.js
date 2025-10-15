// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return <Navigate to="/login" />;
  }

  // If role is required (e.g., admin), check it
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}
