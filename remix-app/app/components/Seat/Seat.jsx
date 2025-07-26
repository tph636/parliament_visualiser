import './Seat.css';
import React from 'react';

const Seat = ({ member, type, style, onMouseEnter, onMouseLeave }) => {

  return (
    <div 
      className={type} 
      style={{ backgroundColor: member.party_color, ...style }} 
      onMouseEnter={onMouseEnter} 
      onMouseLeave={onMouseLeave}
    >
    </div>
  );
}

export default Seat;
