import './Seatingplan.css';
import React, { useState } from 'react';
import Seat from '../Seat/Seat';

function ellipsePoint(a, b, arcLength) {
  function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  function ellipseX(theta) {
    return a * Math.cos(theta);
  }

  function ellipseY(theta) {
    return b * Math.sin(theta);
  }

  function ellipseAngle(theta) {
    return Math.atan2(b * Math.cos(theta), -a * Math.sin(theta));
  }

  let theta = Math.PI / 2;
  let length = 0;
  const step = 0.001;

  while (length < arcLength) {
    const x1 = ellipseX(theta);
    const y1 = ellipseY(theta);
    theta += step;
    const x2 = ellipseX(theta);
    const y2 = ellipseY(theta);
    length += distance(x1, y1, x2, y2);
  }

  return { x: ellipseX(theta), y: ellipseY(theta), angle: ellipseAngle(theta) };
}

const Seatingplan = ({ members }) => {
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [infoboxPosition, setInfoboxPosition] = useState({ top: 0, left: 0 });

  const plan = [
    [1],          // Chairman
    [5, 3, 3, 5], // 1st. row
    [7, 4, 4, 7], // 2nd. row ...
    [8, 5, 5, 8],
    [10, 6, 6, 10],
    [8, 7, 7, 8],
    [6, 8, 8, 7],
    [4, 9, 9, 4],
    [0, 9, 9, 0]
  ];

  let a = 3;
  let b = 2.5;
  const ellipseArcLen = 15;
  const seatWidth = ellipseArcLen / 37; // Width of the seat
  const gapWidth = seatWidth * 2; // Gap between seat groups (width of the hallway)
  const margin = seatWidth * 0.2; // Gap between each individual seat

  let seatIndex = -1;
  let rowNum = 1;

  const handleMouseEnter = (member, event) => {
    setHoveredSeat(member);

    const container = document.querySelector('.seating-plan');
    const containerRect = container.getBoundingClientRect();
    const seatRect = event.target.getBoundingClientRect();

    setInfoboxPosition({
      top: seatRect.top - containerRect.top - 10, // slightly above
      left: seatRect.left - containerRect.left + seatRect.width / 2 // centered horizontally
    });
  };


  const generateRow = (row, rowIndex) => {
    const seatsInRow = row.reduce((sum, i) => sum + i, 0);
    seatIndex += seatsInRow;
    let currentSeatIndex = seatIndex;
    let nthSeatInRow = 1;

    const rowSeats = []; // Append Seat components here

    const seatsBeforeMiddle = row.length > 1 ? row[0] + row[1] : 0; // Seats before the middle hallway

    // Start generating seats from left to right. countIndex tells the seat group of the current row
    for (let countIndex = 0; countIndex < row.length; countIndex++) {
      const count = row[countIndex];
      const seatGroup = [];

      // Generate all the seats in a seat group
      for (let i = 0; i < count; i++) {

        // Number of the seat starting from the middle hallway
        const seatFromMiddle = nthSeatInRow <= seatsBeforeMiddle ? 
          Math.abs(nthSeatInRow - seatsBeforeMiddle) + 1 : 
          Math.abs(nthSeatInRow - seatsBeforeMiddle);

        // Distance from the middle hallway
        const distFromMiddle = row[1] < seatFromMiddle ? 
          gapWidth / 2 + seatWidth * seatFromMiddle + margin * seatFromMiddle : 
          seatWidth * seatFromMiddle + margin * seatFromMiddle;

        const pointFromMiddle = ellipsePoint(a, b, distFromMiddle);
        const pointX = nthSeatInRow <= seatsBeforeMiddle ? 
          pointFromMiddle.x : 
          -pointFromMiddle.x;
        const pointY = pointFromMiddle.y;

        const member = members.find(mem => mem.seat_number === currentSeatIndex);

        seatGroup.push(
<Seat
  key={`seat-${currentSeatIndex}`}
  style={{
    position: "absolute", // Allows each seat to be placed freely within the seating-plan container

    // Set the seat’s width as a percentage of the container, based on seatWidth and scaling factor
    width: `${(seatWidth * 100) / 15}%`,


    // Position seat horizontally:
    // Chairman is centered at 50%; other seats are offset based on their elliptical X coordinate
    left: `${seatsInRow === 1 ? 50 : 50 + (pointX * 100) / 15}%`,

    // Position seat vertically:
    // Chairman is manually placed at 10%; other seats use their elliptical Y coordinate, plus offset to push them lower
    top: `${seatsInRow === 1 ? 10 : (pointY * 100) / 10}%`,


  }}
  type={seatsInRow === 1 ? "chairman" : "seat"} // Assign special type if seat is chairman
  seatIndex={currentSeatIndex} // Unique seat identifier
  member={member} // Member data for that seat
  onMouseEnter={(e) => handleMouseEnter(member, e)} // Show tooltip on hover
  onMouseLeave={() => setHoveredSeat(null)} // Hide tooltip when mouse leaves
/>


        );

        nthSeatInRow += 1;
        currentSeatIndex -= 1;
      }

      rowSeats.push(<div className='seatGroup' key={`group-${rowIndex}-${countIndex}`}>{seatGroup}</div>);
    }

    rowNum += 1;
    const oldb = b;
    b += seatWidth + gapWidth / 2;
    a = a * b / oldb;

    return (
      <div className='row' key={`row-${rowIndex}`}>
        {rowSeats}
      </div>
    );
  };

  return (
    <div className="seating-plan">
      {plan.map((row, rowIndex) => generateRow(row, rowIndex))}
      {hoveredSeat && (
        <div className="infobox" style={{ top: `${infoboxPosition.top}px`, left: `${infoboxPosition.left}px`, transform: 'translateX(-50%) translateY(-100%)' }}>
          <p>{hoveredSeat.firstname} {hoveredSeat.lastname}</p>
          <p>{hoveredSeat.party}</p>
        </div>
      )}
    </div>
  );
};

export default Seatingplan;