import React, { useState, useEffect } from 'react';
import Card from '../Card/Card';
import './CardList.css';

const CardList = ({ seats, members }) => {
  const [valihuutoAmount, setValihuutoAmount] = useState([]);

  const apiGetValihuudot = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/valihuudot/amount`);
      const data = await response.json();
      console.log('Fetched valihuutoAmount:', data); // Debugging
      setValihuutoAmount(data); // Ensure the data format is as expected
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    apiGetValihuudot();
  }, []);

  return (
    <div className="card-list">
      {seats.map((seat) => {
        const member = members.find((mem) => mem.personId === seat.hetekaId);
        const huuto = valihuutoAmount.find((huuto) => huuto.firstname === member?.firstname && huuto.lastname === member?.lastname);
        return <Card key={seat.seatNumber} seat={seat} member={member} valihuutoAmount={huuto || { count: 0 }} />;
      })}
    </div>
  );
};

export default CardList;
