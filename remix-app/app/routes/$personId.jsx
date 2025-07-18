import { useLoaderData } from "@remix-run/react";
import PersonInfo from "../components/PersonInfo/PersonInfo";

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
  return (
    <>
      <PersonInfo member={member} />
    </>
  );
}
