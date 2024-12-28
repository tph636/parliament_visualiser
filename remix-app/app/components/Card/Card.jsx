import React from 'react';
import { Link } from '@remix-run/react';
import "./Card.css";

const Card = ({ seat, member }) => {
  return (
    <Link to={`/${member.person_id}`} className="card" state={{ seat }}>
      <img
        loading='lazy'
        src={`http://localhost:3001/tinyimages/${seat.image_path}`}
        alt={`Edustajan ${member.firstname} ${member.lastname} kuva`}
        className="card-image"
        style={{
          border: `4px solid ${seat.party_color}`
        }}
      />
      <div className="card-text">
        <h2>{member.firstname} {member.lastname}</h2>
        <p>{member.birth_year}</p>
        <p>{member.parliament_group}</p>
        <p>Välihuutoja: {member.valihuuto_count}</p>
      </div>
    </Link>
  );
};

export default Card;
