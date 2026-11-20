import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "./components/Button";
import {
  PageShell,
  RevealOnScroll,
  ServiceQuote,
} from "./components/PageShell";
import {
  IoLeaf,
  IoAddCircle,
  IoAccessibility,
  IoRibbon,
} from "react-icons/io5";
import aneliaImage from "./assets/pictures/good/detskisunservices.png";
import logoSmall from "./assets/pictures/PregurnataLogoPinkNoText.png";
import { API_URL } from "../utils/apiConfig";

const supportAreas = [
  "да открият своя подход в казусите със съня на детето",
  "да се свържат отново с интуицията си",
  "да си върнат спокойствието и увереността в майчинството",
  "да се наспиват и да посрещат с повече лекота ежедневието си",
];

const reasonsToChoose = [
  {
    text: "Сертифициран консултант по детски сън",
    icon: IoRibbon,
    href: "https://asociaciasun.bg/person/%d0%b0%d0%bd%d0%b5%d0%bb%d0%b8%d1%8f-%d1%82%d0%b0%d0%ba%d0%be%d0%b2%d0%b0/",
  },
  { text: "Индивидуален подход", icon: IoAccessibility },
  { text: "Плавни методи", icon: IoLeaf },
  { text: "Трайни резултати", icon: IoAddCircle },
];

const followUpOptions = [
  { value: "Пакет: Фокус върху режима (1 седмица)", label: "Фокус върху режима", duration: "1 седмица", price: "95 €" },
  { value: "Пакет: Режима и начина на заспиване (2 седмици)", label: "Режим и начин на заспиване", duration: "2 седмици", price: "135 €" },
  { value: "Пълен пакет (4 седмици)", label: "Пълен пакет", duration: "4 седмици", price: "215 €" },
];

const singleService = "Единична консултация";

