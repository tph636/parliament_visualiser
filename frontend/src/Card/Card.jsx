import './Card.css';
import React from 'react';

const Card = ({ member }) => {
  
  return (
    <div className="card">
        <img src={`http://localhost:3001/tinyimages/${member.imagePath}`} alt="Edustajan kuva"></img>
        <h2>{member.firstname} {member.lastname}</h2>
        <p>{member.party}</p>
    </div>
  );
}

export default Card;
