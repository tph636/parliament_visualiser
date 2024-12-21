import './Seat.css';
import React from 'react';

const Seat = ({ seatIndex, member }) => {

  // Function to handle the click event
  const handleClick = () => {
    console.log(member.lastname)
  };

  return (
    <div className="seat-container">
      <div className="circle" style={{ borderColor: member.partyColor }} onClick={handleClick}>
        <img src={`http://localhost:3001/tinyimages/${member.imagePath}`} alt={`Seat ${seatIndex}`} className="circle-image" />
      </div>
    </div>
  );
}

export default Seat;
