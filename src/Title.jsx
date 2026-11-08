import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoChevronBack,
  IoChevronForward,
  IoHeartCircle,
  IoLeafOutline,
  IoEarOutline,
  IoBonfire,
  IoRoseOutline,
  IoAccessibility,
  IoMoonOutline,
  IoRibbonOutline,
  IoCalendarOutline,
  IoVideocamOutline,
  IoPeopleOutline,
  IoPlay,
} from "react-icons/io5";
import { FaBrain } from "react-icons/fa6";
import { LuBaby } from "react-icons/lu";
import { PiBabyFill } from "react-icons/pi";
import { GiBabyFace, GiHeartOrgan } from "react-icons/gi";
import aneliaImage from "./assets/pictures/good/anelia-good-ench-edit.png";
import detskiSunImage from "./assets/pictures/good/detskisun.png";
import katyaImage from "./assets/pictures/good/katya-good2.png";
import katyaServicesHeroImage from "./assets/pictures/good/uslugiHeroAnelia.png";
import aneliaServicesHeroImage from "./assets/pictures/good/uslugiHeroKatya.png";
import logoSmall from "./assets/pictures/PregurnataLogoPinkNoText.png";
import Card from "./components/Card";
import { partnersAll } from "./partnerData";
import { API_URL } from "../utils/apiConfig.js";

const cycleWords = ["Прегърната", "видяна", "приета", "чута", "разбрана"];
const approachPrinciples = [
  {
    title: "Без осъждане и вина",
    description: "валиден е опитът и личното преживяване на всяка майка",
    icon: IoEarOutline,
  },
  {
    title: "Без сравнение и състезание",
    description: "перфектната майка не съществува и не я търсим сред нас",
    icon: IoHeartCircle,
  },
  {
    title: "Връзка с интуицията",
    description:
      "вътрешният глас е по-важен от всеки външен глас, дори този на специалиста",
    icon: IoRoseOutline,
  },
  {
    title: "Грижа и обич към себе си",
    description: "основна необходимост за съзнателната и присъстваща майка",
    icon: IoAccessibility,
  },
  {
    title: "Баланс между трудности и радости",
    description: "защото в майчинството има изобилно и от двете",
    icon: IoLeafOutline,
  },
  {
    title: "Атмосфера на спокойствие и сигурност",
    description:
      "заедно създаваме среда, в която всички емоции са добре дошли, а доверието е обща основа",
    icon: IoBonfire,
  },
];
const bgColor = "#f7e1d7ff";
const bannerBgColors = {
  approach: "primary",
  services: "secondary",
  podcast: "primary",
  merch: "fourth",
};
const bannerBgColorClasses = {
  primary: "!bg-primary",
  secondary: "!bg-secondary",
  third: "!bg-third",
  fourth: "!bg-fourth",
};
const bannerTopBgColorClasses = {
  third: "!bg-third",
  fourth: "!bg-fourth",
};
const HOME_SECTION_IDS = {
  hero: "home-hero",
  partners: "home-partners",
  specialists: "home-specialists",
  approach: "home-approach",
  approachContent: "home-approach-content",
  services: "home-services",
  individualServices: "home-individual-services",
  groupServices: "home-group-services",
  podcast: "home-podcast",
  merch: "home-merch",
  merchContent: "home-merch-content",
};

