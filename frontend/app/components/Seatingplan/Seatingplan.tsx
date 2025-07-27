import './Seatingplan.css';
import React, { useState, useMemo } from 'react';
import Seat from '../Seat/Seat';
import type { Member } from "../../types/Member";

// Calculate the X/Y coordinates of a point on an ellipse given arc distance
function ellipsePoint(a: number, b: number, arcLength: number) {
  // Helper to calculate Euclidean distance between two points
  function distance(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  // X/Y positions on the ellipse using parametric equations
  function ellipseX(theta: number) {
    return a * Math.cos(theta);
  }

  function ellipseY(theta: number) {
    return b * Math.sin(theta);
  }

  function ellipseAngle(theta: number) {
    return Math.atan2(b * Math.cos(theta), -a * Math.sin(theta));
  }

  // Walk along the ellipse until desired arc length is reached
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

// Format floating-point numbers into deterministic percentages for SSR hydration
function formatPercentage(value: number): string {
  return `${parseFloat(value.toFixed(4))}%`;
}

type SeatingplanProps = {
  members: Member[];
};

const Seatingplan = ({ members }: SeatingplanProps) => {
  const [hoveredSeat, setHoveredSeat] = useState<Member | null>(null);
  const [infoboxPosition, setInfoboxPosition] = useState({ top: 0, left: 0 });

  // Configuration: Number of seats per row, split into sections (like real parliament seating)
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

  const ellipseArcLen = 15;
  const seatWidth = ellipseArcLen / 37;
  const gapWidth = seatWidth * 2;
  const margin = seatWidth * 0.2;

  // 🧠 Precompute all seat layout and style props to ensure SSR/client consistency
  const precomputedLayout = useMemo(() => {
    let a = 3, b = 2.5;
    let seatIndex = -1;
    const layout: { member: Member; style: React.CSSProperties; type: string }[] = [];

    plan.forEach((row, rowIndex) => {
      const seatsInRow = row.reduce((sum, n) => sum + n, 0);
      seatIndex += seatsInRow;
      let currentSeatIndex = seatIndex;
      let nthSeatInRow = 1;
      const seatsBeforeMiddle = row.length > 1 ? row[0] + row[1] : 0;

      for (let countIndex = 0; countIndex < row.length; countIndex++) {
        const count = row[countIndex];

        for (let i = 0; i < count; i++) {
          const seatFromMiddle = nthSeatInRow <= seatsBeforeMiddle
            ? Math.abs(nthSeatInRow - seatsBeforeMiddle) + 1
            : Math.abs(nthSeatInRow - seatsBeforeMiddle);

          const distFromMiddle = row[1] < seatFromMiddle
            ? gapWidth / 2 + seatWidth * seatFromMiddle + margin * seatFromMiddle
            : seatWidth * seatFromMiddle + margin * seatFromMiddle;

          const pointFromMiddle = ellipsePoint(a, b, distFromMiddle);
          const seat_x = nthSeatInRow <= seatsBeforeMiddle ? pointFromMiddle.x : -pointFromMiddle.x;
          const seat_y = pointFromMiddle.y;

          const member = members.find(mem => mem.seat_number === currentSeatIndex);
          if (member) {
            layout.push({
              member,
              type: seatsInRow === 1 ? "chairman" : "seat",
              style: {
                position: "absolute",
                width: formatPercentage((seatWidth * 100) / 15),
                left: formatPercentage(seatsInRow === 1 ? 50 : 50 + (seat_x * 100) / 15),
                top: formatPercentage(seatsInRow === 1 ? 10 : (seat_y * 100) / 10)
              }
            });
          }

          nthSeatInRow++;
          currentSeatIndex--;
        }
      }

      // Expand ellipse for next row (to simulate visual depth)
      const oldb = b;
      b += seatWidth + gapWidth / 2;
      a = a * b / oldb;
    });

    return layout;
  }, [members]);

  // 🖱️ Handle hover to display infobox over hovered seat
  const handleMouseEnter = (member: Member, event: React.MouseEvent<HTMLDivElement>) => {
    setHoveredSeat(member);

    const container = document.querySelector('.seating-plan');
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const seatRect = (event.target as HTMLDivElement).getBoundingClientRect();

    setInfoboxPosition({
      top: seatRect.top - containerRect.top - 10,
      left: seatRect.left - containerRect.left + seatRect.width / 2
    });
  };

  return (
    <div className="seating-plan">
      {/* Render precomputed seat layout */}
      {precomputedLayout.map(({ member, style, type }) => (
        <Seat
          key={`seat-${member.seat_number}`}
          style={style}
          type={type}
          member={member}
          onMouseEnter={(e) => handleMouseEnter(member, e)}
          onMouseLeave={() => setHoveredSeat(null)}
        />
      ))}

      {/* Tooltip-style infobox when a seat is hovered */}
      {hoveredSeat && (
        <div
          className="infobox"
          style={{
            top: `${infoboxPosition.top}px`,
            left: `${infoboxPosition.left}px`,
            transform: 'translateX(-50%) translateY(-100%)'
          }}
        >
          <p>{hoveredSeat.firstname} {hoveredSeat.lastname}</p>
          <p>{hoveredSeat.party}</p>
        </div>
      )}
    </div>
  );
};

export default Seatingplan;
