import React from "react";
import "./Menu.css";
import { Link } from "@remix-run/react";

export default function Menu() {
  return (
    <nav className="menu">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/members">Members</Link></li>
        <li><Link to="/valihuudot">Välihuudot</Link></li>
        {/* Add more links as needed */}
      </ul>
    </nav>
  );
} 