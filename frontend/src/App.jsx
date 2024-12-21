import { useState, useEffect } from 'react';
import Seatingplan from './Seatingplan/Seatingplan';
import Card from './Card/Card'
import './App.css';

function App() {
  const [members, setMembers] = useState([]);
  const [membersLoaded, setMembersLoaded] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);

  const apiGet = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/SeatingOfParliament');
      const data = await response.json();
      setMembers(data);
      setMembersLoaded(true);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMembersLoaded(true);
    }
  };

  useEffect(() => {
    apiGet();
  }, []);

  return (
    <>
      <header>Välihuuto</header>
      <div className='main-content'>
        {membersLoaded ? (<Seatingplan members={members} />) : (<p></p>)}
        <div className='member-list'>
          <div className="card-list">
            {membersLoaded ? (members.map((member) => <Card key={member.id} member={member} />)) : (<p></p>)}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
