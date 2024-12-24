import { useState, useEffect } from 'react';
import Seatingplan from './Seatingplan/Seatingplan';
import Card from './Card/Card'
import './App.css';

function App() {
  const [seats, setSeats] = useState([]);
  const [seatsLoaded, setSeatsLoaded] = useState(false);
  const [members, setMembers] = useState([]);
  const [membersLoaded, setMembersLoaded] = useState(false);
  const [valihuutoAmount, setValihuutoAmount] = useState([]);

  const apiGetSeats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/SeatingOfParliament');
      const data = await response.json();
      setSeats(data);
      setSeatsLoaded(true);
    } catch (error) {
      console.error('Error fetching data:', error);
      setSeatsLoaded(true);
    }
  };

  const apiGetMembers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/MemberOfParliament');
      const data = await response.json();
      setMembers(data);
      setMembersLoaded(true);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMembersLoaded(true);
    }
  };

  const apiGetValihuudot = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/valihuudot/amount`);
      const data = await response.json();
      setValihuutoAmount(data); // Ensure the data format is as expected
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    apiGetSeats();
    apiGetMembers();
    apiGetValihuudot();
  }, []);

  return (
    <>
      <header>Välihuuto</header>
      <div className='main-content'>
        {seatsLoaded ? (<Seatingplan seats={seats} />) : ''}
        <div className='member-list'>
          <div className="card-list">
            {(seatsLoaded && membersLoaded) 
              ? (seats.map((seat) => {
                const member = members.find((mem) => mem.personId === seat.hetekaId);
                const huuto = valihuutoAmount.find((huuto) => huuto.firstname === member?.firstname && huuto.lastname === member?.lastname);
                return <Card key={seat.seatNumber} seat={seat} member={member} valihuutoAmount={huuto || { count: 0 }} />;
              }))
              : ''
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
