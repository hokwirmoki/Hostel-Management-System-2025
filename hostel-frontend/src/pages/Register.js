import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
  const [payload, setPayload] = useState({ name: '', email: '', password: '' });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleChange = e => setPayload({ ...payload, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const data = await register(payload);
      if (data.user && data.token) {
        navigate('/rooms'); // navigate only after successful registration
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration error');
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={submit} style={{ maxWidth: 500 }}>
        <input
          className="form-control mb-2"
          placeholder="Name"
          name="name"
          value={payload.name}
          onChange={handleChange}
          required
        />
        <input
          className="form-control mb-2"
          placeholder="Email"
          name="email"
          value={payload.email}
          onChange={handleChange}
          required
        />
        <input
          className="form-control mb-2"
          placeholder="Password"
          type="password"
          name="password"
          value={payload.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
}
