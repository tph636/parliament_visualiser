import { useLoaderData } from "react-router";
import Menu from "../components/Menu/Menu";
import PartyBarChart from "../components/PartyBarChart/PartyBarChart";

export const loader = async () => {
  const baseURL = process.env.INTERNAL_BACKEND_API_URL;
  const response = await fetch(`${baseURL}/api/party`);

  if (!response.ok) {
    throw new Response("Failed to load party data", { status: 500 });
  }

  const parties = await response.json();
  return { parties };
};

export default function Index() {
  const { parties } = useLoaderData();

  const menuItems = [
    { name: "Etusivu", path: "/" },
    { name: "Kansanedustajat", path: "/kansanedustajat" },
    { name: "Puolueet", path: "/puolueet" },
    { name: "Info", path: "/info" }
  ];

  return (
    <div className="main-content">
      <div className="main-content__menu">
        <Menu items={menuItems} />
      </div>

      <div className="main-content__content">
        <PartyBarChart parties={parties} />
      </div>
    </div>
  );
}

