import './MemberInfoCard.css';

const MemberInfoCard = ({ member }) => {
  return (
    <div className="seat-container">
      <div className="circle" style={{ borderColor: member.partyColor }}>
        <img src={`http://localhost:3001/tinyimages/${member.imagePath}`} alt={`Seat ${seatIndex}`} className="circle-image" />
      </div>
    </div>
  )
}

export default MemberInfoCard;
