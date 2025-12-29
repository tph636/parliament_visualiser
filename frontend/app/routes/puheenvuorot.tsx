import Menu from "../components/Menu/Menu";
import SearchBar from "../components/SearchBar/SearchBar";
import { useEffect } from "react";

export default function Index(): JSX.Element {
  useEffect(() => { document.title = "Puheenvuorot"; }, []);

  const menuItems: MenuItem[] = [
    { name: "Etusivu", path: "/" },
    { name: "Kansanedustajat", path: "/kansanedustajat" },
    { name: "Puolueet", path: "/puolueet" },
    { name: "Puheenvuorot", path: "/puheenvuorot" },
    { name: "Info", path: "/info" },
  ];

  return (
    <div className="main-content">
      <div className="main-content__menu">
        <Menu items={menuItems} />
      </div>
      <div className="main-content__content">
        <SearchBar />
      </div>
    </div>
  );
}
