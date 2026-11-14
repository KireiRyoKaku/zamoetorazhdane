import React from "react";
import {
  CtaLink,
  InfoCard,
  PageShell,
  RevealOnScroll,
} from "./components/PageShell";
import {
  IoConstructOutline,
  IoHeartOutline,
  IoLeafOutline,
  IoHandLeftOutline,
} from "react-icons/io5";
import katyaImage from "./assets/pictures/good/katyapsyconsult.png";

const supportAreas = [
  "да се свържат по-дълбоко със своя вътрешен свят",
  "да разпознаят и приемат емоциите си",
  "да се освободят от ограничаващи вярвания",
  "да преработят повтарящи се модели на поведение",
  "да изградят устойчиви лични граници и вътрешна опора",
];

const reasonsToChoose = [
  {
    text: "Психолог с постоянно развиващ се инструментариум",
    icon: IoConstructOutline,
  },
  { text: "Индивидуално присъствие и грижа", icon: IoHeartOutline },
  { text: "Нежен и внимателен подход", icon: IoLeafOutline },
  { text: "Разбиране във всеки един момент", icon: IoHandLeftOutline },
];

const KatyaServices = () => (
  <PageShell
    title="Здравей, аз съм Катя!"
    intro="Холистичен психолог, емоционален ментор и позитивен психотерапевт в обучение."
    introClassName="font-rocaTwoThin text-lg"
    revealHeader
    backState={{ scrollTo: "katya-card" }}
  >
    <RevealOnScroll>
      <img
        src={katyaImage}
        alt="Катя Ушева"
        className="relative z-0 mx-auto h-[280px] w-4/5 max-w-xs translate-y-4 rounded-[24px] object-cover object-top sm:h-[320px]"
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
      <div className="relative z-10 space-y-7 font-rocaTwoThin text-lg leading-relaxed md:space-y-8 md:text-xl">
        <RevealOnScroll as="p">
          Аз също съм майка и знам колко ценна е подкрепата за една жена, когато
          е уморена, объркана или просто има нужда да бъде разбрана.
        </RevealOnScroll>
        <RevealOnScroll as="p" delay={120}>
          В{" "}
          <span className="font-magnoliaScript text-xl font-bold">
            „Прегърната“
          </span>{" "}
          съм, за да подкрепям майките в срещата им със самите себе си – в онези
          моменти, когато копнеят за яснота, приемане, нова гледна точка или
          просто пространство, в което да бъдат чути.
        </RevealOnScroll>
      </div>
    </RevealOnScroll>

    <RevealOnScroll as="section" className="mb-12 md:mb-16">
      <RevealOnScroll
        as="h2"
        className="mb-6 text-center font-rocaTwoBold text-2xl font-bold sm:text-3xl"
      >
        В работата си помагам на жените
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
        Как може да работим заедно?
      </RevealOnScroll>
      <RevealOnScroll
        as="p"
        className="mx-auto max-w-4xl text-left font-rocaTwoThin text-lg leading-relaxed"
        delay={120}
      >
        В индивидуалните сесии можем да навлезем в дълбочина по теми като
        взаимоотношения, лични граници, загуба на себе си, баланс между
        семейство и кариера, майчинско прегаряне, родителска вина, тревожност,
        емоционална интелигентност и личностно развитие.
      </RevealOnScroll>
      <RevealOnScroll
        as="p"
        className="text-lefta mx-auto mt-4 max-w-4xl font-rocaTwoThin text-lg leading-relaxed"
        delay={240}
      >
        Фокус в моята практика е подкрепата в различните етапи на майчинството.
        Ако усещаш, че е време да поемеш по този път на вътрешна грижа – пиши
        ми. Ще се радвам да те придружа в твоето пътуване навътре към себе си.
        🩷
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
        {reasonsToChoose.map(({ text, icon: Icon }, index) => (
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
            <span>{text}</span>
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
      <div className="grid items-stretch gap-6 md:grid-cols-3">
        <RevealOnScroll>
          <InfoCard
            title="Индивидуална психологическа консултация"
            price="60 минути | 50 €"
          >
            <p className="font-rocaTwoThin leading-relaxed">
              Пространство, в което да споделиш онова, което те вълнува, да
              внесеш яснота в преживяванията си и да откриеш нова гледна точка
              към ситуацията, през която преминаваш.
            </p>
          </InfoCard>
        </RevealOnScroll>
        <RevealOnScroll delay={120}>
          <InfoCard
            title="Пакет от 6 терапевтични сесии"
            price="6 × 60 минути | 250 €"
          >
            <p className="font-rocaTwoThin leading-relaxed">
              Възможност да отделиш повече време на себе си, да изследваш
              повтарящи се модели и постепенно да откриваш нови начини да
              разбираш и подкрепяш себе си.
            </p>
          </InfoCard>
        </RevealOnScroll>
        <RevealOnScroll delay={240}>
          <InfoCard
            title="„Прегърни детето вътре в теб“"
            price="10 × 90 минути | 650 €"
          >
            <p className="font-rocaTwoThin leading-relaxed">
              Пътешествие към по-дълбоко разбиране на ранните ти преживявания,
              емоционалните потребности и онези части от теб, които имат нужда
              от приемане, грижа и внимание.
            </p>
          </InfoCard>
        </RevealOnScroll>
      </div>
    </RevealOnScroll>

    <RevealOnScroll
      as="section"
      className="rounded-[32px] bg-white/80 p-5 text-center shadow-xl md:p-10"
    >
      <RevealOnScroll
        as="h2"
        className="mb-4 font-rocaTwoBold text-2xl font-bold sm:text-3xl"
      >
        Запази час
      </RevealOnScroll>
      <RevealOnScroll
        as="p"
        className="mx-auto mb-4 max-w-3xl font-rocaTwoThin text-lg leading-relaxed"
        delay={120}
      >
        Индивидуалните психологически консултации се провеждат онлайн – за
        клиенти от цялата страна и чужбина, или на живо в кабинета ми в Пловдив.
        Ако живееш в Пловдив, но онлайн форматът е по-удобен за теб, можеш да
        избереш и него.
      </RevealOnScroll>
      <RevealOnScroll
        as="p"
        className="mb-6 font-rocaTwoThin text-lg leading-relaxed"
        delay={240}
      >
        Записването на часове и за двата формата става през профила ми в
        SuperDoc.
      </RevealOnScroll>
      <RevealOnScroll delay={360}>
        <CtaLink href="https://superdoc.bg/lekar/katya-usheva">
          Запази час в SuperDoc
        </CtaLink>
      </RevealOnScroll>
    </RevealOnScroll>
  </PageShell>
);

export default KatyaServices;
