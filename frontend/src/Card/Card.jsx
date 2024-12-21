import './Card.css';
import React from 'react';

const Card = ({ seat, member }) => {
  const parser = new DOMParser(); 
  const xmlDoc = parser.parseFromString(member.XmlDataFi, "text/xml");
  const birthDate = xmlDoc.getElementsByTagName("SyntymaPvm")[0].childNodes[0].nodeValue;
  const email = xmlDoc.getElementsByTagName("SahkoPosti")[0].childNodes[0].nodeValue;
  const party = xmlDoc.getElementsByTagName("NykyinenEduskuntaryhma")[0].getElementsByTagName("Nimi")[0].childNodes[0].nodeValue;  

  return (
    <div className="card">
      <img
        src={`http://localhost:3001/tinyimages/${seat.imagePath}`}
        alt="Edustajan kuva"
        className="card-image"
        style={{
          border: `4px solid ${seat.partyColor}`
        }}
      />

      <div className="card-text">
        <h2>{member.firstname} {member.lastname}</h2>
        <p>{party}</p>
        <p>{birthDate}</p>
      </div>
    </div>
  );
}

export default Card;
