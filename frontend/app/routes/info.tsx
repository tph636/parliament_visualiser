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
        <p>
          Contact: valihuuto.raft613@passinbox.com
        </p>
      </div>
    </div>
  );
}
