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
      className={`w-full bg-white px-4 pb-16 pt-8 text-left font-rocaTwoThin text-xl font-light transition-all duration-300 ease-in-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      <div className="relative mx-auto max-w-5xl">
        <div className="mb-12 p-5 md:mb-16 md:p-10">
          <h1 className="mb-10 text-center font-magnoliaScript text-5xl md:text-5xl lg:text-6xl">
            Прегърната
          </h1>
          <p
            ref={(el) => (elementsRef.current[0] = el)}
            className="para1 -mb-10 opacity-0 transition-opacity duration-1000 ease-in-out"
          >
            е общност, създадена от и за майки. Място, в което на фокус е жената
            – приета, чута и подкрепена във всеки етап на своето майчинство.
          </p>
        </div>

        <section
          aria-label="Нашият подход"
          className="mb-4 rounded-3xl bg-primary p-5 text-fourth md:mb-16 md:p-10"
        >
          <div className="space-y-4 text-xl leading-relaxed">
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
              Затова във всичко, което създаваме заедно, на преден план е жената
              с нейното индивидуално преживяване в майчинството.
            </p>
          </div>
        </section>
        <p
          ref={(el) => (elementsRef.current[2] = el)}
          className="para3 p-5 opacity-0 transition-opacity duration-1000 ease-in-out md:mb-16 md:p-10"
        >
          Нашата мисия е да създадем пространство, в което майки се събират и
          взаимодействат помежду си въз основа на{" "}
          <b>своите ценности и интереси в и извън родителството.</b>
        </p>
        <p
          ref={(el) => (elementsRef.current[3] = el)}
          className="para4 mb-8 p-5 opacity-0 transition-opacity duration-1000 ease-in-out md:mb-16 md:p-10"
        >
          Тук <b>всяка майка има право на подкрепа</b>, разбиране и позволение
          за собствените си емоции и нужди. Силно вярваме в това, че{" "}
          <b>когато тя е</b>{" "}
          <span className="font-magnoliaScript">Прегърната</span>, може с повече
          лекота и радост да бъде до своите деца и семейство.
        </p>

        <div
          ref={(el) => (elementsRef.current[4] = el)}
          className="-mb-8 flex justify-center opacity-0 transition-opacity duration-1000 ease-in-out"
        >
          <Button variant="secondary" onClick={handleClickEventProgram}>
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
