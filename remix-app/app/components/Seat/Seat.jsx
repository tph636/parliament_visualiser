import './Seat.css';
import React from 'react';

const Seat = ({ seat }) => {
  
  // Function to handle the click event
  const handleClick = () => {
    console.log(seat.lastname)
  };

  return (
    <div className="seat-container">
      <div className="circle" style={{ backgroundColor: seat.partyColor }} onClick={handleClick}>

      </div>
      <div className="infobox">
          <p>{seat.firstname} {seat.lastname}</p>
      </div>
    </div>
  );
}

export default Seat;
