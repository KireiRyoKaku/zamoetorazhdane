import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PageShell, RevealOnScroll } from "./components/PageShell";
import { Button } from "./components/Button";
import mentoringImage from "./assets/pictures/good/mentoring2.png";
import programLogo from "./assets/pictures/PregurnataLogoPinkNoText.png";
import { API_URL } from "../utils/apiConfig";

const currentDate = new Date();
const programYear =
  currentDate.getFullYear() + (currentDate.getMonth() >= 9 ? 1 : 0);

const openingNeeds = [
  "си постоянно уморена",
  "живееш в режим „оцеляване“",
  "нямаш време за себе си",
  "имаш нужда от по-ясна структура и някой, който да държи пространство само за теб",
  `знаеш, че през ${programYear} искаш промяна, но не знаеш откъде да започнеш`,
  "имаш нужда някой да те води",
];

const programNeeds = [
  "фокусирана подкрепа",
  "пространство само за себе си",
  "нежен и личен подход",
  "дълбока, но практична работа",
  "яснота и посока",
];

const programTopics = [
  "емоционално изтощение",
  "ментален товар",
  "партньорски взаимоотношения",
  "сън и ежедневие",
  "идентичността на жената отвъд майчинството",
  "баланс между грижата за другите и за себе си",
];

const sessions = [
  {
    title: "Карта на нуждите",
    description:
      "Къде съм в момента? От какво имам нужда? Как искам да се чувствам в края на 6-те седмици?",
  },
  {
    title: "Емоционален капацитет и самоусещане",
    description:
      "Ментално натоварване, вътрешен критик, самосъстрадание и презареждане.",
  },
  {
    title: "Отношение със себе си и ресурсно ежедневие",
    description:
      "Микроресурси, проблясъци, връзка със сетивата. Баланс между нужди и възможности.",
  },
  {
    title: "Отношения с партньора",
    description:
      "Комуникация и разпределяне на отговорности. Как говорим с него, граници, очаквания.",
  },
  {
    title: "Отношения с детето",
    description: "Сън, ритъм и структура на деня. Емоционални изблици и гняв.",
  },
  {
    title: "Завършване",
    description:
      "Какво се промени? Какви са следващите стъпки? Личен план и поддържане на стабилност.",
  },
];

const isForYou = [
  "имаш нужда от свързване със себе си",
  "искаш промяна, но се чувстваш блокирана",
  "имаш нужда някой да те води и да държи пространство само за теб",
  "имаш нужда от индивидуално внимание, за да навлезеш в дълбочина и да се довериш",
  "си част от общността ни или тепърва ни откриваш",
];

const journey = [
  {
    from: ["хронична умора", "режим „оцеляване“"],
    to: "спокойствие и глътка въздух",
  },
  {
    from: ["липса на структура и време за себе си"],
    to: "по-малко вина и повече ресурс в ежедневието",
  },
  {
    from: ["постоянно напрежение"],
    to: "връзка със себе си",
  },
  {
    from: ["неясни граници"],
    to: "яснота и опора",
  },
  {
    from: ["дистанция с партньора и усещане за самота"],
    to: "по-спокойно и хармонично майчинство",
  },
];

const ScrollChevrons = () => (
  <svg
    className="h-8 w-8 animate-pulse motion-reduce:animate-none"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m5 7 7 7 7-7M5 13l7 7 7-7" />
  </svg>
);

