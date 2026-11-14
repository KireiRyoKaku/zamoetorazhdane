import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Button } from "./components/Button";

const About = ({ onClose = () => {} }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const elementsRef = useRef([]);

  const handleClickEventProgram = () => {
    navigate("/events");
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

    return () => {
      elementsRef.current.forEach((element) => {
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  return (
    <main
      className={`w-full bg-white px-4 pb-12 pt-16 text-left font-rocaTwoThin text-xl font-light transition-all duration-300 ease-in-out md:px-10 md:pb-16 md:pt-20 lg:px-20 xl:px-32 2xl:px-48 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      {/* <div className="-mt-5 mb-1 flex justify-center">
            <img
              src={logoImage}
              alt="Прегърната лого"
              className="h-56 w-auto object-contain md:h-28 lg:h-32 xl:h-36 2xl:h-40"
            />
          </div> */}
      <div className="relative">
        <h3>
          <div className="flex justify-center">
            <span className="font-magnoliaScript text-4xl md:text-5xl lg:text-6xl">
              Прегърната
            </span>
          </div>
          <p
            ref={(el) => (elementsRef.current[0] = el)}
            className="para1 mb-6 opacity-0 transition-opacity duration-1000 ease-in-out"
          >
            е общност, създадена от и за майки. Място, в което на фокус е жената
            – приета, чута и подкрепена във всеки етап на своето майчинство.
          </p>

          <section
            aria-label="Нашият подход"
            className="rounded-3xl bg-primary p-6 text-fourth md:p-8"
          >
            <div className="space-y-4 text-base leading-relaxed md:text-lg">
              <p>
                Почти всички услуги за родители са насочени към обгрижване на
                бебето.
              </p>
              <p className="font-bold">При нас фокусът е върху майката.</p>
              <p>
                Защото вярваме, че именно тя има най-голяма нужда да бъде
                прегърната в уязвимите периоди от майчинството.
              </p>
              <p>
                Затова във всичко, което създаваме заедно, на преден план е
                жената с нейното индивидуално преживяване в майчинството.
              </p>
            </div>
          </section>
          <br />
          <p
            ref={(el) => (elementsRef.current[2] = el)}
            className="para3 opacity-0 transition-opacity duration-1000 ease-in-out"
          >
            Нашата мисия е да създадем пространство, в което майки се събират и
            взаимодействат помежду си въз основа на{" "}
            <b>своите ценности и интереси в и извън родителството.</b>
          </p>
          <br />
          <p
            ref={(el) => (elementsRef.current[3] = el)}
            className="para4 opacity-0 transition-opacity duration-1000 ease-in-out"
          >
            Тук <b>всяка майка има право на подкрепа</b>, разбиране и позволение
            за собствените си емоции и нужди. Силно вярваме в това, че{" "}
            <b>когато тя е</b>{" "}
            <span className="font-magnoliaScript">Прегърната</span>, може с
            повече лекота и радост да бъде до своите деца и семейство.
            <br />
          </p>
        </h3>
        {/* <div
              ref={(el) => (elementsRef.current[1] = el)}
              className="mt-6 flex justify-center opacity-0 transition-opacity duration-1000 ease-in-out"
            >
              <button
                className="rounded-3xl bg-third px-6 py-2 font-rocaTwoBold text-2xl font-black text-fourth transition-all duration-500 ease-in-out hover:bg-transparent hover:text-fourth/30"
                onClick={handleClickEventTeam}
              >
                ЗАПОЗНАЙ СЕ С ЕКИПА
              </button>
            </div> */}
        <div
          ref={(el) => (elementsRef.current[4] = el)}
          className="mt-10 flex justify-center opacity-0 transition-opacity duration-1000 ease-in-out"
        >
          <Button
            variant="secondary"
            onClick={handleClickEventProgram}
          >
            ВКЛЮЧИ СЕ
          </Button>
        </div>
      </div>
    </main>
  );
};

About.propTypes = {
  onClose: PropTypes.func,
};

export default About;
