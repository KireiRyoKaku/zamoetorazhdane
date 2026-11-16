import React from "react";
import {
  CtaLink,
  InfoCard,
  PageShell,
  RevealOnScroll,
} from "./components/PageShell";
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
    description:
      "Сън, ритъм и структура на деня. Емоционални изблици и гняв.",
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

const from = [
  "хронична умора",
  "режим „оцеляване“",
  "липса на структура и време за себе си",
  "постоянно напрежение",
  "неясни граници",
  "дистанция с партньора",
  "усещане за самота",
];

const to = [
  "спокойствие и глътка въздух",
  "по-малко вина и повече ресурс в ежедневието",
  "връзка със себе си",
  "яснота и опора",
  "по-спокойно и хармонично майчинство",
];

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
      />
    </RevealOnScroll>

    <RevealOnScroll
      as="section"
      className="relative mb-2 rounded-[32px] bg-white p-6 shadow-xl md:mb-4 md:p-14"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-2 -top-8 select-none font-rocaTwoBold text-8xl leading-none text-secondary"
      >
        “
      </span>
          <RevealOnScroll
      as="h2"
          className="mb-6 text-center font-rocaTwoBold text-2xl font-bold sm:text-3xl"
      delay={240}
    >
      Не е нужно да вървиш по този път сама
    </RevealOnScroll>
      <RevealOnScroll
        as="p"
        className="font-rocaTwoThin text-lg leading-6"
        delay={120}
      >
        Можеш да го извървиш с някого, който вече го е вървял не само за себе
        си, но и за други майки и има опита и перспективата да те придружи по
        този път.
      </RevealOnScroll>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 -right-2 select-none font-rocaTwoBold text-8xl leading-none text-secondary"
      >
        ”
      </span>
    </RevealOnScroll>

    <RevealOnScroll as="section" className="mb-12 md:mb-16">
      <RevealOnScroll
        className="mx-auto max-w-4xl rounded-[32px] bg-white p-5 shadow-sm md:p-10"
        delay={120}
      >
        <RevealOnScroll
          as="h2"
          className="mb-6 text-center font-rocaTwoBold text-2xl font-bold sm:text-3xl"
        >
          Ако си майка и усещаш, че…
        </RevealOnScroll>
        <ul className="list-disc space-y-4 pl-6 font-rocaTwoThin text-lg leading-6 marker:text-secondary">
          {openingNeeds.map((need, index) => (
            <RevealOnScroll as="li" key={need} delay={index * 100}>
              {need}
            </RevealOnScroll>
          ))}
        </ul>
        <p className="mt-6 text-center font-rocaTwoBold text-xl font-bold">
          Това е за теб
        </p>
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
        Индивидуална работа с една от нас
      </RevealOnScroll>
      <RevealOnScroll
        as="p"
        className="mx-auto max-w-4xl font-rocaTwoThin text-lg leading-6"
        delay={120}
      >
        Анелия или Катя – създатели на „Прегърната“ и специалисти с опит в
        подкрепата на майки в групови и индивидуални формати.
      </RevealOnScroll>
      <RevealOnScroll
        as="p"
        className="mx-auto mt-4 max-w-4xl font-rocaTwoThin text-lg leading-6"
        delay={240}
      >
        Създадохме индивидуална менторска програма за майки, които имат нужда от:
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
        className="mb-6 text-center font-rocaTwoBold text-2xl font-bold sm:text-3xl"
      >
        Менторска програма
      </RevealOnScroll>
      <div className="mx-auto max-w-4xl rounded-[32px] bg-white/80 p-5 shadow-sm md:p-10">
        <RevealOnScroll
          as="p"
          className="mb-4 font-rocaTwoBold text-lg font-bold leading-6"
        >
          6 индивидуални 1:1 срещи в рамките на 6 до 8 седмици
        </RevealOnScroll>
        <RevealOnScroll
          as="p"
          className="font-rocaTwoThin text-lg leading-6"
          delay={120}
        >
          Цялостна програма, разработена и фокусирана върху аспекти като:
        </RevealOnScroll>
        <RevealOnScroll
          as="h3"
          className="mt-6 font-rocaTwoBold text-xl font-bold"
          delay={240}
        >
          Теми, които можем да разгледаме
        </RevealOnScroll>
        <ul className="mt-4 list-disc space-y-3 pl-6 font-rocaTwoThin text-lg leading-6 marker:text-secondary">
          {programTopics.map((topic, index) => (
            <RevealOnScroll as="li" key={topic} delay={index * 100}>
              {topic}
            </RevealOnScroll>
          ))}
        </ul>
        <RevealOnScroll
          as="p"
          className="mt-5 font-rocaTwoThin text-lg leading-6"
          delay={120}
        >
          Подбор на темите според твоите индивидуални нужди и цели за тази
          програма.
        </RevealOnScroll>
      </div>
    </RevealOnScroll>

    <RevealOnScroll as="section" className="mb-12 md:mb-16">
      <RevealOnScroll
        as="h2"
        className="mb-6 text-center font-rocaTwoBold text-2xl font-bold sm:text-3xl"
      >
        Програма на 6-те срещи
      </RevealOnScroll>
      <ol className="grid gap-6 md:grid-cols-2">
        {sessions.map(({ title, description }, index) => (
          <RevealOnScroll as="li" key={title} delay={index * 100}>
            <InfoCard title={`${index + 1}. ${title}`}>
              <p className="font-rocaTwoThin text-lg leading-6">
                {description}
              </p>
            </InfoCard>
          </RevealOnScroll>
        ))}
      </ol>
    </RevealOnScroll>

    <RevealOnScroll as="section" className="mb-12 md:mb-16">
      <RevealOnScroll
        as="h2"
        className="mb-6 text-center font-rocaTwoBold text-2xl font-bold sm:text-3xl"
      >
        Тази програма е за теб, ако…
      </RevealOnScroll>
      <div className="mx-auto max-w-4xl rounded-[32px] bg-white/80 p-5 shadow-sm md:p-10">
        <ul className="list-disc space-y-4 pl-6 font-rocaTwoThin text-lg leading-6 marker:text-secondary">
          {isForYou.map((reason, index) => (
            <RevealOnScroll as="li" key={reason} delay={index * 100}>
              {reason}
            </RevealOnScroll>
          ))}
        </ul>
      </div>
    </RevealOnScroll>

    <RevealOnScroll as="section" className="mb-12 md:mb-16">
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
      <div className="grid gap-6 md:grid-cols-2">
        <RevealOnScroll>
          <InfoCard title="От" items={from} />
        </RevealOnScroll>
        <RevealOnScroll delay={120}>
          <InfoCard title="Към" items={to} />
        </RevealOnScroll>
      </div>
    </RevealOnScroll>

    <RevealOnScroll
      as="section"
      className="rounded-[32px] bg-white/80 p-5 text-center shadow-xl md:p-10"
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
