import { useLoaderData } from "@remix-run/react";

export const loader = async ({ params }) => {
  const response = await fetch(`http://localhost:3001/api/MemberOfParliament/${params.personId}`);
  if (!response.ok) {
    throw new Response("Not Found", { status: 404 });
  }
  const member = await response.json();
  return member;
};

export default function MemberInfo() {
  const member = useLoaderData();

  // Render a loading state or placeholder if data is not yet available
  if (!member) {
    return <div>Member not found</div>;
  }

  return (
    <div className="main-content">
      <h2>{member.firstname} {member.lastname}</h2>
      <p>Eduskuntaryhmä: {member.parliamentGroup}</p>
      <p>Välihuutoja: {member.valihuuto_count}</p>
    </div>
  );
}
