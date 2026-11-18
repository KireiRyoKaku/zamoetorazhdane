import React from "react";
import {
  CtaLink,
  InfoCard,
  PageShell,
  RevealOnScroll,
  ServiceQuote,
} from "./components/PageShell";
import {
  IoConstruct,
  IoHeart,
  IoLeaf,
  IoHandLeft,
  IoFlower
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
    icon: IoConstruct,
  },
  { text: "Индивидуално присъствие и грижа", icon: IoHeart },
  { text: "Нежен и внимателен подход", icon: IoLeaf },
  { text: "Разбиране във всеки един момент", icon: IoHandLeft },
];

const KatyaServices = () => (
  <PageShell
    title="Здравей, аз съм Катя!"
    intro="Холистичен психолог, емоционален ментор и позитивен психотерапевт в обучение."
    introClassName="font-rocaTwoThin text-lg"
    revealHeader
    showBackButton={false}
    backState={{ scrollTo: "katya-card" }}
  >
    <RevealOnScroll>
      <div className="relative z-20 mx-auto w-4/5 max-w-xs">
        <img
          src={katyaImage}
          alt="Катя Ушева"
          className="relative z-0 h-[280px] w-full translate-y-4 rounded-[24px] object-cover object-top sm:h-[320px]"
        />
        <div className="absolute inset-x-0 bottom-16 z-30 flex justify-center">
          <CtaLink href="https://superdoc.bg/lekar/katya-usheva">
            ЗАПАЗИ ЧАС
          </CtaLink>
        </div>
      </div>
    </RevealOnScroll>    <ServiceQuote>
      <div className="space-y-6">
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
    </ServiceQuote>

    <RevealOnScroll as="section" className="mb-12 md:mb-16">
      <RevealOnScroll
        as="h2"
        className="mb-6 text-center font-rocaTwoBold text-2xl font-bold sm:text-3xl"
      >
        В работата си помагам на жените

      </RevealOnScroll>
      <RevealOnScroll
        className="mx-auto max-w-4xl rounded-[32px] bg-third/80 p-5 shadow-sm md:p-10"
        delay={120}
      >
        <ul className="grid gap-3 md:grid-cols-2">
          {supportAreas.map((area, index) => (
            <RevealOnScroll
              as="li"
              key={area}
              delay={index * 100}
              className="flex items-start gap-3 rounded-2xl bg-white/90 p-4 font-rocaTwoThin text-lg leading-6"
            >
              <span aria-hidden="true" className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-secondary" />
              {area}
            </RevealOnScroll>
          ))}
        </ul>
      </RevealOnScroll>
    </RevealOnScroll>

    <RevealOnScroll
      as="section"
      className="mb-12 rounded-[32px] border-t-8 border-secondary bg-white p-5 shadow-sm md:mb-16 md:p-10"
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
        className="mx-auto mt-4 max-w-4xl font-rocaTwoThin text-lg leading-relaxed"
        delay={240}
      >
        Фокус в моята практика е подкрепата в различните етапи на майчинството.
        Ако усещаш, че е време да поемеш по този път на вътрешна грижа – пиши
        ми. Ще се радвам да те придружа в твоето пътуване навътре към себе си.
      </RevealOnScroll>
    </RevealOnScroll>

    <RevealOnScroll as="section" className="mb-12 md:mb-16">
      <RevealOnScroll
        as="h2"
        className="mb-6 text-center font-rocaTwoBold text-2xl font-bold sm:text-3xl"
      >
        Защо да се обърнеш към мен
      </RevealOnScroll>
      <ul className="mx-auto grid max-w-4xl grid-cols-1 gap-3 rounded-[32px] bg-secondary/75 p-5 md:grid-cols-2 md:gap-4 md:p-10">
        {reasonsToChoose.map(({ text, icon: Icon }, index) => (
          <RevealOnScroll
            as="li"
            key={text}
            className="flex min-w-0 flex-col items-center gap-3 break-words rounded-2xl bg-white/90 p-4 text-center font-rocaTwoThin text-lg leading-relaxed [overflow-wrap:anywhere] md:p-5"
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
      className="rounded-[32px] bg-fourth p-5 text-center text-white shadow-xl md:p-10"
    >
      <RevealOnScroll
        as="h2"
        className="mb-10 font-rocaTwoBold text-2xl font-bold sm:text-3xl"
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
