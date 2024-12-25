import './Seat.css';
import React from 'react';

const Seat = ({ seatIndex, seat }) => {
  
  // Function to handle the click event
  const handleClick = () => {

    console.log(seat.lastname)
  };

  return (
    <div className="seat-container">
      <div className="circle" style={{ borderColor: seat.partyColor }} onClick={handleClick}>
        <img src={`http://localhost:3001/tinyimages/${seat.imagePath}`} className="circle-image" />
      </div>
    </div>
  );
}

export default Seat;
