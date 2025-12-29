import Menu from "../components/Menu/Menu";
import { useEffect } from "react";

export default function Index(): JSX.Element {
  useEffect(() => { document.title = "Etusivu"; }, []);
  
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

        <div
          style={{
            backgroundColor: "white",
            boxShadow: "0 4px 16px rgba(55,49,81,0.07)",
            border: "1.5px solid #ece8f6",
            lineHeight: 1.6,
            padding: 30,
          }}
        >
          <h1>Tervetuloa Välihuutoon!</h1>
          <i>
            "Välihuuto on lyhyt, äänekäs huomautus, jonka kansanedustaja voi esittää
            täysistunnossa toisen kansanedustajan pitämän puheenvuoron aikana."
          </i>
          <p>
            Tutki kansanedustajien välihuutoja, puheenvuoroja ja taustoja kaudella 2025. Sivustolta löydät myös tietoa edustajien saamista lahjoituksista ja muista taustatiedoista.
            Selaa, etsi ja löydä, mitä kansanedustajat ovat todella sanoneet?
          </p>
          <p>
            Sivuston tiedot ovat peräisin Eduskunnan avoimesta tietokannasta sekä Eduskunnan pöytäkirjoista ja voi sisältää virheitä.
          </p>
        </div>
      
      </div>
    </div>
  );
}
