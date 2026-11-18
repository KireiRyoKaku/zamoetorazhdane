import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Button } from "./components/Button";
import { PageShell, RevealOnScroll } from "./components/PageShell";
import logoSmall from "./assets/pictures/PregurnataLogoPinkNoText.png";

const About = ({ onClose = () => {} }) => {
  const navigate = useNavigate();

  const handleClickEventProgram = () => {
    navigate("/events");
    if (onClose) onClose(); // Add safety check
  };

  return (
    <PageShell
      title={null}
      showBackButton={false}
      className="w-full bg-white text-left font-rocaTwoThin text-xl font-light"
    >
      <div className="relative mx-auto max-w-5xl">
        <div className="mb-12 p-5 md:mb-16 md:p-10">
          <RevealOnScroll
            as="h1"
            className="mb-10 text-center font-magnoliaScript text-5xl md:text-5xl lg:text-6xl"
          >
            Прегърната
          </RevealOnScroll>
          <RevealOnScroll as="p" className="-mb-10" delay={120}>
            е общност, създадена от и за майки. Място, в което на фокус е жената
            – приета, чута и подкрепена във всеки етап на своето майчинство.
          </RevealOnScroll>
        </div>

        <RevealOnScroll
          as="section"
          aria-label="Нашият подход"
          className="relative mb-4 overflow-hidden rounded-3xl bg-primary p-5 text-fourth md:mb-16 md:p-10"
          delay={180}
        >
          <img
            src={logoSmall}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 m-auto h-5/6 w-4/6 object-contain opacity-20 brightness-0 invert"
          />
          <div className="relative z-10 space-y-4 p-5 text-xl leading-relaxed">
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
        </RevealOnScroll>
        <RevealOnScroll
          as="p"
          className="p-5 md:mb-16 md:p-10"
          delay={240}
        >
          Нашата мисия е да създадем пространство, в което майки се събират и
          взаимодействат помежду си въз основа на{" "}
          <b>своите ценности и интереси в и извън родителството.</b>
        </RevealOnScroll>
        <RevealOnScroll
          as="p"
          className="mb-8 p-5 md:mb-16 md:p-10"
          delay={300}
        >
          Тук <b>всяка майка има право на подкрепа</b>, разбиране и позволение
          за собствените си емоции и нужди. Силно вярваме в това, че{" "}
          <b>когато тя е</b>{" "}
          <span className="font-magnoliaScript">Прегърната</span>, може с повече
          лекота и радост да бъде до своите деца и семейство.
        </RevealOnScroll>

        <RevealOnScroll as="div" className="-mb-8 flex justify-center" delay={360}>
          <Button variant="secondary" onClick={handleClickEventProgram}>
            ВКЛЮЧИ СЕ
          </Button>
        </RevealOnScroll>
      </div>
    </PageShell>
  );
};

About.propTypes = {
  onClose: PropTypes.func,
};

export default About;
