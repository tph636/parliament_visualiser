import React from 'react';
import { useParams } from 'react-router-dom';
toString
const MemberInfo = ({ members }) => {
  const { hetekaId } = useParams();
  console.log(hetekaId)
  
  const member = members.find(mem => mem.personId == hetekaId);
  
  if (!member) {
    return <div>Member not found</div>;
  }

  return (
    <div className='member-info'>
      <h2>{member.firstname} {member.lastname}</h2>
      <p>Eduskuntaryhmä: {member.parliamentGroup}</p>
      <p>Välihuutoja: {member.valihuuto_count}</p>
    </div>
  );
};

export default MemberInfo;
