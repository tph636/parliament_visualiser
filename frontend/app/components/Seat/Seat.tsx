import './Seat.css';
import React from 'react';
import type { Member } from "../../types/Member";

type SeatProps = {
  member: Member;
  type: string;
  style?: React.CSSProperties;
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const Seat = ({ member, type, style, onMouseEnter, onMouseLeave }: SeatProps) => {

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
