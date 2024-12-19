import { useState, useEffect } from 'react';
import Seatingplan from './Seatingplan/Seatingplan';

function App() {
  const [members, setMembers] = useState([]);

  // Function to fetch data from the API
  const apiGet = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/SeatingOfParliament');
      const data = await response.json();
      setMembers(data); // Update the state with the fetched data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // useEffect to call the API once when the component mounts
  useEffect(() => {
    apiGet();
  }, []);

  return (
    <>
      <div>
        <Seatingplan members={members} />
      </div>
    </>
  );
}

export default App;
