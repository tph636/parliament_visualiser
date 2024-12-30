import './Seat.css';
import React from 'react';

const Seat = ({ member, type, style, onMouseEnter, onMouseLeave }) => {
  
  // Function to handle the click event
  const handleClick = () => {
    console.log(member.lastname);
  };

  return (
    <div 
      className={type} 
      style={{ backgroundColor: member.party_color, ...style }} 
      onClick={handleClick} 
      onMouseEnter={onMouseEnter} 
      onMouseLeave={onMouseLeave}
    >
    </div>
  );
}

export default Seat;
