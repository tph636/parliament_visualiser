import { useLoaderData } from "@remix-run/react";
import Seatingplan from '../components/Seatingplan/Seatingplan';
import CardList from '../components/CardList/CardList';

// Loader function to fetch data
export const loader = async () => {
  const membersResponse = await fetch('http://localhost:3001/api/member_of_parliament');

  const members = await membersResponse.json();

  return { members };
};

export const headers = () => { 
  return { 
    "Cache-Control": "max-age=3600"
  };
};

// Main component
export default function Index() {
  const { members } = useLoaderData();

  return (
    <>
      <Seatingplan members={members} />
      <CardList members={members} />
    </>
  );
}