const ConsultationPackages = () => {
  const [selectedPackage, setSelectedPackage] = useState(followUpOptions[2].value);
  const [service, setService] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const triggerRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!service) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [service]);

  useEffect(() => {
    if (!service) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && status.type !== "submitting") setService(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [service, status.type]);

  const openForm = (selectedService, event) => {
    triggerRef.current = event.currentTarget;
    setForm({ name: "", email: "", message: "" });
    setStatus({ type: "idle", message: "" });
    setService(selectedService);
  };

  const closeForm = () => {
    if (status.type === "submitting") return;
    setService(null);
  };

  const submitForm = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ type: "error", message: "Моля, попълни всички полета." });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setStatus({ type: "error", message: "Моля, въведи валиден имейл адрес." });
      return;
    }
    setStatus({ type: "submitting", message: "" });
    try {
      const response = await fetch(`${API_URL}/anelia-contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, service }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Съобщението не беше изпратено.");
      setStatus({ type: "success", message: "Благодаря! Ще се свържа с теб възможно най-скоро." });
    } catch (error) {
      console.error("Anelia contact form error:", error);
      setStatus({ type: "error", message: error.message || "Възникна проблем. Моля, опитай отново след малко." });
    }
  };

  return (
    <>
      <div className="grid gap-8">
        <div className="flex flex-col rounded-[32px] bg-white p-7 shadow-xl">
          <h3 className="mb-4 text-center font-rocaTwoBold text-2xl">Единична консултация</h3>
          <p className="mb-4 font-rocaTwoThin">За родители, които искат ясни насоки и са готови да работят самостоятелно.</p>
          <ul className="mb-6 list-disc space-y-2 pl-5">
            <li>Предварителен анализ на индивидуалната ситуация</li>
            <li>90-минутна сесия, основно онлайн; възможност за среща в Пловдив</li>
            <li>Индивидуални материали след срещата</li>
          </ul>
          <div className="mt-auto text-center">
            <p className="mb-4 text-xl font-bold text-fourth">55 €</p>
            <Button onClick={(event) => openForm(singleService, event)}>Заяви сега</Button>
          </div>
        </div>
        <div className="relative flex flex-col rounded-[32px] border-2 border-secondary bg-white p-7 shadow-xl">
          <span className="absolute -top-3 right-6 rounded-3xl bg-secondary px-4 py-1 text-sm text-fourth">Най-популярен</span>
          <h3 className="mb-4 text-center font-rocaTwoBold text-2xl">Консултация с проследяване</h3>
          <ul className="mb-5 list-disc space-y-2 pl-5">
            <li>Първоначален телефонен разговор</li>
            <li>Всичко от единичната консултация</li>
            <li>Ежедневна връзка и активна работа по съня</li>
          </ul>
          <fieldset className="mb-5 space-y-2">
            <legend className="mb-2 font-rocaTwoBold">Избери проследяване</legend>
            {followUpOptions.map((option) => (
              <label key={option.value} className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-3 transition-colors ${selectedPackage === option.value ? "border-fourth bg-primary/60" : "border-transparent bg-third/40 hover:bg-third"}`}>
                <input type="radio" name="follow-up" value={option.value} checked={selectedPackage === option.value} onChange={(event) => setSelectedPackage(event.target.value)} className="mt-1 accent-fourth" />
                <span className="flex-1">
                  <span className="flex flex-wrap justify-between gap-x-2 font-rocaTwoBold"><span>{option.label}</span><span>{option.price}</span></span>
                  <span className="font-rocaTwoThin">{option.duration}</span>
                </span>
              </label>
            ))}
          </fieldset>
          <div className="mt-auto text-center">
            <Button onClick={(event) => openForm(selectedPackage, event)}>Заяви сега</Button>
          </div>
        </div>
      </div>
      <p className="mt-5 text-center font-rocaTwoThin text-sm">
        Единичната консултация и пакетите с 1 или 2 седмици проследяване могат да бъдат надградени до 3 дни след консултацията с доплащане на разликата.
      </p>
      {service && createPortal(
        <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-[#403d5c]/70 p-0 sm:p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeForm(); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="anelia-contact-title" className="max-h-[100dvh] w-full max-w-2xl overflow-y-auto rounded-[24px] bg-white p-6 text-[#403d5c] shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:rounded-[32px] md:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 id="anelia-contact-title" className="font-rocaTwoBold text-2xl">Заявка за консултация</h2>
                <p className="mt-2 font-rocaTwoThin">Избрана услуга: <strong>{service}</strong></p>
              </div>
              <button ref={closeRef} type="button" onClick={closeForm} disabled={status.type === "submitting"} aria-label="Затвори формата" className="rounded-full p-2 text-2xl leading-none hover:bg-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fourth/60 disabled:opacity-50">×</button>
            </div>
            {status.type === "success" ? (
              <div role="status" className="rounded-2xl bg-primary p-5 text-center font-rocaTwoThin text-lg">{status.message}</div>
            ) : (
              <form onSubmit={submitForm} className="space-y-4">
                <label className="block font-rocaTwoRegular">Име
                  <input required type="text" autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1 w-full rounded-xl border border-fourth/30 px-4 py-3 font-rocaTwoThin focus:border-fourth focus:outline-none focus:ring-2 focus:ring-fourth/40" />
                </label>
                <label className="block font-rocaTwoRegular">Имейл
                  <input required type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-1 w-full rounded-xl border border-fourth/30 px-4 py-3 font-rocaTwoThin focus:border-fourth focus:outline-none focus:ring-2 focus:ring-fourth/40" />
                </label>
                <label className="block font-rocaTwoRegular">Съобщение
                  <textarea required rows="5" placeholder="Опиши накратко ситуацията и въпросите си..." value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} className="mt-1 w-full resize-y rounded-xl border border-fourth/30 px-4 py-3 font-rocaTwoThin focus:border-fourth focus:outline-none focus:ring-2 focus:ring-fourth/40" />
                </label>
                {status.type === "error" && <p role="alert" className="font-rocaTwoRegular text-red-700">{status.message}</p>}
                <Button type="submit" disabled={status.type === "submitting"} className="w-full">{status.type === "submitting" ? "Изпращане..." : "Изпрати съобщение"}</Button>
              </form>
            )}
          </div>
        </div>, document.body,
      )}
    </>
  );
};

