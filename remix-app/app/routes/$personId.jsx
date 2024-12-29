import { useLoaderData } from "@remix-run/react";

// Loader function to fetch member data
export const loader = async ({ params }) => {
  const memberResponse = await fetch(`http://localhost:3001/api/member_of_parliament/${params.personId}`);
  if (!memberResponse.ok) {
    throw new Response("Not Found", { status: 404 });
  }
  const member = await memberResponse.json();
  return { member };
};

export default function MemberInfo() {
  const { member } = useLoaderData();

  return (
    <div className="member-info">
      <img
        src={`http://localhost:3001/high-res/${member.image}`}
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
