import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "./assets/pictures/logo-white-outline.png";
import SocialLinks from "./components/SocialLinks";

const Title = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade in animation after component mounts
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    });
  }, []);

  const handleClickAbout = () => {
    setIsVisible(false);
    setTimeout(() => {
      navigate("/about");
    }, 300);
  };

  return (
    <>
      <div
        className={`relative -mt-12 flex min-h-screen transform flex-col items-center justify-center transition-all duration-300 ease-in-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      >
        <div className="flex w-full flex-col items-center justify-center">
          <SocialLinks />
          <div className="relative mt-4 max-w-md rounded-xl bg-white/10 px-8 py-6 backdrop-blur-sm">
            <span className="absolute -top-9 left-4 font-playfairDisplaySc text-9xl text-white/20">
              ”
            </span>
            <p className="quote relative text-center font-yanoneKaffeesatz text-2.5xl font-thin italic text-slate-50">
              С раждането на моето дете
              <br />
              се раждам и аз, като майка.
            </p>
          </div>
          <header
            className="dropdown-menu mt-7 flex w-full cursor-pointer flex-col items-center transition-transform duration-500 hover:scale-90"
            onClick={handleClickAbout}
          >
            <div className="flex">
              <img
                src={logoImage}
                alt="За моето раждане лого"
                className="logo object-contain"
              />
            </div>
            <div>
              <h1 className="font-makLight font-bold text-slate-50 sm:text-3xl md:text-5xl lg:text-7xl">
                за моето раждане
              </h1>
            </div>
          </header>

          <h2 className="custom-h2-style mb-7 whitespace-nowrap font-playfairDisplaySc text-3xl md:text-3xl">
            общност за подкрепа между майки
          </h2>
        </div>
      </div>
    </>
  );
};

export default Title;
