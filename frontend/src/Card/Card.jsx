import './Card.css';
import React from 'react';
import { useState, useEffect } from 'react';

const Card = ({ seat, member }) => {
  const [valihuutoAmount, setValihuutoAmount] = useState(null);

  const parser = new DOMParser(); 
  const xmlDoc = parser.parseFromString(member.XmlDataFi, "text/xml");
  const birthDate = xmlDoc.getElementsByTagName("SyntymaPvm")[0].childNodes[0].nodeValue;
  const email = xmlDoc.getElementsByTagName("SahkoPosti")[0].childNodes[0].nodeValue;
  const party = xmlDoc.getElementsByTagName("NykyinenEduskuntaryhma")[0].getElementsByTagName("Nimi")[0].childNodes[0].nodeValue;  

  const apiGetValihuudot = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/valihuudot/${member.firstname} ${member.lastname}/amount`);
      const data = await response.json();
      console.log('Fetched valihuutoAmount:', data); // Debugging
      setValihuutoAmount(data[0]?.count || 0); // Ensure the data format is as expected
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    apiGetValihuudot();
  }, []);

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
        <p>Välihuutoja: {valihuutoAmount !== null ? valihuutoAmount : ''}</p>
      </div>
    </div>
  );
}

export default Card;
