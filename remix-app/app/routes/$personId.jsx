import { useLoaderData } from "@remix-run/react";

// Loader function to fetch both member and seat data
export const loader = async ({ params }) => {
  const memberResponse = await fetch(`http://localhost:3001/api/member_of_parliament/${params.personId}`);
  if (!memberResponse.ok) {
    throw new Response("Not Found", { status: 404 });
  }
  const member = await memberResponse.json();

  const seatResponse = await fetch(`http://localhost:3001/api/seating_of_parliament/${params.personId}`);
  if (!seatResponse.ok) {
    throw new Response("Not Found", { status: 404 });
  }
  const seat = await seatResponse.json();
  return { member, seat };
};

export default function MemberInfo() {
  const { member, seat } = useLoaderData();

  return (
    <div className="member-info">
      <img
        src={`http://localhost:3001/memberImage/${seat.image_path}`}
        alt={`Edustajan ${member.firstname} ${member.lastname} kuva`}
        className="member-image"
        style={{
          border: `4px solid ${seat.party_color}`
        }}
      />
      <h2>{member.firstname} {member.lastname}</h2>
      <p>Eduskuntaryhmä: {member.parliament_group}</p>
      <p>Välihuutoja: {member.valihuuto_count}</p>
    </div>
  );
}
