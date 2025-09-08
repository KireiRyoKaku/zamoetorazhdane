import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import logoImage from "./assets/pictures/PregurnataLogoPinkNoText.png"; // Updated to use pink logo without text

const About = ({ onClose = () => {} }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const contentRef = useRef(null);
  const elementsRef = useRef([]);

  const handleClickEventProgram = () => {
    navigate("/program");
    if (onClose) onClose(); // Add safety check
  };

  const handleClickEventTeam = () => {
    navigate("/team");
    if (onClose) onClose(); // Add safety check
  };

  useEffect(() => {
    // Trigger fade in animation after component mounts
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100");
            entry.target.classList.remove("opacity-0");
          } else {
            entry.target.classList.add("opacity-0");
            entry.target.classList.remove("opacity-100");
          }
        });
      },
      { threshold: 0.1 },
    );

    elementsRef.current.forEach((element) => {
      if (element) observer.observe(element);
    });

    const handleScroll = () => {
      if (contentRef.current) {
        setScrollTop(contentRef.current.scrollTop);
      }
    };

    if (contentRef.current) {
      contentRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      elementsRef.current.forEach((element) => {
        if (element) observer.unobserve(element);
      });
      if (contentRef.current) {
        contentRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const showScrollDownMessage = scrollTop === 0;

  return (
    <div className="flex flex-col items-center">
      <div className="fixed inset-0 z-50 flex items-center justify-center px-5 pb-20 md:px-10 md:pb-0 lg:px-20 xl:px-32 2xl:px-48">
        {/* Updated spacing with negative margin instead of padding */}
        <div
          className={`max-h-[85vh] w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl transform overflow-y-auto rounded-lg bg-slate-50 p-8 md:p-12 lg:p-16 xl:p-20 text-left font-rocaTwoThin text-xl font-light transition-all duration-300 ease-in-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          ref={contentRef}
        >
          <div className="-mt-5 mb-1 flex justify-center">
            <img
              src={logoImage}
              alt="Прегърната лого"
              className="h-56 w-auto object-contain md:h-28 lg:h-32 xl:h-36 2xl:h-40"
            />
          </div>
          <div className="relative">
            <h3>
              <div className="mb-5 flex justify-center">
                <span className="font-magnoliaScript text-4xl md:text-5xl lg:text-6xl">
                  Прегърната
                </span>
              </div>
              <p
                ref={(el) => (elementsRef.current[0] = el)}
                className="para1 opacity-0 transition-opacity duration-1000 ease-in-out"
              >
                е общност, създадена от и за майки. Място, в което на фокус е
                жената – приета, чута и подкрепена във всеки етап на своето
                майчинство.
              </p>

              <br />
              <p
                ref={(el) => (elementsRef.current[2] = el)}
                className="para2 opacity-0 transition-opacity duration-1000 ease-in-out"
              >
                Нашата мисия е да създадем пространство, в което майки се
                събират и взаимодействат помежду си въз основа на{" "}
                <b>своите ценности и интереси в и извън родителството.</b>
              </p>
              <br />
              <p
                ref={(el) => (elementsRef.current[3] = el)}
                className="para3 opacity-0 transition-opacity duration-1000 ease-in-out"
              >
                Тук <b>всяка майка има право на подкрепа</b>, разбиране и
                позволение за собствените си емоции и нужди. Силно вярваме в
                това, че <b>когато тя е</b>{" "}
                <span className="font-magnoliaScript">прегърната</span>, може
                с повече лекота и радост да бъде до своите деца и семейство.
                <br />
              </p>
            </h3>
            <div
              ref={(el) => (elementsRef.current[1] = el)}
              className="mt-6 flex justify-center opacity-0 transition-opacity duration-1000 ease-in-out"
            >
              <button
                className="rounded-3xl bg-moetoRazhdaneYellow px-6 py-2 font-rocaTwoBold text-2xl font-black text-black transition-all duration-500 ease-in-out hover:bg-transparent hover:text-black/30"
                onClick={handleClickEventTeam}
              >
                ЗАПОЗНАЙ СЕ С ЕКИПА
              </button>
            </div>
            <div
              ref={(el) => (elementsRef.current[4] = el)}
              className="mt-4 flex justify-center opacity-0 transition-opacity duration-1000 ease-in-out"
            >
              <button
                className="rounded-3xl bg-moetoRazhdaneYellow px-6 py-2 font-rocaTwoBold text-2xl font-black text-black transition-all duration-500 ease-in-out hover:bg-transparent hover:text-black/30"
                onClick={handleClickEventProgram}
              >
                ВКЛЮЧИ СЕ
              </button>
            </div>
          </div>

          {showScrollDownMessage && (
            <div className="absolute bottom-0 left-0 h-16 w-full bg-gradient-to-t from-slate-50 to-transparent p-8 text-center text-gray-500 transition-opacity duration-500 ease-in-out"></div>
          )}
        </div>
      </div>
    </div>
  );
};

About.propTypes = {
  onClose: PropTypes.func,
};

export default About;
