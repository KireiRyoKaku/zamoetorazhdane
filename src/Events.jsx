import MyBirthCalendar from "./MyBirthCalendar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import PropTypes from "prop-types";

const Events = ({ onClose }) => {
  const [isBlurred, setIsBlurred] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setIsBlurred(false), 10);
  }, []);

  const handleClose = () => {
    setIsBlurred(true);

    // Use requestAnimationFrame to ensure the blur effect is applied before closing
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          onClose(navigate("/"));
        }, 300); // Match this with the transition duration
      });
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center transition-all duration-300 ${
          isBlurred ? "opacity-0" : "opacity-100"
        }`}
      >
        <div
          className={`max-h-full max-w-full overflow-y-auto rounded bg-slate-50 p-10 font-montserrat transition-all duration-300 ${
            isBlurred ? "scale-95 blur-md" : "scale-100 blur-0"
          }`}
        >
          <MyBirthCalendar />
          <div className="flex w-full justify-center">
            <button className="back-button-test" onClick={handleClose}>
              Назад
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Events.propTypes = {
  onClose: PropTypes.func.isRequired,
};
export default Events;
