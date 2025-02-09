// import { useState } from "react";
import PopupMenu from "./PopupMenu";
import { useNavigate } from "react-router-dom";

const TitleAndMenu = () => {
  const navigate = useNavigate();

  const handleClickAbout = () => {
    navigate("/about");
  };

  return (
    <div>
      <button className="dropdown-menu button" onClick={handleClickAbout}>
        <h1 className="font-makLight text-7xl font-bold text-slate-50 transition-transform duration-500 hover:scale-110">
          за моето <br />
          раждане
        </h1>
      </button>

      <h2 className="custom-h2-style text-3xl">
        общност за майки на живо в Пловдив
      </h2>
      <PopupMenu />
    </div>
  );
};

export default TitleAndMenu;
