import { useLoaderData, useLocation } from "@remix-run/react";

// If you need to fetch additional data
export const loader = async ({ params }) => {
  const response = await fetch(`http://localhost:3001/api/MemberOfParliament/${params.personId}`);
  if (!response.ok) {
    throw new Response("Not Found", { status: 404 });
  }
  const member = await response.json();
  return member;
};

export default function MemberInfo() {
  const location = useLocation();
  const member = location.state.member;
  const seat = location.state.seat;

  // Render a loading state or placeholder if data is not yet available
  if (!member || !seat) {
    return <div>Member not found</div>;
  }

  return (
    <div className="member-info">
      <img
        src={`http://localhost:3001/memberImage/${seat.imagePath}`}
        alt={`Edustajan ${member.firstname} ${member.lastname} kuva`}
        className="member-image"
      />
      <h2>{member.firstname} {member.lastname}</h2>
      <p>Eduskuntaryhmä: {member.parliamentGroup}</p>
      <p>Välihuutoja: {member.valihuuto_count}</p>
    </div>
  );
}
