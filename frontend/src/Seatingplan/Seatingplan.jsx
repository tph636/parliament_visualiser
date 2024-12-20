import './Seatingplan.css'
import React from 'react';
import Seat from '../Seat/Seat';

function ellipsePoint(a, b, arcLength) {
  // Function to calculate distance between two points
  function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  // Parametric equations for the ellipse
  function ellipseX(theta) {
    return a * Math.cos(theta);
  }

  function ellipseY(theta) {
    return b * Math.sin(theta);
  }

  // Starting from the top of the ellipse (theta = pi/2)
  let theta = Math.PI / 2;
  let length = 0;
  const step = 0.001; // Small step size for theta

  while (length < arcLength) {
    const x1 = ellipseX(theta);
    const y1 = ellipseY(theta);
    theta += step;
    const x2 = ellipseX(theta);
    const y2 = ellipseY(theta);
    length += distance(x1, y1, x2, y2);
  }

  return { x: ellipseX(theta), y: ellipseY(theta) };
}




const Seatingplan = ({members, pictures}) => {

  var plan = [
    [1], // Chairman
    [5,3,3,5], // 1st. row
    [7,4,4,7], // 2nd. row
    [8,5,5,8], // ...
    [10,6,6,10],
    [8,7,7,8],
    [6,8,8,7],
    [4,9,9,4],
    [0,9,9,0]
  ]

  // Eduskunnan ellipsin kaava xradius=3.6 yradius=2.8
  var a = 2.8
  var b = 3.6
  let ellipseArcLen = 20.185
  const seatWidth = ellipseArcLen/40;
  const gapWidth = seatWidth;


  let seatIndex = -1 // Index of the seat to which we will generate the seats
  let rowNum = 1 // Current row number


  // Generates one row of the seatingplan
  const generateRow = (row) => {

    var seatsInRow = row.reduce((sum, i) => sum + i, 0)
    seatIndex += seatsInRow

    // In each row the seat numbers are in descending order, which is why we decrement this number
    var currentSeatIndex = seatIndex 
    
    let nthSeatInRow = 1 // Current seat from left to right

    const seats = [] // All the seats in a row to be rendered

    // The amount of seats on the left side of the middle corridor. 0 if only one seat (chariman)
    let seatsBeforeMiddle = 0
    if (row.length > 1) { seatsBeforeMiddle = row[0] + row[1] }


    // Process all seats of a row:
    for (const count of row) {
      console.log("###############")
      let seatGroup = []

      for (let i = 0; i < count; i++) {

        // Calculate the seat number from the middle
        let seatFromMiddle = nthSeatInRow <= seatsBeforeMiddle ? 
          Math.abs(nthSeatInRow-seatsBeforeMiddle) + 1 :
          Math.abs(nthSeatInRow-seatsBeforeMiddle)

        // Calculate seat distance from middle. If seat is not in the group of seats next to middle, add a gap to dist (see layout of Finnish paliament house).
        let distFromMiddle = 
          row[1] < seatFromMiddle ? 
          gapWidth + seatWidth*seatFromMiddle :
          seatWidth*seatFromMiddle

        // Calculate the point on the ellipse
        let pointFromMiddle = ellipsePoint(a,b,distFromMiddle)

        // X and Y of the point on the ellipse. X is negative if seat is on left side of hall.
        let pointX = nthSeatInRow <= seatsBeforeMiddle ?
          pointFromMiddle.x :
          -pointFromMiddle.x
        let pointY = pointFromMiddle.y

        console.log(pointY)

        seatGroup.push(
          <div
          className={seatsInRow === 1 ? 'chairman' : 'seat'}
          key={currentSeatIndex} 
          style={{ 
            '--seatWidth': seatWidth,
            '--gapWidth': gapWidth,
            '--pointX': pointX,
            '--pointY': pointY
            }}
          >
            <Seat  
              seatIndex={currentSeatIndex} 
              member={members.find(mem => mem.seatNumber===currentSeatIndex)}
              />
          </div>
        )

        nthSeatInRow += 1
        currentSeatIndex -= 1
      }

      // Add generated seats to the seats array
      seats.push(seatGroup)

    }

    rowNum += 1
    
    let oldb = b
    b += seatWidth + gapWidth
    a = a*b/oldb

    return (
      <div className='row'>{seats.map((group)=><div className='seatGroup'>{group}</div>)}</div>
    )
  }

  return (
    
    <div className="seating-plan">
      {plan.map((row) => (generateRow(row)))}
    </div>
  )
}


export default Seatingplan;
