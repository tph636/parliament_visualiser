import './Seat.css'

const Seat = ({seatIndex}) => {
  return (
    <div className="seat-container">
      <div className="circle"></div>
      <p className="text">{seatIndex}</p>
    </div>

  );
}

export default Seat;
