import { useLoaderData } from "@remix-run/react";
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
      <Menu items={menuItems} />
    </div>
  );
}
