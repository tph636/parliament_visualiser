import Menu from "../components/Menu/Menu";
import { useEffect } from "react";

export default function Index(): JSX.Element {
  useEffect(() => { document.title = "Info"; }, []);

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

        <div style={{
            backgroundColor: "white",
            boxShadow: "0 4px 16px rgba(55,49,81,0.07)",
            border: "1.5px solid #ece8f6",
            lineHeight: 1.6,
            padding: 30,
          }}>
          <p>
            Email: valihuuto.raft613@passinbox.com
          </p>
        </div>

      </div>
    </div>
  );
}
