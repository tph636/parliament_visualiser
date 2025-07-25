import React from 'react';
import "./PersonInfo.css";

const PersonInfo = ({ member })  => {
  return (
<div className="member-section">
  <div className="member-info">
    <img
      src={`${import.meta.env.VITE_BACKEND_API_URL}/images/high-res/${member.image}`}
      alt={`Edustajan ${member.firstname} ${member.lastname} kuva`}
      className="member-image"
      style={{
        border: `4px solid ${member.party_color}`
      }}
    />
    <div className="member-info-text">
      <h2>{member.firstname} {member.lastname}</h2>
      <p>{member.parliament_group}</p>
      <p>Välihuutoja: {member.valihuuto_count}</p>
    </div>
  </div>
</div>





  );
}

export default PersonInfo;
