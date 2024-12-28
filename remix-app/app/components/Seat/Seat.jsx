import './Seat.css';
import React from 'react';

const Seat = ({ member }) => {
  
  // Function to handle the click event
  const handleClick = () => {
    console.log(member.lastname);
  };

  return (
    <div className="seat-container">
      <div className="circle" style={{ backgroundColor: member.party_color }} onClick={handleClick}>
      </div>
      <div className="infobox">
          <p>{member.firstname} {member.lastname}</p>
      </div>
    </div>
  );
}

export default Seat;
