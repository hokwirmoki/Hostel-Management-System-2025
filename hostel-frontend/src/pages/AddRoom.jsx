import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AddRoom() {
  const navigate = useNavigate();
  const [room, setRoom] = useState({
    title: '',
    roomNumber: '',
    pricePerSemester: '',
    capacity: '',
    amenities: '',
    description: '',
  });
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setRoom({ ...room, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setNewImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      Object.entries(room).forEach(([key, value]) => formData.append(key, value));
      newImages.forEach(img => formData.append('images', img));

      await api.post('/rooms', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Room added successfully!');
      navigate('/admin');
    } catch (err) {
      console.error('Error adding room:', err);
      setError(err.response?.data?.message || 'Failed to add room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add New Room</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="mt-4">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            value={room.title}
            onChange={handleChange}
            className="form-control"
            placeholder="e.g. Deluxe Single Room"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Room Number</label>
          <input
            type="text"
            name="roomNumber"
            value={room.roomNumber}
            onChange={handleChange}
            className="form-control"
            placeholder="e.g. A101"
            required
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Price per Semester (UGX)</label>
            <input
              type="number"
              name="pricePerSemester"
              value={room.pricePerSemester}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g. 1500000"
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Capacity</label>
            <input
              type="number"
              name="capacity"
              value={room.capacity}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g. 2"
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Amenities (comma-separated)</label>
          <input
            type="text"
            name="amenities"
            value={room.amenities}
            onChange={handleChange}
            className="form-control"
            placeholder="WiFi, Fan, Private Bathroom"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={room.description}
            onChange={handleChange}
            className="form-control"
            rows="3"
            placeholder="Short description about the room..."
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Upload Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="form-control"
          />
          <div className="mt-2 d-flex flex-wrap gap-2">
            {newImages.map((img, i) => (
              <img
                key={i}
                src={URL.createObjectURL(img)}
                alt="preview"
                width="100"
                height="100"
                style={{ objectFit: 'cover' }}
              />
            ))}
          </div>
        </div>

        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/admin')}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Add Room'}
          </button>
        </div>
      </form>
    </div>
  );
}
