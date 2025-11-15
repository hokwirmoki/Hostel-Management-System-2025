import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation(); 

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3">
      <div className="container">
        <Link className="navbar-brand" to="/">HMS</Link>
        <div>
          <Link className={`nav-link d-inline me-2 ${isActive('/rooms')}`} to="/rooms">
            Rooms
          </Link>

          {user ? (
            <>
              {/* Show My Bookings only for normal users */}
              {user.role !== 'admin' && (
                <>
                  <Link className={`nav-link d-inline me-2 ${isActive('/my-bookings')}`} to="/my-bookings">
                    My bookings
                  </Link>
                  <Link className={`nav-link d-inline me-2 ${isActive('/profile')}`} to="/profile">
                    Profile
                  </Link>
                </>
              )}

              {/* Admin link only for admins */}
              {user.role === 'admin' && (
                <Link className={`nav-link d-inline me-2 ${isActive('/admin')}`} to="/admin">
                  Admin
                </Link>
              )}

              <button className="btn btn-link p-0" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className={`nav-link d-inline me-2 ${isActive('/login')}`} to="/login">
                Login
              </Link>
              <Link className={`nav-link d-inline ${isActive('/register')}`} to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
