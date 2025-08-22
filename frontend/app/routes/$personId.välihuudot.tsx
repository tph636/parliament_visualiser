import { useLoaderData } from "react-router";
import PersonInfo from "../components/PersonInfo/PersonInfo";
import ValihuudotList from "../components/ValihuudotList/ValihuudotList";
import Menu from '../components/Menu/Menu';
import { useEffect, useState } from 'react';
import BackButton from "~/components/BackButton/BackButton";

export const loader = async ({ params }) => {
  const baseURL = process.env.INTERNAL_BACKEND_API_URL;
  const memberResponse = await fetch(`${baseURL}/api/member_of_parliament/${params.personId}`);

  if (!memberResponse.ok) {
    throw new Response("Not Found", { status: 404 });
  }

  const member = await memberResponse.json();
  return { member };
};

export const headers = () => ({
  "Cache-Control": "max-age=3600"
});




export default function MemberPage() {
  const { member } = useLoaderData();
  const [isHydrated, setIsHydrated] = useState(false);

  const menuItems = [
    { name: "Tietoa", path: `/kansanedustaja/${member.person_id}` },
    { name: "Välihuudot", path: `/kansanedustaja/${member.person_id}/välihuudot` },
  ];
  
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <>
      <PersonInfo member={member} />

      <div className="main-content">
      
        <div className="main-content__menu">
          <Menu items={menuItems} />
        </div>

        <div className="main-content__content">
          {isHydrated && (
            <ValihuudotList personId={member.person_id} />
          )}
        </div>

      </div>
    </>
  );
}