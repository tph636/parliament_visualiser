import React from 'react';
import { Link } from '@remix-run/react';
import "./Card.css";


const Card = ({ seat, member }) => {
  return (
    <Link to={`/${seat.hetekaId}`} className="card">
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
        <p>Välihuutoja: {member.valihuuto_count}</p>
      </div>
    </Link>
  );
};

export default Card;