const Journey = () => {
  const stageRef = useRef(null);
  const panelRef = useRef(null);
  const [interactive, setInteractive] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(
      "(max-width: 767px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)",
    );
    const update = () => {
      if (!stageRef.current || !panelRef.current) return;
      const canAnimate =
        media.matches &&
        panelRef.current.offsetHeight <= window.innerHeight - 160;
      setInteractive(canAnimate);
      if (!canAnimate) {
        setIsPinned(false);
        return;
      }

      const rect = stageRef.current.getBoundingClientRect();
      setIsPinned(
        rect.top <= 97 && rect.bottom > 96 + panelRef.current.offsetHeight,
      );
      const scrollDistance = rect.height - panelRef.current.offsetHeight - 96;
      const progress = Math.max(
        0,
        Math.min(1, (96 - rect.top) / Math.max(1, scrollDistance)),
      );
      setRevealedCount(
        Math.min(journey.length, Math.floor(progress * (journey.length + 1))),
      );
    };

    const observer =
      "ResizeObserver" in window ? new ResizeObserver(update) : null;
    if (observer && panelRef.current) observer.observe(panelRef.current);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    media.addEventListener("change", update);
    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      media.removeEventListener("change", update);
    };
  }, [interactive]);

  return (
    <div ref={stageRef} className={interactive ? "min-h-[400svh]" : ""}>
      <div
        ref={panelRef}
        className={interactive ? "sticky top-24" : "relative"}
      >
        <RevealOnScroll
          as="h2"
          className="mb-4 text-center font-rocaTwoBold text-2xl font-bold sm:text-3xl"
        >
          Тук сме за теб
        </RevealOnScroll>
        <RevealOnScroll
          as="p"
          className="mx-auto mb-6 max-w-4xl text-center font-rocaTwoThin text-lg leading-6"
          delay={120}
        >
          За да извървиш с наша помощ своя път
        </RevealOnScroll>
        <div className="rounded-[32px] bg-third p-3 shadow-lg md:p-6">
          <div className="mb-3 grid grid-cols-2 font-rocaTwoBold text-2xl font-bold">
            <h3 className="px-3 text-left">От</h3>
            <h3 className="px-3 text-right">Към</h3>
          </div>
          <div className="space-y-2">
            {journey.map(({ from, to }, index) => (
              <div
                key={to}
                className="grid grid-cols-2 overflow-hidden rounded-2xl bg-white/90"
              >
                <ul className="flex flex-col justify-center gap-2 p-3 text-left font-rocaTwoThin text-base leading-5 md:p-4 md:text-lg md:leading-6">
                  {from.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p
                  className={`flex origin-left items-center justify-end bg-fourth p-3 pl-6 text-right font-rocaTwoThin text-base leading-5 text-white transition-[opacity,transform] duration-500 motion-reduce:transition-none md:p-4 md:pl-6 md:text-lg md:leading-6 ${
                    interactive && index >= revealedCount
                      ? "scale-x-0 opacity-0"
                      : "scale-x-100 opacity-100"
                  }`}
                  style={{
                    clipPath: "polygon(16px 0, 100% 0, 100% 100%, 0 100%)",
                  }}
                >
                  {to}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute top-full mt-2 flex w-full items-center justify-center gap-2 font-rocaTwoRegular text-sm text-[#403d5c] transition-opacity motion-reduce:transition-none ${
            interactive && isPinned && revealedCount < journey.length
              ? "opacity-100"
              : "opacity-0"
          }`}
        >
          <ScrollChevrons />
        </div>
      </div>
    </div>
  );
};

const Mentoring = () => {
  const [activeProgramCard, setActiveProgramCard] = useState(0);
  const defaultContactMessage =
    "Здравейте, имам желание да участвам в менторската програма. Бих искала да се свържа с Вас за предварителна консултация на следната дата:";
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: defaultContactMessage,
  });
  const [contactStatus, setContactStatus] = useState({
    type: "idle",
    message: "",
  });

  useEffect(() => {
    if (!isContactModalOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsContactModalOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isContactModalOpen]);

  const openContactModal = () => {
    setContactStatus({ type: "idle", message: "" });
    setIsContactModalOpen(true);
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();

    if (!contactForm.name.trim() || !contactForm.email.trim()) {
      setContactStatus({
        type: "error",
        message: "Моля, попълни името и имейла си.",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email.trim())) {
      setContactStatus({
        type: "error",
        message: "Моля, въведи валиден имейл адрес.",
      });
      return;
    }

    setContactStatus({ type: "submitting", message: "" });

    try {
      const response = await fetch(`${API_URL}/mentoring-contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Съобщението не беше изпратено.");
      }

      setContactForm({
        name: "",
        email: "",
        message: defaultContactMessage,
      });
      setContactStatus({
        type: "success",
        message: "Благодарим! Ще се свържем с теб възможно най-скоро.",
      });
    } catch (error) {
      console.error("Mentoring contact form error:", error);
      setContactStatus({
        type: "error",
        message:
          error.message || "Възникна проблем. Моля, опитай отново след малко.",
      });
    }
  };

  return (
    <>
      <PageShell
        title="Менторска програма"
        intro="Индивидуална подкрепа за теб и твоя път в майчинството."
        introClassName="font-rocaTwoThin text-lg leading-6"
        introMarginClassName="mb-0"
        revealHeader
        showBackButton={false}
      >
        <RevealOnScroll>
          <img
            src={mentoringImage}
            alt="Менторска програма"
            className="relative z-0 mt-2 aspect-[2/1] w-full translate-y-4 object-cover object-top"
            style={{
              maskImage:
                "linear-gradient(to bottom, #000 85%, transparent 100%), linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
              maskComposite: "intersect",
              WebkitMaskImage:
                "linear-gradient(to bottom, #000 85%, transparent 100%), linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
              WebkitMaskComposite: "source-in",
            }}
          />
        </RevealOnScroll>

        <RevealOnScroll
          as="section"
          className="mb-16 rounded-[32px] bg-fourth px-6 py-5 text-center text-white shadow-xl md:mb-16 md:px-14 md:py-8"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none -mb-14 block select-none font-rocaTwoBold text-9xl leading-none text-secondary sm:-mb-20 sm:text-[11rem]"
          >
            “
          </span>
          <div className="mx-auto w-full max-w-3xl text-center">
            <RevealOnScroll
              as="h2"
              className="mb-6 text-center font-rocaTwoBold text-2xl font-bold sm:text-3xl"
              delay={240}
            >
              Не е нужно да вървиш по този път сама
            </RevealOnScroll>
            <RevealOnScroll
              as="p"
              className="mx-auto max-w-3xl text-center font-rocaTwoThin text-lg leading-7"
              delay={120}
            >
              Можеш да го извървиш с някого, който вече го е вървял не само за
              себе си, но и за други майки и има опита и перспективата да те
              придружи по този път.
            </RevealOnScroll>
          </div>
          <span
            aria-hidden="true"
            className="pointer-events-none -mt-14 block rotate-180 select-none font-rocaTwoBold text-9xl leading-none text-secondary sm:-mt-20 sm:text-[11rem]"
          >
            “
          </span>
        </RevealOnScroll>

        <RevealOnScroll
          as="section"
          className="mb-16 rounded-[32px] bg-third/80 p-5 md:p-10"
        >
          <RevealOnScroll
            as="h2"
            className="mb-6 text-center font-rocaTwoBold text-2xl font-bold sm:text-3xl"
          >
            Ако си майка и усещаш, че…
          </RevealOnScroll>
          <ul className="mx-auto grid max-w-4xl grid-cols-1 gap-3">
            {openingNeeds.map((need, index) => (
              <RevealOnScroll
                as="li"
                key={need}
                delay={index * 80}
                className="flex items-start gap-3 rounded-2xl border border-white/80 bg-white/80 p-4 font-rocaTwoThin text-lg leading-6 shadow-sm"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-secondary"
                />
                {need}
              </RevealOnScroll>
            ))}
          </ul>
          <div className="mt-7 text-center">
            <Button
              type="button"
              onClick={openContactModal}
              className="text-7xl md:text-7xl"
            >
              ТОВА Е ЗА ТЕБ!
            </Button>
          </div>
        </RevealOnScroll>

        <RevealOnScroll
          as="section"
          className="mb-16 rounded-[32px] bg-primary p-5 text-[#403d5c] shadow-sm md:p-10"
        >
          <RevealOnScroll
            as="h2"
            className="mb-4 text-center font-rocaTwoBold text-2xl font-bold sm:text-3xl"
          >
            Индивидуална работа с една от нас
          </RevealOnScroll>
          <RevealOnScroll
            as="p"
            className="mx-auto max-w-4xl font-rocaTwoThin text-lg leading-6"
            delay={120}
          >
            Анелия или Катя – създатели на „
            <span className="font-magnoliaScript">Прегърната</span>“ и
            специалисти с опит в подкрепата на майки в групови и индивидуални
            формати.
          </RevealOnScroll>
          <RevealOnScroll
            as="p"
            className="mx-auto mt-4 max-w-4xl font-rocaTwoThin text-lg leading-6"
            delay={240}
          >
            Създадохме индивидуална менторска програма за майки, които имат
            нужда от:
          </RevealOnScroll>
          <RevealOnScroll
            as="h3"
            className="mx-auto mt-6 max-w-4xl font-rocaTwoBold text-xl font-bold"
            delay={300}
          >
            Какво ще получиш
          </RevealOnScroll>
          <ul className="mx-auto mt-4 max-w-4xl list-disc space-y-3 pl-6 font-rocaTwoThin text-lg leading-6 marker:text-secondary">
            {programNeeds.map((need, index) => (
              <RevealOnScroll as="li" key={need} delay={index * 100}>
                {need}
              </RevealOnScroll>
            ))}
          </ul>
        </RevealOnScroll>

        <RevealOnScroll as="section" className="mb-16">
          <RevealOnScroll
            as="h2"
            className="mb-2 text-center font-rocaTwoBold text-2xl font-bold text-[#403d5c] sm:text-3xl"
          >
            Менторска програма
          </RevealOnScroll>
          <RevealOnScroll
            as="h3"
            className="mx-auto mb-6 max-w-2xl text-center font-rocaTwoRegular text-lg leading-7 text-[#403d5c]"
          >
            6 индивидуални срещи
            <br /> в рамките на 6 до 8 седмици
          </RevealOnScroll>
          <div className="mx-auto max-w-4xl overflow-hidden rounded-[32px] border border-t-8 border-fourth/10 border-t-secondary bg-white p-5 shadow-lg md:p-10">
            <RevealOnScroll
              as="p"
              className="mb-6 font-rocaTwoThin text-lg leading-6"
              delay={120}
            >
              Цялостна програма, разработена и фокусирана върху аспекти като:
            </RevealOnScroll>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {programTopics.map((topic, index) => (
                <RevealOnScroll
                  as="li"
                  key={topic}
                  delay={index * 80}
                  className="rounded-2xl bg-primary/70 px-4 py-3 text-center font-rocaTwoThin text-lg leading-6"
                >
                  {topic}
                </RevealOnScroll>
              ))}
            </ul>
            <RevealOnScroll
              as="p"
              className="mb-2 mt-6 font-rocaTwoThin text-lg leading-6"
              delay={120}
            >
              Подбор на темите според твоите индивидуални нужди и цели за тази
              програма.
            </RevealOnScroll>
          </div>
        </RevealOnScroll>

        <RevealOnScroll
          as="section"
          className="mb-16 md:relative md:left-1/2 md:w-[calc(100vw-2rem)] md:max-w-[96rem] md:-translate-x-1/2"
        >
          <div className="grid motion-safe:-mb-[max(0px,calc(100svh-max(11rem,(100svh-25rem)/2-6rem)-31.25rem))] md:mb-0">
            <div className="relative z-20 motion-safe:pointer-events-none motion-safe:sticky motion-safe:top-24 motion-safe:col-start-1 motion-safe:row-start-1 motion-safe:h-[calc(100svh-6rem)] motion-safe:self-start md:static md:col-auto md:row-auto md:h-auto">
              <h2 className="mb-6 text-center font-rocaTwoBold text-2xl font-bold motion-safe:absolute motion-safe:inset-x-0 motion-safe:top-0 sm:text-3xl md:static">
                Програма
              </h2>
            </div>
            <ol
              id="mentoring-program-cards"
              aria-label="Срещи от програмата"
              className="grid gap-6 motion-safe:col-start-1 motion-safe:row-start-1 motion-safe:gap-0 md:col-auto md:row-auto md:flex md:justify-center md:gap-0 md:px-5 md:py-8"
              style={{
                // Distribute the remaining width between the overlapping cards.
                "--card-overlap": `min(-4rem, calc(${100 / (sessions.length - 1)}% - ${16 + 16 / (sessions.length - 1)}rem))`,
              }}
            >
              {sessions.map(({ title, description }, index) => (
                <li
                  key={title}
                  className="z-[var(--stack-order)] motion-safe:sticky motion-safe:top-0 motion-safe:flex motion-safe:min-h-[100svh] motion-safe:items-start motion-safe:pt-[calc(max(11rem,(100svh-25rem)/2-6rem)+var(--stack-offset)/2)] md:static md:z-[var(--desktop-stack-order)] md:block md:min-h-0 md:w-64 md:shrink-0 md:pt-0 md:[&:not(:first-child)]:ml-[var(--card-overlap)]"
                  style={{
                    "--stack-offset": `${index * 24}px`,
                    "--stack-order": index + 1,
                    "--desktop-stack-order":
                      index === activeProgramCard
                        ? sessions.length + 1
                        : sessions.length - Math.abs(index - activeProgramCard),
                  }}
                >
                  <div
                    className={`relative mx-auto w-full max-w-[16rem] md:max-w-none md:transition-transform md:duration-300 motion-reduce:transition-none ${
                      index === activeProgramCard
                        ? "md:scale-110"
                        : "md:hover:-translate-y-3 md:hover:rotate-3"
                    }`}
                  >
                    <RevealOnScroll
                      className={`relative flex min-h-[25rem] w-full items-center justify-center overflow-hidden rounded-[24px] border border-fourth/10 px-8 py-6 shadow-md before:pointer-events-none before:absolute before:inset-3 before:rounded-[16px] before:border before:border-fourth/25 before:content-[''] ${
                        index % 2 === 0 ? "bg-white" : "bg-third"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`absolute right-4 top-2 font-rocaTwoBold text-7xl leading-none text-secondary/60 ${
                          index !== activeProgramCard ? "md:hidden" : ""
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div
                        className={`relative w-full text-center ${
                          index !== activeProgramCard ? "md:hidden" : ""
                        }`}
                      >
                        <p className="mb-2 font-rocaTwoBold text-sm uppercase tracking-widest text-[#403d5c]/70">
                          Среща {index + 1}
                        </p>
                        <h3 className="mb-3 font-rocaTwoBold text-xl font-bold">
                          {title}
                        </h3>
                        <p className="font-rocaTwoThin text-lg leading-6">
                          {description}
                        </p>
                      </div>
                      <div
                        aria-hidden="true"
                        className={`hidden flex-col items-center gap-6 text-center ${
                          index !== activeProgramCard ? "md:flex" : ""
                        }`}
                      >
                        <img
                          src={programLogo}
                          alt=""
                          className="h-48 w-36 object-contain"
                        />
                        <p className="font-rocaTwoBold text-xl font-bold text-fourth">
                          Среща {index + 1}
                        </p>
                      </div>
                    </RevealOnScroll>
                    <button
                      type="button"
                      aria-label={`Покажи среща ${index + 1}: ${title}`}
                      aria-pressed={activeProgramCard === index}
                      onClick={() => setActiveProgramCard(index)}
                      className="absolute inset-0 hidden w-full rounded-[24px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fourth md:block"
                    />
                    {index === 0 && (
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 top-full mt-20 hidden justify-center text-[#403d5c] motion-safe:max-md:flex [&>svg]:h-12 [&>svg]:w-12"
                      >
                        <ScrollChevrons />
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </RevealOnScroll>

        <RevealOnScroll as="section" className="mb-16">
          <RevealOnScroll
            as="h2"
            className="mb-6 text-center font-rocaTwoBold text-2xl font-bold sm:text-3xl"
          >
            Тази програма е за теб, ако…
          </RevealOnScroll>
          <div className="mx-auto max-w-4xl rounded-[32px] bg-secondary/75 p-5 md:p-10">
            <ul className="grid gap-3 md:grid-cols-2">
              {isForYou.map((reason, index) => (
                <RevealOnScroll
                  as="li"
                  key={reason}
                  delay={index * 80}
                  className="rounded-2xl bg-white/90 p-4 text-center font-rocaTwoThin text-lg leading-6 shadow-sm"
                >
                  {reason}
                </RevealOnScroll>
              ))}
            </ul>
          </div>
        </RevealOnScroll>

        <RevealOnScroll as="section" className="mb-16">
          <Journey />
        </RevealOnScroll>

        <RevealOnScroll
          as="section"
          className="rounded-[32px] bg-fourth p-5 text-center text-white shadow-xl md:p-10"
        >
          <RevealOnScroll
            as="p"
            className="mx-auto max-w-3xl font-rocaTwoThin text-lg leading-6"
          >
            А в края не си нова майка. Но си по-близо до себе си. По-спокойна в
            решенията си.
          </RevealOnScroll>
          <RevealOnScroll
            as="p"
            className="mx-auto mt-4 max-w-3xl font-rocaTwoThin text-lg leading-6"
            delay={120}
          >
            По-уверена в това, което усещаш.
          </RevealOnScroll>
          <RevealOnScroll
            as="p"
            className="mx-auto mt-4 max-w-3xl font-rocaTwoThin text-lg leading-6"
            delay={240}
          >
            И ще знаеш как да подкрепиш себе си и след програмата.
          </RevealOnScroll>
          <RevealOnScroll
            as="h3"
            className="mx-auto mt-6 max-w-3xl font-rocaTwoBold text-xl font-bold"
            delay={300}
          >
            Готова ли си за следващата стъпка?
          </RevealOnScroll>
          <RevealOnScroll
            as="p"
            className="mx-auto mb-6 mt-4 max-w-3xl font-rocaTwoThin text-lg leading-6"
            delay={360}
          >
            Пиши ни, за да се запишеш за безплатен предварителен разговор.
          </RevealOnScroll>
          <RevealOnScroll delay={360}>
            <Button type="button" onClick={openContactModal}>
              СВЪРЖИ СЕ
            </Button>
          </RevealOnScroll>
        </RevealOnScroll>
      </PageShell>

      {isContactModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[10001] flex items-center justify-center bg-[#403d5c]/70 p-0 sm:p-4"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setIsContactModalOpen(false);
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="mentoring-contact-title"
              className="max-h-[100dvh] w-full max-w-2xl overflow-y-auto rounded-[24px] bg-white p-6 text-[#403d5c] shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:rounded-[32px] md:p-8"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="mentoring-contact-title"
                    className="text-center font-rocaTwoBold text-2xl font-bold sm:text-xl"
                  >
                    Заявка за участие в менторската програма
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  aria-label="Затвори формата"
                  className="rounded-full p-2 text-2xl leading-none hover:bg-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fourth/60"
                >
                  ×
                </button>
              </div>

              {contactStatus.type === "success" ? (
                <div className="rounded-2xl bg-primary p-5 text-center font-rocaTwoThin text-lg leading-6">
                  {contactStatus.message}
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <label className="block font-rocaTwoRegular text-base">
                    Име
                    <input
                      required
                      type="text"
                      placeholder="Мария Иванова"
                      value={contactForm.name}
                      onChange={(event) =>
                        setContactForm({
                          ...contactForm,
                          name: event.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-fourth/30 px-4 py-3 font-rocaTwoThin focus:border-fourth focus:outline-none focus:ring-2 focus:ring-fourth/40"
                    />
                  </label>
                  <label className="block font-rocaTwoRegular text-base">
                    Имейл
                    <input
                      required
                      type="email"
                      placeholder="maria@example.com"
                      value={contactForm.email}
                      onChange={(event) =>
                        setContactForm({
                          ...contactForm,
                          email: event.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-fourth/30 px-4 py-3 font-rocaTwoThin focus:border-fourth focus:outline-none focus:ring-2 focus:ring-fourth/40"
                    />
                  </label>
                  <label className="block font-rocaTwoRegular text-base">
                    Съобщение
                    <textarea
                      required
                      rows="7"
                      value={contactForm.message}
                      onChange={(event) =>
                        setContactForm({
                          ...contactForm,
                          message: event.target.value,
                        })
                      }
                      className="mt-1 min-h-48 w-full resize-y rounded-xl border border-fourth/30 px-4 py-3 font-rocaTwoThin focus:border-fourth focus:outline-none focus:ring-2 focus:ring-fourth/40"
                    />
                  </label>
                  {contactStatus.type === "error" && (
                    <p
                      role="alert"
                      className="font-rocaTwoRegular text-red-700"
                    >
                      {contactStatus.message}
                    </p>
                  )}
                  <Button
                    type="submit"
                    disabled={contactStatus.type === "submitting"}
                    className="w-full"
                  >
                    {contactStatus.type === "submitting"
                      ? "Изпращане..."
                      : "Изпрати съобщение"}
                  </Button>
                </form>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default Mentoring;
