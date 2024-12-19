import './Seat.css';

const Seat = ({ seatIndex, member }) => {
  return (
    <div className="seat-container">
      <div className="circle" style={{ borderColor: member.partyColor }}>
        <img src={`http://localhost:3001/tinyimages/${member.imagePath}`} alt={`Seat ${seatIndex}`} className="circle-image" />
      </div>
    </div>
  )
}

export default Seat;
