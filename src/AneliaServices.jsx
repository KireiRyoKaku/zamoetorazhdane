import React from "react";
import { CtaLink, InfoCard, PageShell } from "./components/PageShell";

const AneliaServices = () => (
  <PageShell
    title="Консултации по детски сън"
    intro="Нежна и индивидуална подкрепа за спокоен сън на бебето и на цялото семейство."
  >
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
        items={["Кратка сесия – 25 €", "Допълнителна седмица проследяване – 40 €"]}
      />
      <InfoCard
        title="Отстъпки"
        items={["10% за върнали се клиенти", "Близнаци – 2 на цената на 1"]}
      />
    </div>

    <div className="mt-12 text-center">
      <h2 className="mb-4 font-rocaTwoBold text-2xl font-bold">
        Не отлагай недоспиването!
      </h2>
      <CtaLink href="https://calendly.com/sunzatebe/15min">
        Безплатен 15-минутен разговор
      </CtaLink>
    </div>
  </PageShell>
);

export default AneliaServices;
