import { useLoaderData } from "react-router";
import Menu from "../components/Menu/Menu";
import PartyValihuutoChart from "../components/PartyValihuutoChart/PartyValihuutoChart";
import PartySpeechChart from "../components/PartySpeechChart/PartySpeechChart";

export const loader = async () => {
  const baseURL = process.env.INTERNAL_BACKEND_API_URL;

  const [valihuudotRes, speechesRes] = await Promise.all([
    fetch(`${baseURL}/api/party/valihuudot`),
    fetch(`${baseURL}/api/party/speeches`)
  ]);

  if (!valihuudotRes.ok || !speechesRes.ok) {
    throw new Response("Failed to load party data", { status: 500 });
  }

  const valihuudot = await valihuudotRes.json();
  const speeches = await speechesRes.json();

  return { valihuudot, speeches };
};


export default function Index() {
  const { valihuudot, speeches } = useLoaderData() as {
    valihuudot: Party[];
    speeches: Party[];
  };

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
        <PartyValihuutoChart parties={valihuudot} />
        <PartySpeechChart parties={speeches} />
      </div>
    </div>
  );
}


