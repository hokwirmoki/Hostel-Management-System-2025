import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function EditRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState({
    title: '',
    description: '',
    roomNumber: '',
    pricePerSemester: '',
    capacity: '',
    amenities: '',
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load existing room
  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/rooms/${id}`);
        const data = res.data;
        setRoom({
          title: data.title,
          description: data.description,
          roomNumber: data.roomNumber,
          pricePerSemester: data.pricePerSemester,
          capacity: data.capacity,
          amenities: data.amenities?.join(', ') || '',
        });
        setExistingImages(data.images || []);
      } catch (err) {
        console.error('Error fetching room details:', err);
        setError('Failed to load room details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRoom();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoom(prev => ({ ...prev, [name]: value }));
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

      await api.put(`/rooms/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Room updated successfully!');
      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update room');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container mt-4">Loading room details...</div>;

  return (
    <div className="container mt-4">
      <h2>Edit Room</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            value={room.title}
            onChange={handleChange}
            className="form-control"
            required
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
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Room Number</label>
          <input
            type="text"
            name="roomNumber"
            value={room.roomNumber}
            onChange={handleChange}
            className="form-control"
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
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Upload Images</label>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} className="form-control" />
          <div className="mt-2 d-flex flex-wrap gap-2">
            {existingImages.map((img, i) => (
              <img key={i} src={`http://localhost:5000${img}`} alt="existing" width="100" height="100" style={{ objectFit: 'cover' }} />
            ))}
            {newImages.map((img, i) => (
              <img key={i} src={URL.createObjectURL(img)} alt="preview" width="100" height="100" style={{ objectFit: 'cover' }} />
            ))}
          </div>
        </div>

        <div className="d-flex justify-content-between">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
