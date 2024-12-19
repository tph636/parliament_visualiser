import './Seat.css'

const Seat = ({seatIndex, member}) => {
  return (
    <div className="seat-container">
      <div className="circle"></div>
      <p className="text">
        {member.firstname} <br></br>
        {member.lastname}
      </p>
    </div>

  );
}

export default Seat;
