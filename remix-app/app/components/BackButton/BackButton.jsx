import React from "react";
import { useNavigate } from "@remix-run/react";
import "./BackButton.css";

export default function BackButton({ label = "← Takaisin" }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <button onClick={handleClick} className="back-button">
      {label}
    </button>
  );
}
