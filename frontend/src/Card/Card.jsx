import './Card.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Card = ({ seat, member, valihuutoAmount }) => {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    e.preventDefault();
    navigate(`/${seat.hetekaId}`);
  };

  return (
    <a className="card" href='#' onClick={handleCardClick}>
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
    </a>
  );
};

export default Card;
