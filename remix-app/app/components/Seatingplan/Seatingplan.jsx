import './Seatingplan.css';
import React from 'react';
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

const Seatingplan = ({ seats }) => {
  const plan = [
    [1],
    [5, 3, 3, 5],
    [7, 4, 4, 7],
    [8, 5, 5, 8],
    [10, 6, 6, 10],
    [8, 7, 7, 8],
    [6, 8, 8, 7],
    [4, 9, 9, 4],
    [0, 9, 9, 0]
  ];

  let a = 3;
  let b = 2.5;
  const ellipseArcLen = 20.185;
  const seatWidth = ellipseArcLen / 40;
  const gapWidth = seatWidth;

  let seatIndex = -1;
  let rowNum = 1;

  const generateRow = (row, rowIndex) => {
    const seatsInRow = row.reduce((sum, i) => sum + i, 0);
    seatIndex += seatsInRow;
    let currentSeatIndex = seatIndex;
    let nthSeatInRow = 1;

    const rowSeats = [];
    const seatsBeforeMiddle = row.length > 1 ? row[0] + row[1] : 0;

    for (let countIndex = 0; countIndex < row.length; countIndex++) {
      const count = row[countIndex];
      const seatGroup = [];

      for (let i = 0; i < count; i++) {
        const seatFromMiddle = nthSeatInRow <= seatsBeforeMiddle ? 
          Math.abs(nthSeatInRow - seatsBeforeMiddle) + 1 : 
          Math.abs(nthSeatInRow - seatsBeforeMiddle);

        const distFromMiddle = row[1] < seatFromMiddle ? 
          gapWidth + seatWidth * seatFromMiddle : 
          seatWidth * seatFromMiddle;

        const pointFromMiddle = ellipsePoint(a, b, distFromMiddle);
        const pointX = nthSeatInRow <= seatsBeforeMiddle ? 
          pointFromMiddle.x : 
          -pointFromMiddle.x;
        const pointY = pointFromMiddle.y;

        seatGroup.push(
          <div
            className={seatsInRow === 1 ? 'chairman' : 'seat'}
            key={`seat-${currentSeatIndex}`}
            style={{
              '--ellipseA': a,
              '--ellipseB': b,
              '--seatWidth': `${seatWidth}`,
              '--gapWidth': `${gapWidth}`,
              '--pointX': pointX,
              '--pointY': pointY
            }}
          >
            <Seat
              seatIndex={currentSeatIndex}
              seat={seats.find(mem => mem.seatNumber === currentSeatIndex)}
            />
          </div>
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
    </div>
  );
};

export default Seatingplan;