const CalendlyBooking = ({ label = "Безплатен 15-минутен разговор" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCalendlyLoading, setIsCalendlyLoading] = useState(false);
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
        onClick={() => {
          setIsCalendlyLoading(true);
          setIsOpen(true);
        }}
      >
        {label}
      </Button>
      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/60 p-3 sm:p-6"
            onClick={() => setIsOpen(false)}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="anelia-calendly-title"
              className="flex h-[90dvh] max-h-[800px] w-full max-w-[600px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
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
              <div className="relative min-h-0 flex-1 bg-white">
                {isCalendlyLoading && (
                  <div
                    className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white"
                    role="status"
                    aria-label="Зареждане на календара"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute h-36 w-36 animate-ping rounded-full border border-primary/30"
                    />
                    <img
                      src={logoSmall}
                      alt=""
                      aria-hidden="true"
                      className="relative z-10 h-28 w-28 animate-pulse object-contain"
                    />
                  </div>
                )}
                <iframe
                  src={calendlyUrl.toString()}
                  title="Calendly – безплатен 15-минутен разговор с Анелия"
                  className="h-full w-full"
                  onLoad={() => setIsCalendlyLoading(false)}
                />
              </div>
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
    showBackButton={false}
  >
    <RevealOnScroll>
      <div className="relative z-20 mx-auto w-4/5 max-w-xs overflow-hidden rounded-[24px]">
        <img
          src={aneliaImage}
          alt="Анелия Такова"
          className="relative z-0 h-[280px] w-full origin-top scale-110 translate-y-4 rounded-[24px] object-cover object-top sm:h-[320px]"
        />
        <div className="absolute inset-x-0 bottom-16 z-30 flex justify-center">
          <CalendlyBooking label="ЗАПАЗИ ЧАС" />
        </div>
      </div>
    </RevealOnScroll>
    <ServiceQuote>
      <RevealOnScroll
        as="p"
        className="font-rocaTwoThin text-lg leading-7"
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
        за да се свързвам искрено с всички вас, които сте тук, в него! 
      </RevealOnScroll>
    </ServiceQuote>

    <RevealOnScroll as="section" className="mb-12 md:mb-16">
      <RevealOnScroll
        as="h2"
        className="mb-6 text-center font-rocaTwoBold text-2xl font-bold sm:text-3xl"
      >
        В работата си помагам на жените
        
      </RevealOnScroll>
      <RevealOnScroll
        className="mx-auto max-w-[600px] rounded-[32px] bg-third/80 p-5 shadow-sm md:p-10"
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
        Как можем да работим заедно?
      </RevealOnScroll>
      <RevealOnScroll
        as="p"
        className="mx-auto max-w-[600px] p-2 font-rocaTwoThin text-lg leading-relaxed"
        delay={120}
      >
        Ежедневно подкрепям семейства по пътя им като родители. Искрено вярвам,
        че пълноценният сън е стабилна основа в отглеждането на деца. Ще ти
        помогна да изградиш своята уверена и спокойна нагласа спрямо съня на
        детето.
      </RevealOnScroll>
      <RevealOnScroll
        as="p"
        className="mx-auto mt-4 max-w-[600px] p-2 font-rocaTwoThin text-lg leading-relaxed"
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
      <ul className="mx-auto grid max-w-[600px] grid-cols-1 gap-3 rounded-[32px] bg-secondary/75 p-5 md:grid-cols-2 md:gap-4 md:p-10">
        {reasonsToChoose.map(({ text, icon: Icon, href }, index) => (
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
      <ConsultationPackages />
    </RevealOnScroll>

    <RevealOnScroll as="section" className="mb-12 rounded-[32px] bg-third p-6 md:mb-16 md:p-10">
      <h2 className="mb-2 text-center font-rocaTwoBold text-2xl sm:text-3xl">Допълнителни консултации</h2>
      <p className="mb-6 text-center font-rocaTwoThin text-lg">За семейства, с които сме работили заедно в последните 30 дни</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/80 p-5">
          <span>Кратка консултация (30–60 мин.)</span><strong className="whitespace-nowrap text-xl text-fourth">25 €</strong>
        </div>
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/80 p-5">
          <span>Допълнителна седмица проследяване</span><strong className="whitespace-nowrap text-xl text-fourth">40 €</strong>
        </div>
      </div>
    </RevealOnScroll>

    <RevealOnScroll as="section" className="mb-12 md:mb-16">
      <h2 className="mb-6 text-center font-rocaTwoBold text-2xl sm:text-3xl">Отстъпки</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[32px] border-2 border-fourth/20 bg-white/60 p-6 text-center">
          <p className="mb-2 font-rocaTwoBold text-4xl text-fourth">10%</p>
          <h3 className="font-rocaTwoBold text-xl">За предишни клиенти</h3>
          <p className="mt-2 font-rocaTwoThin text-lg">Отстъпка за всяка следваща консултация.</p>
        </div>
        <div className="rounded-[32px] border-2 border-fourth/20 bg-white/60 p-6 text-center">
          <p className="mb-2 font-rocaTwoBold text-4xl text-fourth">2 = 1</p>
          <h3 className="font-rocaTwoBold text-xl">За близнаци</h3>
          <p className="mt-2 font-rocaTwoThin text-lg">Консултация за двете деца на цената за едно.</p>
        </div>
      </div>
    </RevealOnScroll>

    <RevealOnScroll as="section" className="rounded-[32px] bg-fourth p-5 text-center text-white shadow-xl md:p-10">
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
