import type { Member } from "../../types/Member";
import "./MemberDetails.css";

type Props = {
  member: Member;
};

export default function MemberDetails({ member }: Props) {
  return (
    <div className="member-details">
      <h2>Henkilötiedot</h2>
      <p>Syntymävuosi: {member.birth_year}</p>
      <p>Syntymäpaikka: {member.birth_place}</p>
      <p>Nykyinen kotikunta: {member.current_municipality}</p>
      <p>Ammatti: {member.profession}</p>
      <p>Eduskuntaryhmä: {member.parliament_group}</p>

      <h2>Koulutus</h2>
      <ul>
        {member.education?.map((edu, i) => (
          <li key={i}>
            {edu.name} – {edu.institution} ({edu.year})
          </li>
        ))}
      </ul>

      <h2>Työhistoria</h2>
      <ul>
        {member.work_history?.map((job, i) => (
          <li key={i}>
            {job.name} ({job.period})
          </li>
        ))}
      </ul>

      <h2>Ministeritehtävät</h2>
      <ul>
        {member.minister_roles?.map((role, i) => (
          <li key={i}>
            {role.ministry} – {role.name} ({role.start_date}–{role.end_date})
          </li>
        ))}
      </ul>

      <h2>Nykyiset toimielimet</h2>
      <ul>
        {member.current_committees?.map((c, i) => (
          <li key={i}>
            {c.name} – {c.role} (alkaen {c.start_date})
          </li>
        ))}
      </ul>

      <h2>Aiemmat toimielimet</h2>
      <ul>
        {member.previous_committees?.map((c, i) => (
          <li key={i}>
            {c.name} – {c.role} ({c.start_date}–{c.end_date})
          </li>
        ))}
      </ul>

      <h2>Sidonnaisuudet</h2>
      <ul>
        {member.affiliations?.length ? (
          member.affiliations.map((a, i) => <li key={i}>{a}</li>)
        ) : (
          <li>Ei ilmoitettuja sidonnaisuuksia</li>
        )}
      </ul>

      <h2>Lahjailmoitukset</h2>
      <ul>
        {member.gifts?.length ? (
          member.gifts.map((g, i) => <li key={i}>{g}</li>)
        ) : (
          <li>Ei ilmoitettuja lahjoja</li>
        )}
      </ul>
    </div>
  );
}
