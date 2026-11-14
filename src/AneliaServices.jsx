import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "./components/Button";
import {
  InfoCard,
  PageShell,
  RevealOnScroll,
} from "./components/PageShell";
import {
  IoDocument,
  IoLeafOutline,
  IoAddCircle,
  IoAccessibility,
  IoRibbon,
} from "react-icons/io5";
import aneliaImage from "./assets/pictures/good/anelia-good-ench-edit.png";

const supportAreas = [
  "да открият своя подход в казусите със съня на детето",
  "да се свържат отново с интуицията си",
  "да си върнат спокойствието и увереността в майчинството",
  "да се наспиват и да посрещат с повече лекота ежедневието си",
];

const reasonsToChoose = [
  {
    text: "Сертифициран член на асоциацията на консултантите по детски сън в България,",
    icon: IoRibbon,
    href: "https://asociaciasun.bg/person/%d0%b0%d0%bd%d0%b5%d0%bb%d0%b8%d1%8f-%d1%82%d0%b0%d0%ba%d0%be%d0%b2%d0%b0/",
  },
  { text: "Индивидуален подход", icon: IoAccessibility },
  { text: "Плавни методи", icon: IoLeafOutline },
  { text: "Трайни резултати", icon: IoAddCircle },
];

const CalendlyBooking = () => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerButtonRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      triggerButtonRef.current?.focus();
    };
  }, [isOpen]);

  const calendlyUrl = new URL("https://calendly.com/sunzatebe/15min");
  calendlyUrl.searchParams.set("embed_domain", window.location.hostname);
  calendlyUrl.searchParams.set("embed_type", "Inline");
  calendlyUrl.searchParams.set("hide_gdpr_banner", "1");

  return (
    <>
      <Button
        ref={triggerButtonRef}
        onClick={() => setIsOpen(true)}
      >
        Безплатен 15-минутен разговор
      </Button>
      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 sm:p-6"
            onClick={() => setIsOpen(false)}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="anelia-calendly-title"
              className="flex h-[90dvh] max-h-[800px] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <header className="flex items-center justify-between gap-4 border-b border-gray-200 px-5 py-3">
                <h2
                  id="anelia-calendly-title"
                  className="font-rocaTwoBold text-lg text-fourth sm:text-xl"
                >
                  Безплатен 15-минутен разговор с Анелия
                </h2>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Затвори прозореца"
                  className="rounded-full px-3 py-1 text-3xl leading-none text-fourth hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary"
                >
                  ×
                </button>
              </header>
              <iframe
                src={calendlyUrl.toString()}
                title="Calendly – безплатен 15-минутен разговор с Анелия"
                className="min-h-0 w-full flex-1"
              />
            </section>
          </div>,
          document.body,
        )}
    </>
  );
};