const PartnerTicker = ({ active, arcPathRef }) => {
  const orbitRef = useRef(null);
  const partnerRefs = useRef([]);
  const isPausedRef = useRef(false);

  useEffect(() => {
    if (!active) return undefined;

    const orbit = orbitRef.current;
    if (!orbit) return undefined;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const duration = 24000;
    let frameId;
    let elapsed = 0;
    let previousTime;

    const positionPartners = (time) => {
      const orbitBounds = orbit.getBoundingClientRect();
      const { width } = orbitBounds;
      const isMobile = width < 768;
      const arcPath = arcPathRef.current;
      const svgMatrix = arcPath ? arcPath.getScreenCTM() : undefined;
      const svgPoint =
        svgMatrix && arcPath
          ? arcPath.ownerSVGElement.createSVGPoint()
          : undefined;
      const partnerCount = partnersAll.length;
      // Fraction of the loop spent crossing the screen; the rest is off-screen spacing
      const crossing = isMobile ? 0.36 : 0.5;
      const belowLine = isMobile ? 36 : 60;

      partnerRefs.current.forEach((partnerElement, index) => {
        if (!partnerElement) return;

        const progress = prefersReducedMotion
          ? ((index + 1) / (partnerCount + 1)) * crossing
          : (elapsed / duration + index / partnerCount) % 1;
        let x = width / 2;
        let y = 0;
        let visibility = 0;

        if (svgPoint && svgMatrix) {
          // Constant speed, right to left along the hero curve, just outside the edges at both ends
          const travel = Math.min(1, progress / crossing);
          const arcProgress = 1.12 - travel * 1.24;
          svgPoint.x = arcProgress * 100;
          svgPoint.y = 200 * arcProgress * (1 - arcProgress);
          const point = svgPoint.matrixTransform(svgMatrix);
          x = point.x - orbitBounds.left;
          // The curve is steeper near the edges, so push logos further down there to keep clear of it
          const edge = Math.min(1, Math.abs(2 * arcProgress - 1));
          y = point.y - orbitBounds.top + belowLine * (1 + 0.8 * edge * edge);
          visibility = progress >= crossing ? 0 : 1;
        }

        partnerElement.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        partnerElement.style.opacity = String(visibility);
        partnerElement.style.pointerEvents = visibility === 0 ? "none" : "";
        partnerElement.inert = visibility === 0;
      });

      if (!prefersReducedMotion) {
        if (previousTime !== undefined && !isPausedRef.current) {
          elapsed += time - previousTime;
        }
        previousTime = time;
        frameId = window.requestAnimationFrame(positionPartners);
      }
    };

    const handleResize = () => {
      if (prefersReducedMotion) {
        positionPartners(performance.now());
      }
    };
    const handleOutsidePointerDown = (event) => {
      const section = orbit.closest("section");
      if (section && !section.contains(event.target)) {
        isPausedRef.current = false;
      }
    };
    window.addEventListener("resize", handleResize);
    document.addEventListener("pointerdown", handleOutsidePointerDown);
    frameId = window.requestAnimationFrame(positionPartners);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("pointerdown", handleOutsidePointerDown);
      window.cancelAnimationFrame(frameId);
    };
  }, [active]);

  const renderPartner = (partner, index, duplicate = false) => {
    return (
      <div
        key={`${partner.partnerName}-${duplicate ? "duplicate" : "original"}`}
        ref={(element) => {
          partnerRefs.current[index] = element;
        }}
        className="partner-ticker-item relative flex h-20 w-36 shrink-0 items-center justify-center"
      >
        <button
          type="button"
          aria-label={`Партньор: ${partner.partnerName}`}
          aria-describedby={`partner-description-${index}-${duplicate ? "duplicate" : "original"}`}
          tabIndex={duplicate ? -1 : undefined}
          className="flex h-full w-full items-center justify-center p-2"
        >
          <img
            src={partner.image}
            alt=""
            className="partner-ticker-logo max-h-full max-w-full object-contain"
          />
        </button>
        <div
          id={`partner-description-${index}-${duplicate ? "duplicate" : "original"}`}
          className="partner-ticker-popover absolute bottom-full left-1/2 z-50 w-60 -translate-x-1/2 rounded-xl bg-white p-4 text-left font-rocaTwoRegular text-fourth opacity-0 shadow-xl transition duration-200"
        >
          <h3 className="mb-1 font-magnoliaScript text-xl font-bold">
            {partner.partnerName}
          </h3>
          <p className="text-sm leading-relaxed">{partner.description}</p>
          <a
            href={partner.link}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={duplicate ? -1 : undefined}
            className="mt-3 inline-block text-sm font-bold text-fourth underline underline-offset-2"
          >
            Посети партньора
          </a>
        </div>
      </div>
    );
  };

  return (
    <section
      id={HOME_SECTION_IDS.partners}
      aria-label="Нашите партньори"
      className={`partner-ticker relative z-30 overflow-x-clip py-0 transition-opacity duration-300 ${
        active ? "is-active opacity-100" : "opacity-0"
      }`}
      onPointerOver={(event) => {
        if (event.pointerType === "touch") return;
        isPausedRef.current = Boolean(
          event.target.closest?.(".partner-ticker-item"),
        );
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "touch") return;
        isPausedRef.current = false;
      }}
      onPointerDown={(event) => {
        if (event.pointerType !== "touch") return;
        const button = event.target.closest?.("button");
        if (button) {
          isPausedRef.current = true;
          button.focus();
        }
      }}
      onFocusCapture={(event) => {
        if (event.target.matches?.(":focus-visible")) {
          isPausedRef.current = true;
        }
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          isPausedRef.current = false;
        }
      }}
    >
      <div ref={orbitRef} className="partner-ticker-orbit">
        {partnersAll.map((partner, index) => renderPartner(partner, index))}
      </div>
    </section>
  );
};

const BrainHeartIcon = ({ className, ...props }) => (
  <span
    className={`relative inline-block h-10 w-10 shrink-0 ${className ?? ""}`}
    {...props}
  >
    <FaBrain className="absolute -top-1 left-0 h-9 w-9 text-fourth" />
    <GiHeartOrgan className="absolute -bottom-1 right-0 h-8 w-8 text-secondary" />
  </span>
);

const MoonBabyIcon = ({ className, ...props }) => (
  <span
    className={`relative inline-block h-10 w-10 shrink-0 ${className ?? ""}`}
    {...props}
  >
    <IoMoonOutline className="absolute -top-1 left-0 h-9 w-9 text-fourth" />
    <PiBabyFill className="absolute -bottom-0 -right-1 h-8 w-8 text-secondary" />
  </span>
);

const serviceGroups = [
  {
    label: "Индивидуална подкрепа",
    items: [
      {
        title: "Сесии с психолог",
        icon: BrainHeartIcon,
        to: "/katya",
        cta: "Запази сесия",
        text: "1:1 работа с Катя, индивидуално пространство изцяло за ТЕБ и твоите емоции",
        boldDescription: "Катя",
      },
      {
        title: "Консултации по детски сън",
        icon: MoonBabyIcon,
        to: "/anelia",
        image: detskiSunImage,
        imageAlt: "Анелия",
        cta: "Запази предв. разговор",
        text: "1:1 работа с Анелия, на фокус са както нуждите на детето, така и твоите собствени ",
        boldDescription: "Анелия",
      },
      {
        title: "Менторство",
        icon: IoRibbonOutline,
        to: "/mentoring",
        cta: "Запази предв. разговор",
        text: "авторска програма на “Прегърната” за подкрепа по личния път към едно спокойно и хармонично майчинство",
      },
    ],
  },
  {
    label: "Групова подкрепа",
    items: [
      {
        title: "Събития",
        icon: IoCalendarOutline,
        to: "/events",
        cta: "Запиши се за събитие",
        text: "месечни срещи на живо в Пловдив и София, групово преживяване в кръг от съзнателни майки",
      },
      {
        title: "Онлайн срещи",
        icon: IoVideocamOutline,
        to: "/events?filter=online",
        cta: "Запиши се за събитие",
        text: "експертни лекции или разговори със специалист от мрежата на “Прегърната”",
      },
      {
        title: "Общност",
        icon: IoPeopleOutline,
        to: "/community",
        cta: "Последвай ни",
        text: "принадлежност, споделяне и взаимна подкрепа между съзнателни майки",
      },
    ],
  },
];

