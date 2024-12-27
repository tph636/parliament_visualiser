import { useLoaderData } from "@remix-run/react";
import Seatingplan from '../components/Seatingplan/Seatingplan';
import CardList from '../components/CardList/CardList';

// Loader function to fetch data
export const loader = async () => {
  const seatsResponse = await fetch('http://localhost:3001/api/SeatingOfParliament');
  const membersResponse = await fetch('http://localhost:3001/api/MemberOfParliament');

  if (!seatsResponse.ok || !membersResponse.ok) {
    throw new Response("Failed to fetch data", { status: 500 });
  }

  const seats = await seatsResponse.json();
  const members = await membersResponse.json();

  return { seats, members };
};

// Main component
export default function Index() {
  const { seats, members } = useLoaderData();

  return (
    <>
      <Seatingplan seats={seats} />
      <CardList seats={seats} members={members} />
    </>
  );
}
