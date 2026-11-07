import React from "react";
import { CtaLink, InfoCard, PageShell } from "./components/PageShell";

const Mentoring = () => (
  <PageShell
    title="Менторска програма"
    intro="Тестова страница: подкрепа по личния път в спокойното майчинство."
  >
    <div className="grid gap-8 md:grid-cols-2">
      <InfoCard
        title="За кого е"
        items={["За майки, които търсят насока", "За всеки етап от майчинството"]}
      />
      <InfoCard
        title="Как работи"
        items={["Регулярни срещи с ментор", "Личен план и подкрепа"]}
      />
    </div>
    <div className="mt-12 text-center">
      <CtaLink href="mailto:embraced.mothersclub@gmail.com">
        Свържи се с нас
      </CtaLink>
    </div>
  </PageShell>
);

export default Mentoring;
