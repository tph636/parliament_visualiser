import Menu from "../components/Menu/Menu";

export default function Index(): JSX.Element {
  const menuItems: MenuItem[] = [
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
        <h1>Tervetuloa välihuutoon!</h1>
        <p>
          "Välihuuto on lyhyt, äänekäs huomautus, jonka kansanedustaja voi esittää
          täysistunnossa toisen kansanedustajan pitämän puheenvuoron aikana."
        </p>
        <p>
          Välihuuto.fi näyttää Eduskunnan kauden 2025 tietoa.
        </p>
      </div>
    </div>
  );
}
