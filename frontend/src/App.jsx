import { useState, useEffect } from 'react';
import Seatingplan from './Seatingplan/Seatingplan';
import './App.css';

function App() {
  const [members, setMembers] = useState([]);
  const [membersLoaded, setMembersLoaded] = useState(false); // Add loading state

  const apiGet = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/SeatingOfParliament');
      const data = await response.json();
      setMembers(data); // Update the state with the fetched data
      setMembersLoaded(true); // Set loading to false after data is fetched
    } catch (error) {
      console.error('Error fetching data:', error);
      setMembersLoaded(true); // Ensure loading is set to false even on error
    }
  };



  useEffect(() => {
    apiGet();
  }, []);

  return (
    <div className='main-wrapper'>
      <div className='left-col'>
        {membersLoaded ? (<Seatingplan members={members}/>) : (<p>Loading...</p>)}
      </div>
      <div className='right-col'></div>
    </div>
  );
}

export default App;
