import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3">
      <div className="container">
        <Link className="navbar-brand" to="/">Hostel</Link>
        <div>
          <Link className="nav-link d-inline me-2" to="/rooms">Rooms</Link>
          {user ? (
            <>
              <Link className="nav-link d-inline me-2" to="/my-bookings">My bookings</Link>
              {user.role === 'admin' && <Link className="nav-link d-inline me-2" to="/admin">Admin</Link>}
              <button className="btn btn-link p-0" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="nav-link d-inline me-2" to="/login">Login</Link>
              <Link className="nav-link d-inline" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
