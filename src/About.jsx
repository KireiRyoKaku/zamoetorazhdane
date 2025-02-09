import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import PropTypes from "prop-types";

const About = ({ onClose }) => {
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
        className={`fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center text-right transition-all duration-300 ${
          isBlurred ? "opacity-0" : "opacity-100"
        }`}
      >
        <div
          className={`max-w-full overflow-y-auto rounded bg-slate-50 p-10 text-left font-montserrat transition-all duration-300 ${
            isBlurred ? "scale-95 blur-md" : "scale-100 blur-0"
          }`}
        >
          {" "}
          <h3>
            <b>Кои сме ние?</b> <br />
            <br />
            &quot;За моето раждане&quot; е инициатива от и за майки в Пловдив,
            водена от
            <b>
              {" "}
              специалисти по кърмене, детски сън, детско развитие, физическо и
              психично здраве
            </b>{" "}
            и благополучие в периода на ранното майчинство.
            <br />
            <br />
            Нашата мисия е да създадем{" "}
            <b>пространство, където майки се събират</b>, споделят своите
            опитности и откриват подкрепата и знанието, от които имат нужда през
            своето майчинство.
            <br />
            <br />
            <b>Нашият фокус е върху майката</b>, с нейните тревоги и
            предизвикателства. И върху подкрепата, от която се нуждае тя за едно
            спокойно и хармонично начало с бебе.
            <br />
            <br />
            <b>Нашият фокус си ти.</b>
            <br />
            <br />
            Включи се.
          </h3>
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

About.propTypes = {
  onClose: PropTypes.func.isRequired,
};
export default About;
