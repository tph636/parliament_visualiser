import { useState, useEffect } from 'react';
import Seatingplan from './Seatingplan/Seatingplan';
import CardList from './CardList/CardList';
import './App.css';

function App() {
  const [seats, setSeats] = useState([]);
  const [seatsLoaded, setSeatsLoaded] = useState(false);
  const [members, setMembers] = useState([]);
  const [membersLoaded, setMembersLoaded] = useState(false);

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

  useEffect(() => {
    apiGetSeats();
    apiGetMembers();
  }, []);

  return (
    <>
      <header>Välihuuto</header>
      <div className='main-content'>

        {seatsLoaded ? (<Seatingplan seats={seats} />) : ''}

        {(seatsLoaded && membersLoaded) 
          ? <CardList seats={seats} members={members} />
          : ''
        }
        
      </div>
    </>
  );
}

export default App;
