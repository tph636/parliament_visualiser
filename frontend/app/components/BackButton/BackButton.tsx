import { useNavigate } from "react-router";
import "./BackButton.css";

type BackButtonProps = {
  label?: string;
};

export default function BackButton({ label = "← Takaisin" }: BackButtonProps): JSX.Element {
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
