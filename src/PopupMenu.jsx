import { useState } from "react";
import Events from "./Events";
import { useNavigate } from "react-router-dom";

const PopupMenu = () => {
  const navigate = useNavigate();
  const [showEvents, setShowEvents] = useState(false);

  const handleClickEvents = () => {
    navigate("/program");
    setShowEvents(true);
  };

  return (
    <div>
      <div className="dropdown-menu">
        <button>Екип</button>
        <button className="button" onClick={handleClickEvents}>
          Програма
        </button>
        <button>Контакти</button>
      </div>
      {showEvents && (
        <Events
          onClose={() => {
            setShowEvents(false);
          }}
        />
      )}
    </div>
  );
};

export default PopupMenu;
