import MyBirthCalendar from "./MyBirthCalendar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Program = ({ onClose = () => {} }) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger fade in animation after component mounts
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    });
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div
        className={`fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center transition-all duration-300`}
      >
        <div
          className={` max-h-full max-w-full transform overflow-y-auto rounded bg-slate-50 p-10 transition-all duration-300 ease-in-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <MyBirthCalendar />
        </div>
      </div>
    </div>
  );
};

Program.propTypes = {
  onClose: PropTypes.func,
};

export default Program;
