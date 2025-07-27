import React from "react";
import "./Menu.css";
import { Link } from "react-router-dom";

export interface MenuItem {
  name: string;
  path: string;
}

interface MenuProps {
  items: MenuItem[];
}

export default function Menu({ items }: MenuProps): JSX.Element {
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
