import { useLoaderData } from "@remix-run/react";

// Loader function to fetch member data
export const loader = async ({ params }) => {
  const membersResponse = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/member_of_parliament`);
  if (!memberResponse.ok) {
    throw new Response("Not Found", { status: 404 });
  }
  const member = await memberResponse.json();
  return { member };
};

export const headers = () => { 
  return { 
    "Cache-Control": "max-age=3600"
  };
};

export default function MemberInfo() {
  const { member } = useLoaderData();

  return (
    <div className="member-info">
      <img
        src={`${import.meta.env.VITE_BACKEND_API_URL}/images/high-res/${member.image}`}
        alt={`Edustajan ${member.firstname} ${member.lastname} kuva`}
        className="member-image"
        style={{
          border: `4px solid ${member.party_color}`
        }}
      />
      <h2>{member.firstname} {member.lastname}</h2>
      <p>Eduskuntaryhmä: {member.parliament_group}</p>
      <p>Välihuutoja: {member.valihuuto_count}</p>
    </div>
  );
}
