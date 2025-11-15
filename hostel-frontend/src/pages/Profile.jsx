import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: '',
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        setProfile({
          name: res.data.name,
          email: res.data.email,
          avatar: res.data.avatar || '',
        });
      } catch (err) {
        console.error(err.response || err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEdit = () => {
    navigate('/profile/edit'); // route for editing
  };

  if (loading) {
    return <p className="text-center mt-3">Loading profile...</p>;
  }

  return (
    <div className="container mt-4">
      <h2>My Profile</h2>
      <div className="card p-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div className="text-center mb-3">
          <img
            src={profile.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'}
            alt="Profile"
            className="rounded-circle border"
            width="120"
            height="120"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="mb-2">
          <strong>Name:</strong> {profile.name || 'N/A'}
        </div>
        <div className="mb-2">
          <strong>Email:</strong> {profile.email || 'N/A'}
        </div>
        <button className="btn btn-primary mt-3 w-100" onClick={handleEdit}>
          Edit Information
        </button>
      </div>
    </div>
  );
}
