import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import logoImage from "./assets/pictures/logo-green-outline.png";

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
      <div className="fixed z-50 mt-7 flex items-center justify-center px-5 md:inset-0 md:-mt-14 md:px-10">
        {/* Updated spacing with negative margin instead of padding */}
        <div
          className={`h-[calc(100dvh-125px)] w-full max-w-3xl transform overflow-y-auto rounded-lg bg-slate-50 p-8 text-left font-yanoneKaffeesatz text-xl font-light transition-all duration-300 ease-in-out md:h-[calc(100dvh-150px)] ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          ref={contentRef}
        >
          <div className="mb-8 flex justify-center">
            <img
              src={logoImage}
              alt="За моето раждане лого"
              className="h-24 w-auto object-contain md:h-28 lg:h-32 xl:h-36 2xl:h-40"
            />
          </div>
          <div className="relative">
            <h3>
              <div className="mb-1 flex justify-center">
                <span className="font-makLight text-2xl md:text-3xl lg:text-6xl">
                  &quot;за моето раждане&quot;
                </span>
              </div>
              <p
                ref={(el) => (elementsRef.current[0] = el)}
                className="para1 opacity-0 transition-opacity duration-1000 ease-in-out"
              >
                е инициатива от и за майки в Пловдив и София, водена от
                <b>
                  {" "}
                  специалисти по кърмене, детски сън, детско развитие, физическо
                  и психично здраве
                </b>{" "}
                и благополучие в периода на ранното майчинство.
              </p>
              <div
                ref={(el) => (elementsRef.current[1] = el)}
                className="mt-8 flex justify-center opacity-0 transition-opacity duration-1000 ease-in-out"
              >
                <button
                  className="rounded-3xl bg-moetoRazhdaneYellow px-6 py-2 font-playfairDisplaySc text-2xl font-black text-black transition-all duration-500 ease-in-out hover:bg-transparent hover:text-black/30"
                  onClick={handleClickEventTeam}
                >
                  Запознай се с екипа
                </button>
              </div>

              <br />
              <p
                ref={(el) => (elementsRef.current[2] = el)}
                className="para2 opacity-0 transition-opacity duration-1000 ease-in-out"
              >
                Нашата мисия е да създадем{" "}
                <b>пространство, където майки се събират</b>, споделят своите
                опитности и откриват подкрепата и знанието, от които имат нужда
                през своето майчинство.
              </p>
              <br />
              <p
                ref={(el) => (elementsRef.current[3] = el)}
                className="para3 opacity-0 transition-opacity duration-1000 ease-in-out"
              >
                <b>Нашият фокус е върху майката</b>, с нейните тревоги и
                предизвикателства. И върху подкрепата, от която се нуждае тя за
                едно спокойно и хармонично начало с бебе.
                <br />
                <br />
                <b>Нашият фокус си ти. </b>
              </p>
            </h3>
            <div
              ref={(el) => (elementsRef.current[4] = el)}
              className="mt-8 flex justify-center opacity-0 transition-opacity duration-1000 ease-in-out"
            >
              <button
                className="rounded-3xl bg-moetoRazhdaneYellow px-6 py-2 font-playfairDisplaySc text-2xl font-black text-black transition-all duration-500 ease-in-out hover:bg-transparent hover:text-black/30"
                onClick={handleClickEventProgram}
              >
                Включи се
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
