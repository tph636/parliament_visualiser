import Menu from "../components/Menu/Menu";
import SearchBar from "../components/SearchBar/SearchBar";

export default function Index(): JSX.Element {

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
        <h2>Hae kansanedustajien puheita</h2>
        <SearchBar />
      </div>
    </div>
  );
}
