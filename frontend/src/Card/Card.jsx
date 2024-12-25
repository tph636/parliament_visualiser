import './Card.css';
import React from 'react';

const Card = ({ seat, member, valihuutoAmount }) => {
  return (
    <div className="card">
      <img
        src={`http://localhost:3001/tinyimages/${seat.imagePath}`}
        alt={`Edustajan ${member.firstname} ${member.lastname} kuva`}
        className="card-image"
        style={{
          border: `4px solid ${seat.partyColor}`
        }}
      />
      <div className="card-text">
        <h2>{member.firstname} {member.lastname}</h2>
        <p>{member.birthYear}</p>
        <p>{member.parliamentGroup}</p>
        <p>Välihuutoja: {valihuutoAmount.count}</p>
      </div>
    </div>
  );
}

export default Card;
