import { useEffect } from "react";

const Background = () => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      const element = document.querySelector(".background-logo");

      if (document.visibilityState === "visible") {
        element.classList.add("fade-in");
      } else {
        element.classList.remove("fade-in");
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return <div className="background-logo opacity-25"></div>;
};

export default Background;
