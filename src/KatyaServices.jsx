import React from "react";
import { CtaLink, InfoCard, PageShell } from "./components/PageShell";

const KatyaServices = () => (
  <PageShell
    title="Сесии с психолог"
    intro="Пример страница: индивидуална работа с Катя в безопасно и подкрепящо пространство."
    backState={{ scrollTo: "katya-card" }}
  >
    <div className="grid gap-8 md:grid-cols-3">
      <InfoCard
        title="Първа среща"
        price="Пример"
        items={["Запознаване и очертаване на нуждите", "Онлайн или на живо"]}
      />
      <InfoCard
        title="Индивидуална сесия"
        price="Пример"
        items={["50-минутен разговор 1:1", "Работа по личен казус"]}
      />
      <InfoCard
        title="Пакет сесии"
        price="Пример"
        items={["Серия от срещи", "Постоянна подкрепа между сесиите"]}
      />
    </div>
    <div className="mt-12 text-center">
      <CtaLink href="mailto:embraced.mothersclub@gmail.com">
        Запази сесия
      </CtaLink>
    </div>
  </PageShell>
);

export default KatyaServices;
