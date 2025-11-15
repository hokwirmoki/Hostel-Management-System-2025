import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

export default function RoomForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState({
    title: '',
    description: '',
    roomNumber: '',
    pricePerSemester: '',
    capacity: '',
    amenities: '',
    images: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load existing room for editing
  useEffect(() => {
    if (id) {
      setLoading(true);
      api.get(`/rooms/${id}`)
        .then(res => setRoom({
          ...res.data,
          amenities: res.data.amenities?.join(', ') || '',
          images: res.data.images?.join(', ') || ''
        }))
        .catch(() => setError('Failed to load room details'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoom(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const roomData = {
        ...room,
        amenities: room.amenities.split(',').map(a => a.trim()).filter(Boolean),
        images: room.images.split(',').map(i => i.trim()).filter(Boolean)
      };

      if (id) {
        await api.put(`/rooms/${id}`, roomData);
        alert('Room updated successfully!');
      } else {
        await api.post('/rooms', roomData);
        alert('Room added successfully!');
      }

      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) return <div className="container mt-4">Loading room details...</div>;

  return (
    <div className="container mt-4">
      <h3>{id ? 'Edit Room' : 'Add New Room'}</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
        <div className="mb-3">
          <label>Title</label>
          <input name="title" value={room.title} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label>Description</label>
          <textarea name="description" value={room.description} onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-3">
          <label>Room Number</label>
          <input name="roomNumber" value={room.roomNumber} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label>Price Per Semester (UGX)</label>
          <input name="pricePerSemester" type="number" value={room.pricePerSemester} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label>Capacity</label>
          <input name="capacity" type="number" value={room.capacity} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label>Amenities (comma-separated)</label>
          <input name="amenities" value={room.amenities} onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-3">
          <label>Image URLs (comma-separated)</label>
          <input name="images" value={room.images} onChange={handleChange} className="form-control" />
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Saving...' : id ? 'Update Room' : 'Add Room'}
        </button>
      </form>
    </div>
  );
}