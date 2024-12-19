import './Seatingplan.css'
import React from 'react';
import Seat from '../Seat/Seat';

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

  let seatIndex = -1 // Index of the seat to which we will generate the seats

  // Generates one row of the seatingplan
  const generateRow = (row) => {

    var seatsInRow = row.reduce((sum, i) => sum + i, 0)
    seatIndex += seatsInRow

    // In each row the seat numbers are in descending order, which is why we decrement this number
    var currentSeatIndex = seatIndex 
    
    const seats = []
    for (const c of row) {
      for (let i = 0; i < c; i++) {
        seats.push(
        <Seat 
          key={currentSeatIndex} 
          seatIndex={currentSeatIndex} 
          member={members.find(mem => mem.seatNumber===currentSeatIndex)}
          />
        )
        currentSeatIndex -= 1
      }

      if (seatIndex - seatsInRow != currentSeatIndex){
        seats.push(<div className='spacer'></div>)
      }
    }

    return (
      <div className='row'>{seats}</div>
    )
  }

  return (
    <div className="seating-plan">
      {plan.map((row) => (generateRow(row)))}
    </div>
  )
}


export default Seatingplan;
