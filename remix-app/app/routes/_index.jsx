import { useLoaderData } from "@remix-run/react";
import Seatingplan from '../components/Seatingplan/Seatingplan';
import CardList from '../components/CardList/CardList';

// Loader function to fetch data
export const loader = async () => {
  const baseURL = process.env.INTERNAL_BACKEND_API_URL;

  const membersResponse = await fetch(`${baseURL}/api/member_of_parliament`);

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
    <div className="main-content">
      <Seatingplan members={members} />
      <CardList members={members} />
    </div>
  );
}
