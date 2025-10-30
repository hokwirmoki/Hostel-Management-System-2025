import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function PrivateRoute({ children, role }) {
    const { token, user } = useContext(AuthContext);
    const location = useLocation();

    // Not logged in: redirect to login and preserve the attempted location
    if (!token) {
        return <Navigate 
            to="/login" 
            replace 
            state={{ from: location }}
        />;
    }

    // Logged in but doesn't have required role
    if (role && user?.role !== role) {
        return <Navigate 
            to="/" 
            replace
        />;
    }

    // Authorized, render children
    return children;
}