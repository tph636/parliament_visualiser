import React from "react";
import "./Menu.css";
import { Link } from "@remix-run/react";

export default function Menu({ items }) {
  return (
    <nav className="menu">
      <ul>
        {items.map(({ name, path }, index) => (
          <li key={index}>
            <Link to={path}>{name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
