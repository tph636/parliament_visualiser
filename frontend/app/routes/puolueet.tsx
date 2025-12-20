import { useLoaderData } from 'react-router';
import Menu from '../components/Menu/Menu';


export default function Index() {

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
        <p>TODO</p>
      </div>

    </div>
  );
}
