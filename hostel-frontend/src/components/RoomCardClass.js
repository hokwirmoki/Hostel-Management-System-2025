import React from 'react';

class RoomCardClass extends React.Component {
  render() {
    const { room, onBook } = this.props;
    const { title, roomNumber, pricePerNight } = room;

    return (
      <div className="card mb-2">
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">Room {roomNumber} — ${pricePerNight} per night</p>
          <button className="btn btn-primary" onClick={() => onBook(room)}>Book</button>
        </div>
      </div>
    );
  }
}

export default RoomCardClass;