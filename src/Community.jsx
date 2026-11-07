import React from "react";
import { CtaLink, InfoCard, PageShell } from "./components/PageShell";

const Community = () => (
  <PageShell
    title="Общност"
    intro="Примерна страница: принадлежност и взаимна подкрепа между майки."
  >
    <div className="grid gap-8 md:grid-cols-3">
      <InfoCard title="Споделяне" items={["Безопасно пространство", "Истории и опит"]} />
      <InfoCard title="Подкрепа" items={["Взаимопомощ", "Съвети от други майки"]} />
      <InfoCard title="Срещи" items={["Събития на живо", "Онлайн срещи"]} />
    </div>
    <div className="mt-12 text-center">
      <CtaLink to="/events">Виж срещите</CtaLink>
    </div>
  </PageShell>
);

export default Community;
