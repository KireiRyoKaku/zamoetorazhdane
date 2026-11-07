import { useState } from "react";
import { useLocation } from "react-router-dom";

const Background = () => {
  const { pathname } = useLocation();
  const [animateOnLoad] = useState(() => pathname === "/");

  return (
    <div
      className={`background-logo opacity-25 ${animateOnLoad ? "fade-in" : ""}`}
    ></div>
  );
};

export default Background;