const SERVICE_LAYOUT = "stacked"; // Set to "carousel" to show one service at a time.

const ServiceCarousel = ({ label, items }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideVisible, setSlideVisible] = useState(false);
  const activeItem = items[activeIndex];

  useEffect(() => {
    let secondFrameId;
    const firstFrameId = window.requestAnimationFrame(() => {
      secondFrameId = window.requestAnimationFrame(() => setSlideVisible(true));
    });
    return () => {
      window.cancelAnimationFrame(firstFrameId);
      if (secondFrameId !== undefined) {
        window.cancelAnimationFrame(secondFrameId);
      }
    };
  }, [activeIndex]);

  const selectSlide = (index) => {
    if (index === activeIndex) return;
    setSlideVisible(false);
    setActiveIndex(index);
  };

  const showPrevious = () => {
    selectSlide(activeIndex === 0 ? items.length - 1 : activeIndex - 1);
  };

  const showNext = () => {
    selectSlide(activeIndex === items.length - 1 ? 0 : activeIndex + 1);
  };

  return (
    <div
      className="relative mx-auto w-full max-w-2xl"
      aria-label={`${label} услуги`}
    >
      <div className="w-full">
        <div
          key={activeItem.title}
          className={`w-full transform transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${
            slideVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0"
          }`}
        >
          <Card
            title={activeItem.title}
            icon={activeItem.icon}
            description={activeItem.text}
            to={activeItem.to}
            cta={activeItem.cta}
            imageAlt={activeItem.imageAlt}
            active={slideVisible}
            widthClassName="mx-auto w-[85%]"
          />
        </div>
      </div>
      <button
        type="button"
        onClick={showPrevious}
        aria-label="Предишна услуга"
        className="absolute left-2 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-primary/20 text-fourth transition-colors hover:bg-primary/40 sm:left-3 sm:h-12 sm:w-12"
      >
        <IoChevronBack className="text-2xl" />
      </button>
      <button
        type="button"
        onClick={showNext}
        aria-label="Следваща услуга"
        className="absolute right-2 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-primary/20 text-fourth transition-colors hover:bg-primary/40 sm:right-3 sm:h-12 sm:w-12"
      >
        <IoChevronForward className="text-2xl" />
      </button>
      <div
        className="mt-6 flex justify-center gap-2"
        aria-label="Избери услуга"
      >
        {items.map((item, index) => (
          <button
            key={item.title}
            type="button"
            onClick={() => selectSlide(index)}
            aria-label={`Покажи услуга: ${item.title}`}
            aria-current={activeIndex === index ? "true" : undefined}
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              activeIndex === index
                ? "scale-110 bg-primary"
                : "bg-secondary hover:bg-secondary"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const useRevealOnView = () => {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      setRevealed(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setRevealed(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const revealClass = `transition-[opacity,transform] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
    revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
  }`;
  return [ref, revealClass, revealed];
};

const StackedServiceCard = ({ item, index }) => {
  const [cardRef, cardReveal, isRevealed] = useRevealOnView();

  return (
    <div
      ref={cardRef}
      className={cardReveal}
      style={{ transitionDelay: `${360 + index * 180}ms` }}
    >
      <Card
        title={item.title}
        icon={item.icon}
        description={item.text}
        boldDescription={item.boldDescription}
        to={item.to}
        cta={item.cta}
        imageAlt={item.imageAlt}
        active={isRevealed}
        widthClassName="mx-auto w-full max-w-2xl"
      />
    </div>
  );
};

const ServicePresentation = ({ label, items }) => {
  if (SERVICE_LAYOUT === "carousel") {
    return <ServiceCarousel label={label} items={items} />;
  }

  return (
    <div className="space-y-8">
      {items.map((item, index) => (
        <StackedServiceCard key={item.title} item={item} index={index} />
      ))}
    </div>
  );
};

const ApproachPrincipleCard = ({
  title,
  description,
  icon: Icon,
  revealDelay = 0,
}) => {
  const [cardRef, cardReveal] = useRevealOnView();

  return (
    <article
      ref={cardRef}
      style={{ transitionDelay: `${revealDelay}ms` }}
      className={`flex min-h-[200px] flex-col items-center rounded-2xl bg-white/80 p-5 text-center shadow-sm md:p-6 ${cardReveal}`}
    >
      <div className="w-full">
        <div className="mb-2 flex flex-col items-center gap-3">
          <div className={`-mt-4 mb-2 flex justify-center pt-6`}>
            <Icon className="h-8 w-8 text-secondary" aria-hidden="true" />
          </div>
          <h3 className="font-rocaTwoBold text-xl font-bold leading-tight md:text-2xl">
            {title}
          </h3>
        </div>
        <p className="font-rocaTwoThin text-lg leading-relaxed">
          {description}
        </p>
      </div>
    </article>
  );
};

const SectionBanner = ({
  id,
  title,
  subtitle,
  backgroundColor,
  topBackgroundColor,
  titleClassName = "text-4xl sm:text-5xl md:text-7xl",
  subtitleClassName = "text-lg sm:text-xl md:text-2xl",
}) => {
  const [bannerRef, bannerReveal] = useRevealOnView();
  const hasSubtitle = Boolean(subtitle);

  return (
    <div className="relative">
      {topBackgroundColor && (
        <div
          aria-hidden="true"
          className={`absolute inset-x-0 top-0 h-8 ${bannerTopBgColorClasses[topBackgroundColor]}`}
        />
      )}
      <section
        ref={bannerRef}
        id={id}
        aria-labelledby={`${id}-heading`}
        aria-describedby={hasSubtitle ? `${id}-subtitle` : undefined}
        className={`services-hero-band relative left-1/2 z-30 flex w-screen -translate-x-1/2 flex-col items-center justify-center gap-1 overflow-hidden rounded-[2rem] ${hasSubtitle ? "h-auto min-h-[220px] py-6 md:min-h-[300px] md:py-10" : "h-[220px] md:h-[300px]"} ${bannerBgColorClasses[backgroundColor]} ${bannerReveal}`}
      >
        <h2
          id={`${id}-heading`}
          className={`w-full px-4 text-center font-magnoliaScript leading-tight text-white ${titleClassName}`}
        >
          {title}
        </h2>
        {hasSubtitle && (
          <p
            id={`${id}-subtitle`}
            className={`max-w-3xl px-6 text-center font-rocaTwoRegular leading-snug text-white ${subtitleClassName}`}
          >
            {subtitle}
          </p>
        )}
      </section>
    </div>
  );
};

const PodcastEpisodeCard = ({ episode, index }) => {
  const [cardRef, cardReveal] = useRevealOnView();

  return (
    <article
      ref={cardRef}
      className={`flex h-full flex-col overflow-hidden rounded-[2rem] bg-white/80 text-left shadow-sm ${cardReveal}`}
      style={{ transitionDelay: `${index * 140}ms` }}
    >
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex items-center gap-3">
          <img
            src={logoSmall}
            alt="Лого на Прегърната"
            className="h-14 w-14 shrink-0 rounded-xl bg-white object-contain p-1"
          />
          <p className="font-rocaTwoRegular text-sm text-fourth/65">
            {[episode.publishedAt, episode.duration]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
        <h3 className="mt-2 font-rocaTwoBold text-xl font-bold leading-tight md:text-2xl">
          {episode.title}
        </h3>
        {episode.description && (
          <p
            className="mt-3 font-rocaTwoThin text-lg leading-relaxed text-fourth/80"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 4,
              overflow: "hidden",
            }}
          >
            {episode.description}
          </p>
        )}
        <a
          href={episode.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-3xl bg-secondary px-6 py-3 text-center font-rocaTwoRegular text-base text-white transition-colors duration-300 hover:bg-fourth"
          aria-label={`Слушай епизода „${episode.title}“ в Spotify`}
        >
          <IoPlay aria-hidden="true" className="h-4 w-4 shrink-0" />
          Слушай в Spotify
        </a>
      </div>
    </article>
  );
};

const PodcastEpisodes = () => {
  const [episodes, setEpisodes] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    const loadEpisodes = async () => {
      try {
        const response = await fetch(`${API_URL}/podcast-episodes`);
        if (!response.ok) {
          throw new Error(
            `Podcast feed request failed with HTTP ${response.status}`,
          );
        }

        const data = await response.json();
        if (!Array.isArray(data.episodes) || data.episodes.length === 0) {
          throw new Error("Podcast feed returned no episodes");
        }

        if (!cancelled) {
          setEpisodes(data.episodes.slice(0, 3));
          setStatus("loaded");
        }
      } catch (error) {
        console.error("Failed to load podcast episodes:", error);
        if (!cancelled) setStatus("error");
      }
    };

    loadEpisodes();
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading") {
    return (
      <p
        className="py-12 text-center font-rocaTwoRegular text-lg text-fourth/75"
        role="status"
      >
        Зареждаме последните епизоди…
      </p>
    );
  }

  if (status === "error") {
    return (
      <div className="py-12 text-center">
        <p className="font-rocaTwoRegular text-lg text-fourth/75" role="alert">
          Епизодите не могат да бъдат заредени в момента.
        </p>
        <a
          href="https://open.spotify.com/show/1RFiM8DDswRJohQiczd4R7"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex min-h-12 items-center justify-center rounded-3xl bg-secondary px-6 py-3 font-rocaTwoRegular text-white transition-colors duration-300 hover:bg-fourth"
        >
          Отвори подкаста в Spotify
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3">
      {episodes.map((episode, index) => (
        <PodcastEpisodeCard key={episode.id} episode={episode} index={index} />
      ))}
    </div>
  );
};

const Title = () => {
  const navigate = useNavigate();
  const [specialistsHeadingRef, specialistsHeadingReveal] = useRevealOnView();
  const [katyaCardRef, katyaCardReveal] = useRevealOnView();
  const [profileDividerRef, profileDividerReveal] = useRevealOnView();
  const [aneliaCardRef, aneliaCardReveal] = useRevealOnView();
  const [approachContentRef, approachContentReveal] = useRevealOnView();
  const [approachClosingRef, approachClosingReveal] = useRevealOnView();
  const [individualIntroRef, individualIntroReveal] = useRevealOnView();
  const [individualHeadingRef, individualHeadingReveal] = useRevealOnView();
  const [groupHeadingRef, groupHeadingReveal] = useRevealOnView();
  const [podcastIntroRef, podcastIntroReveal] = useRevealOnView();
  const [merchIntroRef, merchIntroReveal] = useRevealOnView();
  const [merchClosingRef, merchClosingReveal] = useRevealOnView();
  const [servicesSectionRef, servicesBannerReveal] = useRevealOnView();
  const [isVisible, setIsVisible] = useState(true);
  const [heroTextVisible, setHeroTextVisible] = useState(false);
  const [heroImageVisible, setHeroImageVisible] = useState(false);
  const [partnerTickerVisible, setPartnerTickerVisible] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);

  const arcPathRef = useRef(null);

  useEffect(() => {
    setHeroTextVisible(true);
    setHeroImageVisible(true);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPartnerTickerVisible(true);
      arcPathRef.current?.setAttribute(
        "d",
        "M 0 0 Q 50 100 100 0 L 100 50 L 0 50 Z",
      );
    }
  }, []);

  useEffect(() => {
    const visibleDuration = wordIndex === 0 ? 4000 : 3000;
    let updateTimeout;
    const transitionTimeout = window.setTimeout(() => {
      setWordVisible(false);
      updateTimeout = window.setTimeout(() => {
        setWordIndex((previous) => (previous + 1) % cycleWords.length);
        setWordVisible(true);
      }, 750);
    }, visibleDuration);

    return () => {
      window.clearTimeout(transitionTimeout);
      window.clearTimeout(updateTimeout);
    };
  }, [wordIndex]);

  useEffect(() => {
    if (!heroImageVisible) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      arcPathRef.current?.setAttribute(
        "d",
        "M 0 0 Q 50 100 100 0 L 100 50 L 0 50 Z",
      );
      setPartnerTickerVisible(true);
      return;
    }
    const timeout = setTimeout(() => {
      const start = performance.now();
      const duration = 600;
      const ease = (value) => 1 - Math.pow(1 - value, 3);
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = ease(progress);
        const sideY = 50 * (1 - eased);
        const controlY = 50 + 50 * eased;
        arcPathRef.current?.setAttribute(
          "d",
          `M 0 ${sideY} Q 50 ${controlY} 100 ${sideY} L 100 50 L 0 50 Z`,
        );
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          setPartnerTickerVisible(true);
        }
      };
      requestAnimationFrame(tick);
    }, 0);
    return () => clearTimeout(timeout);
  }, [heroImageVisible]);

  const handleClickServices = () => {
    servicesSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const handleClickPage = (path) => {
    setIsVisible(false);
    setTimeout(() => navigate(path), 300);
  };

  const secondButtonClass =
    "w-full rounded-3xl bg-secondary px-6 py-2 font-rocaTwoRegular text-base text-white sm:text-xl transition-colors duration-500 ease-in-out hover:bg-fourth";

  return (
    <main
      className={`title-section-background overflow-x-clip text-fourth transition-all duration-100 ease-in-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      style={{ "--title-bg-color": bgColor }}
    >
      <section
        id={HOME_SECTION_IDS.hero}
        aria-labelledby={`${HOME_SECTION_IDS.hero}-heading`}
        className="home-hero-background relative -mb-px flex flex-col overflow-hidden md:min-h-[min(75w,125svh)]"
      >
        <div
          className={`relative order-2 h-[50vw] bg-primary transition-opacity delay-[500ms] duration-700 ease-out motion-reduce:opacity-100 motion-reduce:transition-none md:absolute md:inset-0 md:order-none md:flex md:h-auto md:items-end md:bg-transparent ${
            heroImageVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={`${import.meta.env.BASE_URL}carousel/4.png`}
            alt="Прегърната подкрепа"
            className="h-full w-full object-cover object-bottom [-webkit-mask-image:linear-gradient(to_bottom,transparent_0,black_4rem)] [mask-image:linear-gradient(to_bottom,transparent_0,black_4rem)]"
          />
        </div>
        <div className="relative z-10 order-1 flex flex-col px-4 pb-2 pt-[calc(4rem+16vw)] md:min-h-[inherit] md:px-6 md:pb-[50vw] md:pt-32 lg:px-8">
          <div className="relative mx-auto flex w-full max-w-7xl flex-1 items-center justify-center md:mt-8 md:flex-none">
            <div className="flex w-full flex-col items-center justify-center gap-4 py-4 md:gap-3 md:py-0">
              {/* Hero title — stacked on mobile, side-by-side on sm+ */}
              <h1
                id={`${HOME_SECTION_IDS.hero}-heading`}
                className={`flex w-full flex-col items-center text-center leading-[1.05] transition-[opacity,transform] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
                  heroTextVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0"
                }`}
              >
                <span className="whitespace-nowrap text-3xl font-black tracking-[-0.02em] text-fourth">
                  За да бъдеш
                  {/* text-[clamp(2rem,9vw,5.5rem)] */}
                </span>
                <span className="flex h-[calc(clamp(2.25rem,10vw,6.5rem)*1.3)] w-full items-center justify-center">
                  <span
                    style={{
                      transition:
                        "opacity 600ms ease-in-out, transform 600ms ease-in-out",
                    }}
                    className={`block whitespace-nowrap leading-none text-secondary ${wordIndex === 0 ? "font-magnoliaScript text-4xl font-normal tracking-normal" : "text-4xl font-black tracking-[-0.02em]"} ${wordVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
                  >
                    {cycleWords[wordIndex]}
                  </span>
                </span>
                <span className="whitespace-nowrap text-3xl font-black tracking-[-0.02em] text-fourth">
                  тогава, когато <br />
                  ти е трудно сама <br />
                  да прегърнеш <br /> себе си.
                </span>
              </h1>
              {/* Description — full width on mobile, right column on desktop */}
              <p
                className={`w-full max-w-xl px-2 text-center text-base leading-relaxed text-fourth transition-[opacity,transform] delay-150 duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none md:max-w-3xl md:text-2xl ${
                  heroTextVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0"
                }`}
              >
                Грижа и специализирана подкрепа за менталното здраве на майките.
                {/* в общност, водена от
                експерти, чрез индивидуални и групови форми на подкрепа. */}
                {/* Помагаме им да се свържат отново със себе си в периоди на
                трансформация, лични или семейни предизвикателства на всеки етап
                от майчинството. */}
                {/* Подкрепяме жената да върви по своя път в майчинството със
                спокойствие и увереност, за да се почувства отново себе си, в и
                извън ролята си на майка. */}
              </p>

              <button
                type="button"
                onClick={handleClickServices}
                className={`rounded-3xl bg-secondary px-6 py-2 text-base font-bold text-white shadow-lg transition-[opacity,transform] delay-300 duration-700 ease-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-fourth/60 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none md:mt-4 md:px-10 md:py-3 md:text-xl ${
                  heroTextVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0"
                }`}
              >
                УСЛУГИ
              </button>
            </div>
          </div>
        </div>
      </section>
      <div className="home-partner-background relative z-10">
        <div className="pointer-events-none absolute inset-x-0 -top-[min(18vw,240px)] z-20 h-[calc(min(18vw,240px)+2px)]">
          <svg
            viewBox="0 0 100 50"
            preserveAspectRatio="none"
            className="h-full w-full"
            aria-hidden="true"
          >
            <path
              ref={arcPathRef}
              d="M 0 50 Q 50 50 100 50 L 100 50 L 0 50 Z"
              fill="var(--title-bg-color)"
            />
          </svg>
        </div>
        {/* <PartnerTicker active={partnerTickerVisible} arcPathRef={arcPathRef} /> */}
      </div>
      <section
        id={HOME_SECTION_IDS.specialists}
        aria-label="Специалисти"
        className="title-section-background relative z-10 w-full px-4 pb-6 pt-4 text-center md:px-6 md:pb-8 md:pt-2 lg:px-8"
      >
        <div className="mx-auto w-full max-w-6xl">
          <span
            ref={specialistsHeadingRef}
            className={`block w-full text-left text-5xl font-black tracking-[-0.02em] text-fourth md:w-1/2 ${specialistsHeadingReveal}`}
          >
            Здравей!
            <br />
            Ние сме...
            <br />
          </span>
          {/* Katya profile */}
          <div
            id="katya-card"
            ref={katyaCardRef}
            className={`relative mt-20 flex w-full scroll-mt-24 flex-col rounded-[2.5rem] border bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] md:mt-2 md:h-[380px] md:flex-row md:items-center lg:h-[420px] ${katyaCardReveal}`}
            style={{ transitionDelay: "180ms" }}
          >
            <img
              src={katyaImage}
              alt="Катя"
              className="pointer-events-none relative z-20 mx-auto -mt-24 h-72 w-auto object-contain md:absolute md:bottom-0 md:right-6 md:mt-0 md:h-[135%] md:w-auto md:max-w-[50%] md:object-bottom"
            />
            <div className="relative z-10 w-full space-y-3 p-6 text-center md:w-[55%] md:space-y-4 md:p-12 md:text-left">
              <div className="space-y-1 text-left">
                <h2 className="font-rocaTwoBold text-4xl font-black text-fourth md:text-6xl lg:text-7xl">
                  Катя
                </h2>
                <h3 className="mb-8 font-rocaTwoBold text-base font-black text-secondary md:text-xs">
                  психолог, емоционален ментор и психотерапевт в обучение
                </h3>
                <p className="mt-3 font-rocaTwoThin text-lg leading-relaxed text-fourth md:mt-4 md:text-base md:leading-relaxed">
                  Ще те подкрепя в това да се свържеш по-дълбоко със себе си, да
                  разпознаваш и приемаш емоциите си, да изграждаш лични граници
                  и вътрешна опора.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 pt-2 md:grid-cols-2 md:gap-4">
                <button
                  type="button"
                  onClick={() => handleClickPage("/katya")}
                  className={secondButtonClass}
                >
                  ЗАПАЗИ СЕСИЯ
                </button>
              </div>
            </div>
          </div>
          <div
            ref={profileDividerRef}
            aria-hidden="true"
            className={`flex justify-center py-2 md:py-4 ${profileDividerReveal}`}
            style={{ transitionDelay: "440ms" }}
          >
            <span className="font-rocaTwoRegular text-[9rem] leading-none text-secondary md:text-[12rem]">
              &amp;
            </span>
          </div>
          {/* Anelia profile */}
          <div
            ref={aneliaCardRef}
            className={`relative mt-8 flex w-full flex-col rounded-[2.5rem] border bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] md:mt-12 md:h-[380px] md:flex-row md:items-center lg:h-[420px] ${aneliaCardReveal}`}
            style={{ transitionDelay: "650ms" }}
          >
            {/* The source PNG has empty space on top, so crop it from the bottom with the aspect ratio. */}
            <img
              src={aneliaImage}
              alt="Anelia"
              className="pointer-events-none relative z-20 mx-auto -mt-24 h-72 w-auto object-contain md:absolute md:bottom-0 md:left-6 md:mt-0 md:h-[135%] md:w-auto md:max-w-[45%] md:object-bottom lg:left-16"
            />
            <div className="relative z-10 w-full space-y-3 p-6 text-center md:ml-auto md:w-[55%] md:space-y-4 md:p-12 md:p-8 md:text-left">
              <div className="space-y-1 text-left">
                <h2 className="font-rocaTwoBold text-4xl font-black text-fourth md:text-5xl md:text-6xl lg:text-7xl">
                  Анелия
                </h2>
                <h3 className="mb-8 font-rocaTwoBold text-base font-black text-secondary md:text-xs">
                  консултант по детски сън и психолог в обучение
                </h3>
                <p className="mt-3 font-rocaTwoThin text-lg leading-relaxed text-fourth md:mt-8 md:text-base">
                  Ще ти помогна да изградиш своята спокойна и уверена нагласа
                  спрямо съня на детето. Но освен това заедно ще погледнем и към
                  цялостната картина на майчинството, от която сънят е само един
                  щрих.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 pt-2 md:grid-cols-2 md:gap-4">
                <button
                  type="button"
                  onClick={() => handleClickPage("/anelia")}
                  className={secondButtonClass}
                >
                  ЗАПАЗИ КОНСУЛТАЦИЯ
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="flow-root bg-white">
        <SectionBanner
          id={HOME_SECTION_IDS.approach}
          title="Подход"
          backgroundColor={bannerBgColors.approach}
          topBackgroundColor="third"
          titleClassName="text-7xl md:text-8xl sm:text-6xl"
        />
        <section
          id={HOME_SECTION_IDS.approachContent}
          aria-labelledby={`${HOME_SECTION_IDS.approachContent}-heading`}
          className="relative z-10 w-full px-4 pb-6 pt-6 text-left md:px-6 md:py-8 lg:px-8"
        >
          <div className="mx-auto w-full max-w-7xl">
            <div ref={approachContentRef} className={approachContentReveal}>
              {/* <h2
                id={`${HOME_SECTION_IDS.approachContent}-heading`}
                className="mb-4 text-center font-magnoliaScript text-4xl md:text-5xl lg:text-6xl"
              >
                Прегърната
              </h2> */}
              <p className="mx-auto mb-6 mt-3 block w-11/12 px-4 text-left font-rocaTwoThin text-lg md:mb-3 md:text-lg md:leading-snug">
                Повечето услуги за родители са насочени към грижата за детето.
                Ние се грижим за майката, като ѝ помагаме да подкрепя себе си.
                Защото и тя има нужда да бъде прегърната в уязвимите периоди от
                майчинството.
              </p>
            </div>
            <div className="rounded-3xl bg-primary p-6 text-fourth md:p-8">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {approachPrinciples.map(
                  ({ title, description, icon }, index) => (
                    <ApproachPrincipleCard
                      icon={icon}
                      key={title}
                      revealDelay={180 + index * 140}
                      // number={index + 1}
                      title={title}
                      description={description}
                    />
                  ),
                )}
              </div>
            </div>
            <p
              ref={approachClosingRef}
              className={`mx-auto mt-6 block w-11/12 px-4 text-left font-rocaTwoThin text-lg md:mt-3 md:text-lg md:leading-snug ${approachClosingReveal}`}
            >
              Във всичко, което създаваме, на преден план е жената с нейното
              индивидуално преживяване в майчинството.
            </p>
          </div>
        </section>
      </div>
      <div className="relative z-10 flow-root">
        <section
          ref={servicesSectionRef}
          id={HOME_SECTION_IDS.services}
          aria-labelledby={`${HOME_SECTION_IDS.services}-heading`}
          className={`services-hero-band relative left-1/2 z-30 flex h-auto min-h-[220px] w-screen -translate-x-1/2 scroll-mt-24 flex-col items-center justify-center gap-1 overflow-hidden rounded-[2rem] py-6 ${bannerBgColorClasses[bannerBgColors.services]} md:min-h-[300px] md:py-10 ${servicesBannerReveal}`}
        >
          <h2
            id={`${HOME_SECTION_IDS.services}-heading`}
            className="relative z-10 w-full px-4 text-center font-magnoliaScript text-4xl leading-tight text-white sm:text-6xl md:text-8xl"
          >
            Услуги
          </h2>
          <p className="relative   z-30 max-w-2xl px-6 text-center text-base leading-snug text-white sm:text-lg md:text-xl">
            Индивидуални или групови възможности да бъдеш прегърната според
            твоите нужди в момента
          </p>
          {/* <img
            src={katyaServicesHeroImage}
            alt="Катя"
            className="absolute bottom-0 left-0 z-20 h-full w-auto max-w-[38vw] object-contain object-bottom"
          />
          <img
            src={aneliaServicesHeroImage}
            alt="Анелия"
            className="absolute bottom-0 right-0 z-20 h-full w-auto max-w-[38vw] object-contain object-bottom"
          /> */}
        </section>
      </div>
      <section
        id={HOME_SECTION_IDS.individualServices}
        aria-labelledby={`${HOME_SECTION_IDS.individualServices}-heading`}
        className="title-section-background relative z-0 scroll-mt-24 px-4 pb-10 pt-6 text-center md:px-6 md:pb-12 md:pt-8 lg:px-8"
      >
        <div>
          <div
            ref={individualIntroRef}
            className={`mx-auto w-full max-w-7xl ${individualIntroReveal}`}
          ></div>
          <div
            ref={individualHeadingRef}
            className={`mx-auto w-full max-w-7xl ${individualHeadingReveal}`}
            style={{ transitionDelay: "160ms" }}
          >
            <h2
              id={`${HOME_SECTION_IDS.individualServices}-heading`}
              className="text-3xl font-semibold leading-tight text-fourth md:text-5xl"
            >
              Индивидуална подкрепа
            </h2>
          </div>
          <div
            className={
              SERVICE_LAYOUT === "stacked"
                ? "mx-auto mt-10 w-full max-w-7xl rounded-[2rem] bg-fourth p-4 sm:p-8"
                : "mx-auto mt-10 w-full max-w-7xl"
            }
          >
            <ServicePresentation
              label={serviceGroups[0].label}
              items={serviceGroups[0].items}
            />
          </div>
        </div>
      </section>
      <section
        id={HOME_SECTION_IDS.groupServices}
        aria-labelledby={`${HOME_SECTION_IDS.groupServices}-heading`}
        className="title-section-background px-4 pb-6 pt-10 text-center md:px-6 md:pb-8 md:pt-12 lg:px-8"
      >
        <div className="mx-auto w-full max-w-7xl">
          <div ref={groupHeadingRef} className={groupHeadingReveal}>
            <h2
              id={`${HOME_SECTION_IDS.groupServices}-heading`}
              className="text-3xl font-semibold leading-tight text-fourth md:text-5xl"
            >
              Групова подкрепа
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-fourth/70 md:text-lg">
              в общност, водена от специалисти
            </p>
          </div>
          <div
            className={
              SERVICE_LAYOUT === "carousel"
                ? "mt-10"
                : "mt-10 rounded-[2rem] bg-fourth p-4 sm:p-8"
            }
          >
            <ServicePresentation
              label={serviceGroups[1].label}
              items={serviceGroups[1].items}
            />
          </div>
        </div>
      </section>
      <SectionBanner
        id={HOME_SECTION_IDS.podcast}
        title="Подкаст"
        backgroundColor={bannerBgColors.podcast}
        titleClassName="text-7xl md:text-8xl sm:text-6xl"
        subtitle="Подкаст за майки"
      />
      <section
        aria-labelledby={`${HOME_SECTION_IDS.podcast}-episodes-heading`}
        className="title-section-background px-4 pb-6 pt-6 md:px-6 md:py-8 lg:px-8"
      >
        <div
          ref={podcastIntroRef}
          className={`mx-auto w-full max-w-3xl px-4 text-left font-rocaTwoThin text-lg text-fourth ${podcastIntroReveal}`}
        >
          Тук ще ни чуете да говорим като специалисти, но и като майки по своя
          личен път. Независимо от това на кой етап от твоя път се намираш ти в
          момента, тук си на правилното място. Този подкаст е за жената. В и
          извън ролята й на майка.
        </div>
        <br />

        <h2
          id={`${HOME_SECTION_IDS.podcast}-episodes-heading`}
          className="sr-only"
        >
          Последни епизоди
        </h2>
        <PodcastEpisodes />
        <div className="mt-10 flex justify-center">
          <a
            href="https://open.spotify.com/show/1RFiM8DDswRJohQiczd4R7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-16 items-center justify-center rounded-3xl bg-secondary px-8 py-5 text-center font-rocaTwoRegular text-lg text-white shadow-md transition-colors duration-300 hover:bg-fourth md:px-12 md:text-2xl"
          >
            Абонирай се и чуй всички епизоди в Spotify
          </a>
        </div>
      </section>
      <div className="flow-root">
        <SectionBanner
          id={HOME_SECTION_IDS.merch}
          title="Прегърната близо до теб"
          backgroundColor={bannerBgColors.merch}
          titleClassName="text-4xl sm:text-5xl md:text-7xl"
          subtitle="мърч, джунджурий и други"
        />
        <section
          id={HOME_SECTION_IDS.merchContent}
          aria-labelledby={`${HOME_SECTION_IDS.merch}-heading`}
          className="relative z-10 w-full bg-white px-4 pb-[142px] pt-6 text-left md:px-6 md:pb-[198px] md:pt-8 lg:px-8"
        >
          <div className="mx-auto w-full max-w-7xl">
            <div ref={merchIntroRef} className={merchIntroReveal}>
              <p className="mx-auto mb-6 mt-3 block w-11/12 px-4 text-left font-rocaTwoThin text-lg md:mb-3 md:text-lg md:leading-snug">
                Повечето услуги за родители са насочени към грижата за детето.
                Ние се грижим за майката, като ѝ помагаме да подкрепя себе си.
                Защото и тя има нужда да бъде прегърната в уязвимите периоди от
                майчинството.
              </p>
            </div>

            <p
              ref={merchClosingRef}
              className={`mx-auto mt-6 block w-11/12 px-4 text-left font-rocaTwoThin text-lg md:mt-3 md:text-lg md:leading-snug ${merchClosingReveal}`}
            >
              Във всичко, което създаваме, на преден план е жената с нейното
              индивидуално преживяване в майчинството.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Title;
