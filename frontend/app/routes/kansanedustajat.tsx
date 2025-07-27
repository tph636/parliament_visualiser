import { useLoaderData } from 'react-router';
import Seatingplan from '../components/Seatingplan/Seatingplan';
import CardList from '../components/CardList/CardList';
import Menu from '../components/Menu/Menu';

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

export default function Index() {
  const { members } = useLoaderData();

  const menuItems = [
    { name: "Etusivu", path: "/" },
    { name: "Kansanedustajat", path: "/kansanedustajat" },
    { name: "Puolueet", path: "/puolueet" },
    { name: "Info", path: "/info" },
  ];

  return (
    <div className="main-content">
      
      <div className="main-content__menu">
        <Menu items={menuItems} />
      </div>

      <div className="main-content__content">
        <Seatingplan members={members} />
        <CardList members={members} />
      </div>

    </div>
  );
}

