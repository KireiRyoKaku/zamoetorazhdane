import React, { useEffect, useRef, useState } from "react";
import { CtaLink, PageShell, RevealOnScroll } from "./components/PageShell";
import mentoringImage from "./assets/pictures/good/mentoring2.png";

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

const Journey = () => {
  const stageRef = useRef(null);
  const panelRef = useRef(null);
  const [interactive, setInteractive] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    const media = window.matchMedia(
      "(max-width: 767px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)",
    );
    const update = () => {
      if (!stageRef.current || !panelRef.current) return;
      const canAnimate =
        media.matches &&
        panelRef.current.offsetHeight <= window.innerHeight - 116;
      setInteractive(canAnimate);
      if (!canAnimate) return;

      const rect = stageRef.current.getBoundingClientRect();
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
      <div ref={panelRef} className={interactive ? "sticky top-24" : ""}>
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
        <div className="overflow-hidden rounded-[32px] shadow-lg">
          <div className="grid grid-cols-2 font-rocaTwoBold text-2xl font-bold">
            <h3 className="bg-third px-4 py-4 text-left">От</h3>
            <h3 className="bg-fourth px-4 py-4 text-right text-white">Към</h3>
          </div>
          <div className="bg-third/70">
            {journey.map(({ from, to }, index) => (
              <div key={to} className="grid grid-cols-2">
                <ul className="flex flex-col justify-center gap-2 border-b border-fourth/10 p-3 text-left font-rocaTwoThin text-base leading-5 md:p-4 md:text-lg md:leading-6">
                  {from.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="flex items-stretch bg-fourth/10 p-2">
                  <p
                    className={`flex w-full items-center justify-end rounded-2xl bg-fourth p-3 text-right font-rocaTwoThin text-base leading-5 text-white transition-opacity duration-300 motion-reduce:transition-none md:p-4 md:text-lg md:leading-6 ${
                      interactive && index >= revealedCount
                        ? "opacity-0"
                        : "opacity-100"
                    }`}
                  >
                    {to}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Mentoring = () => (
  <PageShell
    title="Менторска програма"
    intro="Индивидуална подкрепа за теб и твоя път в майчинството."
    introClassName="font-rocaTwoThin text-lg leading-6"
    introMarginClassName="mb-0"
    revealHeader
  >
    <RevealOnScroll>
      <img
        src={mentoringImage}
        alt="Менторска програма"
        className="relative left-1/2 z-0 mt-2 h-[100px] w-screen max-w-none -translate-x-1/2 translate-y-4 object-cover object-[center_20%] sm:h-[300px]"
        style={{
          maskImage: "linear-gradient(to bottom, #000 85%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 85%, transparent 100%)",
        }}
      />
    </RevealOnScroll>

    <RevealOnScroll
      as="section"
      className="mb-16 rounded-[32px] bg-fourth px-6 py-5 text-center text-white shadow-xl md:mb-16 md:px-14 md:py-8"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none block h-14 select-none overflow-hidden font-rocaTwoBold text-9xl leading-[0.7] text-secondary sm:h-20 sm:text-[11rem]"
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
          Можеш да го извървиш с някого, който вече го е вървял не само за себе
          си, но и за други майки и има опита и перспективата да те придружи по
          този път.
        </RevealOnScroll>
      </div>
      <span
        aria-hidden="true"
        className="pointer-events-none block h-14 rotate-180 select-none overflow-hidden font-rocaTwoBold text-9xl leading-[0.7] text-secondary sm:h-20 sm:text-[11rem]"
      >
        “
      </span>
    </RevealOnScroll>

    <RevealOnScroll
      as="section"
      className="mb-12 rounded-[32px] bg-third/80 p-5 md:mb-16 md:p-10"
    >
      <RevealOnScroll
        as="h2"
        className="mb-6 text-center font-rocaTwoBold text-2xl font-bold sm:text-3xl"
      >
        Ако си майка и усещаш, че…
      </RevealOnScroll>
      <ul className="mx-auto grid max-w-4xl gap-3 md:grid-cols-2">
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
      <p className="mt-7 text-center font-rocaTwoBold text-4xl font-bold">
        Това е за теб!
      </p>
    </RevealOnScroll>

    <RevealOnScroll
      as="section"
      className="mb-12 rounded-[32px] bg-primary p-5 text-[#403d5c] shadow-sm md:mb-16 md:p-10"
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
        <span className="font-rocaTwoRegular">Прегърната</span>“ и специалисти с
        опит в подкрепата на майки в групови и индивидуални формати.
      </RevealOnScroll>
      <RevealOnScroll
        as="p"
        className="mx-auto mt-4 max-w-4xl font-rocaTwoThin text-lg leading-6"
        delay={240}
      >
        Създадохме индивидуална менторска програма за майки, които имат нужда
        от:
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

    <RevealOnScroll as="section" className="mb-12 md:mb-16">
      <RevealOnScroll
        as="h2"
        className="mb-2 text-center font-rocaTwoBold text-2xl font-bold sm:text-3xl"
      >
        Менторска програма
      </RevealOnScroll>
      <RevealOnScroll
        as="h3"
        className="mx-auto mb-6 max-w-2xl text-center font-rocaTwoRegular text-lg leading-7"
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

    <RevealOnScroll as="section" className="mb-12 md:mb-16">
      <div className="grid motion-safe:-mb-[20svh] md:mb-0">
        <div className="relative z-20 motion-safe:pointer-events-none motion-safe:sticky motion-safe:top-24 motion-safe:col-start-1 motion-safe:row-start-1 motion-safe:h-[calc(100svh-6rem)] motion-safe:self-start md:static md:col-auto md:row-auto md:h-auto">
          <h2 className="mb-6 text-center font-rocaTwoBold text-2xl font-bold motion-safe:absolute motion-safe:inset-x-0 motion-safe:top-0 sm:text-3xl md:static">
            Програма
          </h2>
        </div>
        <ol className="grid gap-6 motion-safe:col-start-1 motion-safe:row-start-1 motion-safe:gap-0 md:col-auto md:row-auto md:grid-cols-2 md:gap-6">
          {sessions.map(({ title, description }, index) => (
            <li
              key={title}
              className="motion-safe:sticky motion-safe:top-0 motion-safe:flex motion-safe:min-h-[100svh] motion-safe:items-center motion-safe:pt-[var(--stack-offset)] md:static md:block md:min-h-0 md:pt-0"
              style={{ "--stack-offset": `${index * 24}px`, zIndex: index + 1 }}
            >
              <RevealOnScroll
                className={`relative flex min-h-[17rem] w-full items-center justify-center overflow-hidden rounded-[28px] border border-fourth/10 p-6 shadow-md ${
                  index % 2 === 0 ? "bg-white" : "bg-third"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="absolute right-4 top-2 font-rocaTwoBold text-7xl leading-none text-secondary/60"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="relative w-full text-center">
                  <p className="mb-2 font-rocaTwoBold text-sm uppercase tracking-widest text-fourth/70">
                    Среща {index + 1}
                  </p>
                  <h3 className="mb-3 font-rocaTwoBold text-xl font-bold">
                    {title}
                  </h3>
                  <p className="font-rocaTwoThin text-lg leading-6">
                    {description}
                  </p>
                </div>
              </RevealOnScroll>
            </li>
          ))}
        </ol>
      </div>
    </RevealOnScroll>

    <RevealOnScroll as="section" className="mb-12 md:mb-16">
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
              className="rounded-2xl bg-white/90 p-4 font-rocaTwoThin text-lg leading-6 shadow-sm"
            >
              {reason}
            </RevealOnScroll>
          ))}
        </ul>
      </div>
    </RevealOnScroll>

    <RevealOnScroll as="section" className="mb-12 md:mb-16">
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
        <CtaLink href="mailto:embraced.mothersclub@gmail.com">
          Свържи се с нас
        </CtaLink>
      </RevealOnScroll>
    </RevealOnScroll>
  </PageShell>
);

export default Mentoring;
