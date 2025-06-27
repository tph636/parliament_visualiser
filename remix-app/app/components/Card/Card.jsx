import React from 'react';
import { Link } from '@remix-run/react';
import "./Card.css";

const Card = ({ member }) => {
  return (
    <Link to={`/${member.person_id}`} className="card" state={{ member }}>
      <img
        loading='lazy'
        src={`${import.meta.env.VITE_BACKEND_API_URL}/images/low-res/${member.image}`}
        alt={`Edustajan ${member.firstname} ${member.lastname} kuva`}
        className="card-image"
        style={{
          border: `4px solid ${member.party_color}`
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
