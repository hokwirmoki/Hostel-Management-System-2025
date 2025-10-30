import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingDates, setBookingDates] = useState({
    checkIn: '',
    checkOut: ''
  });
  const [isBooking, setIsBooking] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await api.get(`/rooms/${id}`);
        setRoom(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load room details. Please try again later.');
        setLoading(false);
        console.error('Error fetching room:', err);
      }
    };

    fetchRoom();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!localStorage.getItem('token')) {
      navigate('/login', { state: { returnUrl: `/rooms/${id}` } });
      return;
    }

    // Validate dates
    const checkInDate = new Date(bookingDates.checkIn);
    const checkOutDate = new Date(bookingDates.checkOut);
    
    if (checkInDate >= checkOutDate) {
      setError('Check-out date must be after check-in date');
      return;
    }

    setIsBooking(true);
    setError(null);

    try {
      // Calculate total nights and price
      const msPerDay = 1000 * 60 * 60 * 24;
      const nights = Math.ceil((checkOutDate - checkInDate) / msPerDay);
      const totalPrice = nights * room.price;

      const response = await api.post('/bookings', {
        roomId: id,
        checkIn: bookingDates.checkIn,
        checkOut: bookingDates.checkOut,
        totalPrice
      });

      setSuccessMessage('Booking successful! Redirecting to your bookings...');
      
      // Short delay to show success message
      setTimeout(() => {
        navigate('/my-bookings', { 
          state: { message: 'Your room has been successfully booked!' }
        });
      }, 1500);
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Booking failed. Please try again.';
      setError(errorMessage);
      setIsBooking(false);
    }
  };

  if (loading) return <div className="container mt-4">Loading room details...</div>;
  if (error) return <div className="container mt-4 text-danger">{error}</div>;
  if (!room) return <div className="container mt-4">Room not found</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          {room.image && (
            <img
              src={room.image}
              alt={room.title}
              className="img-fluid rounded"
              style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
            />
          )}
          <h2 className="mt-4">{room.title}</h2>
          <p className="lead">Room {room.roomNumber}</p>
          <hr />
          <div className="row">
            <div className="col-md-6">
              <h4>Details</h4>
              <ul className="list-unstyled">
                <li><strong>Type:</strong> {room.type}</li>
                <li><strong>Price:</strong> ${room.price}/night</li>
                <li><strong>Status:</strong> {room.status}</li>
                {room.capacity && <li><strong>Capacity:</strong> {room.capacity} persons</li>}
              </ul>
            </div>
            <div className="col-md-6">
              <h4>Amenities</h4>
              {room.amenities && (
                <ul className="list-unstyled">
                  {room.amenities.map((amenity, index) => (
                    <li key={index}>{amenity}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          {room.description && (
            <>
              <h4 className="mt-4">Description</h4>
              <p>{room.description}</p>
            </>
          )}
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Book This Room</h4>
              {error && (
                <div className="alert alert-danger mb-3">{error}</div>
              )}
              {successMessage && (
                <div className="alert alert-success mb-3">{successMessage}</div>
              )}
              {room.status === 'available' ? (
                <form onSubmit={handleBooking}>
                  <div className="mb-3">
                    <label htmlFor="checkIn" className="form-label">Check-in Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="checkIn"
                      value={bookingDates.checkIn}
                      onChange={(e) => setBookingDates(prev => ({ ...prev, checkIn: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      disabled={isBooking}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="checkOut" className="form-label">Check-out Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="checkOut"
                      value={bookingDates.checkOut}
                      onChange={(e) => setBookingDates(prev => ({ ...prev, checkOut: e.target.value }))}
                      min={bookingDates.checkIn || new Date().toISOString().split('T')[0]}
                      required
                      disabled={isBooking}
                    />
                  </div>
                  {bookingDates.checkIn && bookingDates.checkOut && (
                    <div className="mb-3">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h6 className="card-title">Booking Summary</h6>
                          <p className="mb-1">Check-in: {new Date(bookingDates.checkIn).toLocaleDateString()}</p>
                          <p className="mb-1">Check-out: {new Date(bookingDates.checkOut).toLocaleDateString()}</p>
                          <p className="mb-0">Price per night: ${room.price}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={isBooking}
                  >
                    {isBooking ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing Booking...
                      </>
                    ) : (
                      `Book Now - $${room.price}/night`
                    )}
                  </button>
                </form>
              ) : (
                <div className="alert alert-warning">
                  This room is currently not available for booking.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}