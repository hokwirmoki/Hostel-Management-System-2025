import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  // LOGIN (FIXED)
  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });

    if (res.data.token && res.data.user) {
      setToken(res.data.token);
      setUser(res.data.user);
    }

    return res.data;
  };

  // REGISTER (FIXED)
  const register = async (payload) => {
    const res = await api.post('/api/auth/register', payload);

    if (res.data.token && res.data.user) {
      setToken(res.data.token);
      setUser(res.data.user);
    }

    return res.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