const AneliaServices = () => (
  <PageShell
    title="Здравей, аз съм Анелия!"
    intro="Сертифициран консултант по детски сън и обучаващ се психолог."
    introClassName="font-rocaTwoThin text-lg"
    revealHeader
  >
    <RevealOnScroll>
      <img
        src={aneliaImage}
        alt="Анелия Такова"
        className="relative z-0 mx-auto h-[280px] w-4/5 max-w-xs translate-y-4 rounded-[24px] object-cover object-[center_25%] sm:h-[320px]"
      />
    </RevealOnScroll>
    <RevealOnScroll
      as="section"
      className="relative z-10 -mt-6 mb-12 overflow-hidden rounded-[32px] bg-white p-6 shadow-xl md:mb-16 md:p-14"
    >
      <RevealOnScroll
        as="span"
        aria-hidden="true"
        className="pointer-events-none relative z-0 -mb-3 block w-fit select-none font-rocaTwoBold text-8xl leading-[0.7] text-secondary md:text-7xl"
      >
        “
      </RevealOnScroll>
      <RevealOnScroll
        as="p"
        className="relative z-10 font-rocaTwoThin text-lg leading-relaxed md:text-xl"
      >
        Майка съм на две деца и знам колко е важно да дадеш грижа на себе си, за да можеш да се грижиш пълноценно и за всички около теб.
        <br />
        <br />
        В{" "}
        <span className="font-magnoliaScript text-xl font-bold">
          „Прегърната“
        </span>{" "}
        съм, за да творя и вдъхвам живот на едно доверено пространство, което
        да носи на майките усещане за заедност, сила, сплотеност и подкрепа. И
        за да се свързвам искрено с всички вас, които сте тук, в него! 🌸
      </RevealOnScroll>
    </RevealOnScroll>

    <RevealOnScroll as="section" className="mb-12 md:mb-16">
      <RevealOnScroll
        as="h2"
        className="mb-6 text-center font-rocaTwoBold text-2xl font-bold sm:text-3xl"
      >
        В работата си помагам на жените
        <br />
        <span className="mr-2 text-secondary text-center" aria-hidden="true">
          🌸
        </span>
      </RevealOnScroll>
      <RevealOnScroll
        className="mx-auto max-w-4xl rounded-[32px] bg-white/80 p-5 shadow-sm md:p-10"
        delay={120}
      >
        <ul className="list-disc space-y-4 px-2 pl-6 font-rocaTwoThin text-lg leading-relaxed marker:text-secondary">
          {supportAreas.map((area, index) => (
            <RevealOnScroll as="li" key={area} delay={index * 100}>
              {area}
            </RevealOnScroll>
          ))}
        </ul>
      </RevealOnScroll>
    </RevealOnScroll>

    <RevealOnScroll
      as="section"
      className="mb-12 rounded-[32px] bg-white/80 p-5 shadow-sm md:mb-16 md:p-10"
    >
      <RevealOnScroll
        as="h2"
        className="mb-4 text-center font-rocaTwoBold text-2xl font-bold sm:text-3xl"
      >
        Как можем да работим заедно?
      </RevealOnScroll>
      <RevealOnScroll
        as="p"
        className="mx-auto max-w-4xl font-rocaTwoThin text-lg leading-relaxed"
        delay={120}
      >
        Ежедневно подкрепям семейства по пътя им като родители. Искрено вярвам,
        че пълноценният сън е стабилна основа в отглеждането на деца. Ще ти
        помогна да изградиш своята уверена и спокойна нагласа спрямо съня на
        детето.
      </RevealOnScroll>
      <RevealOnScroll
        as="p"
        className="mx-auto mt-4 max-w-4xl font-rocaTwoThin text-lg leading-relaxed"
        delay={240}
      >
        Всяко дете идва със своя темперамент и нужди. Всяко семейство е отделна
        вселена и заслужава индивидуална грижа. При мен фокусът е върху цялото.
        Не работя само за съня на бебето, а за спокойствието на цялото
        семейство. Водя се по вашите нужди, движа се с вашето темпо. Не търсим
        бързи резултати. Търсим хармония. 
      </RevealOnScroll>
    </RevealOnScroll>

    <RevealOnScroll as="section" className="mb-12 md:mb-16">
      <RevealOnScroll
        as="h2"
        className="mb-6 text-center font-rocaTwoBold text-2xl font-bold sm:text-3xl"
      >
        Защо да се обърнеш към мен
      </RevealOnScroll>
      <ul className="mx-auto grid max-w-4xl grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        {reasonsToChoose.map(({ text, icon: Icon, href }, index) => (
          <RevealOnScroll
            as="li"
            key={text}
            className="flex min-w-0 flex-col items-center gap-3 break-words rounded-2xl bg-third p-4 text-center font-rocaTwoThin text-lg leading-relaxed [overflow-wrap:anywhere] md:p-5"
            delay={index * 100}
          >
            <Icon
              className="h-7 w-7 shrink-0 text-secondary"
              aria-hidden="true"
            />
            <span>
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary"
                >
                  {text}
                </a>
              ) : (
                text
              )}
            </span>
          </RevealOnScroll>
        ))}
      </ul>
    </RevealOnScroll>

    <RevealOnScroll as="section" className="mb-12 md:mb-16">
      <RevealOnScroll
        as="h2"
        className="mb-6 text-center font-rocaTwoBold text-2xl font-bold sm:text-3xl"
      >
        Избери подходящата за теб подкрепа
      </RevealOnScroll>
      <div className="grid gap-8 md:grid-cols-3">
        <InfoCard
          title="Единична консултация"
          price="55 €"
          items={[
            "90-минутна сесия, основно онлайн",
            "Възможност за среща на живо в Пловдив",
            "Индивидуални материали след срещата",
          ]}
        />
        <InfoCard
          title="Консултация с проследяване"
          price="от 95 €"
          badge="Най-популярен"
          items={[
            "1 седмица – 95 €, 2 седмици – 135 €, 4 седмици – 215 €",
            "Първоначален телефонен разговор",
            "Всичко от единичната консултация",
            "Ежедневна връзка и активна работа по съня",
          ]}
        />
        <InfoCard
          title="Пакет „Добре дошло, бебе!“"
          price="110 €"
          items={[
            "40-минутна сесия",
            "Аудио наръчник",
            "1 бонус разговор от 30 минути преди 3-месечна възраст",
            "10% отстъпка за следващи сесии",
          ]}
        />
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <InfoCard
          title="Допълнителни консултации"
          items={[
            "Кратка сесия – 25 €",
            "Допълнителна седмица проследяване – 40 €",
          ]}
        />
        <InfoCard
          title="Отстъпки"
          items={["10% за върнали се клиенти", "Близнаци – 2 на цената на 1"]}
        />
      </div>
    </RevealOnScroll>

    <RevealOnScroll as="div" className="mt-12 text-center">
      <RevealOnScroll
        as="h2"
        className="mb-4 font-rocaTwoBold text-2xl font-bold"
      >
        Не отлагай недоспиването!
      </RevealOnScroll>
      <RevealOnScroll delay={120}>
        <CalendlyBooking />
      </RevealOnScroll>
    </RevealOnScroll>
  </PageShell>
);

export default AneliaServices;
