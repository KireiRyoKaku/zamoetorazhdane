import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoSmall from "./assets/pictures/PregurnataLogoPinkNoText.png";

// Logo animation: change the duration for speed and the end offset to move the
// lettering's final position along the SVG track.
const LOGO_ANIMATION_DURATION_MS = 2000;
const LOGO_TEXT_END_OFFSET = 300;

const links = [
  { label: "ПРОГРАМА", path: "/program" },
  { label: "СЪБИТИЯ", path: "/events" },
  { label: "ЗА НАС", path: "/about" },
  { label: "ПАРТНЬОРИ", path: "/partners" },
  { label: "TEST", path: "/test" },
  {
    label: "ПРАВНА ИНФОРМАЦИЯ",
    path: "/privacy-policy",
    also: ["/terms-of-service", "/cookie-policy"],
  },
];

const PopupMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [homeIntroStage, setHomeIntroStage] = useState(
    location.pathname === "/" ? 0 : 2,
  );
  const logoTrackRef = useRef(null);
  const logoTextPathRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    setIsOpen(false);
    if (location.pathname !== "/") {
      setHomeIntroStage(2);
      return;
    }

    setHomeIntroStage(0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setHomeIntroStage(2);
      return;
    }
    const logoTimer = window.setTimeout(() => setHomeIntroStage(1), 100);
    const menuTimer = window.setTimeout(() => setHomeIntroStage(2), 3350);
    return () => {
      window.clearTimeout(logoTimer);
      window.clearTimeout(menuTimer);
    };
  }, [location.pathname]);

  const startLogoAnimation = useCallback(() => {
    const track = logoTrackRef.current;
    const textPath = logoTextPathRef.current;
    if (!track || !textPath) return;

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const endOffset = Math.min(LOGO_TEXT_END_OFFSET, track.getTotalLength());
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      textPath.setAttribute("startOffset", String(endOffset));
      return;
    }

    const startOffset = track.getTotalLength();
    const duration = LOGO_ANIMATION_DURATION_MS;
    let startTime = null;

    textPath.setAttribute("startOffset", String(startOffset));
    const step = (timestamp) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Replace this easing curve to change how the lettering accelerates.
      const eased =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      textPath.setAttribute(
        "startOffset",
        String(startOffset + (endOffset - startOffset) * eased),
      );

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(step);
      } else {
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    if (location.pathname !== "/") {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return undefined;
    }

    let cancelled = false;
    let timer;
    // Mobile browsers render SVG text/images before the font and logo have
    // loaded, so wait for both before animating.
    const assetsReady = Promise.all([
      document.fonts?.load('700px "Magnolia Script"') ?? Promise.resolve(),
      new Promise((resolve) => {
        const preload = new Image();
        preload.onload = preload.onerror = resolve;
        preload.src = logoSmall;
      }),
    ]).catch(() => undefined);
    assetsReady.then(() => {
      if (cancelled) return;
      timer = window.setTimeout(startLogoAnimation, 400);
    });
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [location.pathname, startLogoAnimation]);

  const isActive = (link) =>
    location.pathname === link.path ||
    link.also?.includes(location.pathname) ||
    (link.path === "/events" && location.pathname.startsWith("/events"));

  const go = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  // Link sizing: mobile py-3/text-xl controls row spacing and label size;
  // desktop text-base/lg:text-lg controls label size. Change the color classes
  // here to adjust normal/active link colors.
  const renderLink = (link, mobile) => (
    <button
      key={link.path}
      type="button"
      onClick={() => go(link.path)}
      disabled={isActive(link)}
      className={
        !mobile && link.path === "/program"
          ? "whitespace-nowrap rounded-2xl bg-third px-3 py-2 text-xs text-fourth shadow-sm transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          : `transition-colors duration-300 ${
              mobile
                ? "py-3 text-left text-xl"
                : "whitespace-nowrap text-base lg:text-lg"
            } ${
              isActive(link)
                ? "cursor-default text-fourth"
                : "text-fourth hover:text-fourth/30"
            }`
      }
    >
      {link.label}
    </button>
  );

  const half = Math.ceil(links.length / 2);

  // Header/nav sizing: adjust h-16 and md:h-20 for bar height, max-w-6xl
  // for content width, and px-4/md:px-8 for horizontal side padding. The
  // header classes control its fixed position/layer; bg-primary/drop-shadow-md
  // below adjust the bar background and shadow.
  return (
    <header className="fixed inset-x-0 top-0 z-[9999] font-rocaTwoRegular font-black">
      <div className="bg-white drop-shadow-md">
        <nav className="relative mx-auto grid h-16 w-full max-w-6xl grid-cols-2 items-center gap-4 px-4 md:h-20 md:px-8 lg:grid-cols-[minmax(0,1fr)_8rem_minmax(0,1fr)]">
          {/* Desktop link spacing and text sizing are controlled by gap-6/lg:gap-8
              and the text-base/lg:text-lg classes in renderLink. */}
          <div
            className={`col-start-1 hidden items-center justify-end gap-4 transition-opacity duration-1000 lg:flex lg:gap-6 ${
              homeIntroStage >= 2
                ? "opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            {links.slice(0, half).map((l) => renderLink(l, false))}
          </div>
          {!isOpen && (
            <div
              className={`col-start-1 flex justify-start transition-opacity duration-1000 lg:hidden ${
                homeIntroStage >= 2
                  ? "opacity-100"
                  : "pointer-events-none opacity-0"
              }`}
            >
              <button
                type="button"
                onClick={() => go("/program")}
                className="rounded-2xl bg-third px-3 py-2 text-xs text-fourth shadow-sm transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                ПРОГРАМА
              </button>
            </div>
          )}
          {/* Mobile title position is adjusted with left-4; its text size,
              font, and color are set on the button below. */}
          {/* <div className="absolute left-4 top-1/2 flex -translate-y-1/2 items-center md:hidden">
            <button
              type="button"
              onClick={() => go("/")}
              aria-label="Прегърната — Начало"
              className="whitespace-nowrap font-magnoliaScript text-xl text-fourth transition-opacity hover:opacity-70"
            >
              Прегърната
            </button>
          </div> */}

          {/* Center logo holder: w-24/md:w-32 sets its width; change the
              matching logo SVG height below to resize the artwork. Its top-0
              and h-full align the holder to the navigation bar. */}
          <div
            className={`absolute left-1/2 top-0 z-10 h-full w-24 -translate-x-1/2 transition-opacity duration-1000 md:w-32 ${
              homeIntroStage >= 1
                ? "opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            {/* White tab width/height and left offset are set with w-[170%],
                h-9/md:h-12, and -left-[35%]. The path controls its curve. */}
            <svg
              aria-hidden="true"
              viewBox="0 0 200 60"
              preserveAspectRatio="none"
              className="pointer-events-none absolute -left-[35%] top-full -mt-px h-9 w-[170%] fill-white md:h-12"
            >
              <path d="M0 0 C 55 0, 55 60, 100 60 C 145 60, 145 0, 200 0 Z" />
            </svg>
            {/* Adjust top-4 to raise/lower the logo within its tab. */}
            <button
              type="button"
              onClick={() => {
                if (location.pathname === "/") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setIsOpen(false);
                  return;
                }
                go("/");
              }}
              aria-label="Начало"
              className="absolute left-1/2 top-2 flex -translate-x-1/2 items-center justify-center transition-opacity hover:opacity-70"
            >
              {/* Keep the viewBox matched to the source artwork; the height
                  classes set logo size at mobile and desktop breakpoints. */}
              <svg
                aria-hidden="true"
                viewBox="-370 -80 2253 2910"
                className="h-[4.5rem] w-auto overflow-visible md:h-24"
              >
                <defs>
                  {/* Change this path to adjust the route and length traveled
                      by the animated lettering. */}
                  <path
                    ref={logoTrackRef}
                    id="menu-logo-track"
                    d="M-990 1328.2L-600 1778.5A1393.7 1451.5 0 0 0 2150.9 1778.5L2150.9 656.6A1393.7 1451.5 0 0 0 1742.3 -370.6"
                  />
                </defs>
                {/* Image dimensions/coordinates align the imported logo to the
                    SVG artwork; adjust together only if the source artwork changes. */}
                <image
                  href={logoSmall}
                  x="0"
                  y="0"
                  width="1513"
                  height="2436"
                />
                {/* Adjust fill/fontFamily/fontSize to change lettering color,
                    typeface, and scale without changing the animation path. */}
                <text
                  className="text-secondary"
                  fill="currentColor"
                  fontFamily="Magnolia Script, cursive"
                  fontSize="700"
                  letterSpacing="100"
                >
                  {/* This text follows the path above; the end offset constant
                      controls its final position on that path. */}
                  <textPath
                    ref={logoTextPathRef}
                    href="#menu-logo-track"
                    startOffset="-9999"
                  >
                    Прегърната
                  </textPath>
                </text>
              </svg>
            </button>
          </div>

          <div
            className={`col-start-3 hidden items-center justify-start gap-4 transition-opacity duration-1000 lg:flex lg:gap-6 ${
              homeIntroStage >= 2
                ? "opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            {links.slice(half).map((l) => renderLink(l, false))}
          </div>
          <div
            className={`col-start-2 flex justify-end transition-opacity duration-1000 lg:hidden ${
              homeIntroStage >= 2
                ? "opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            {/* Button h-12/w-12 sets the tap target; icon h-6/w-6 sets its size.
                Adjust strokeWidth below for thicker/thinner lines. */}
            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              aria-label="Меню"
              aria-expanded={isOpen}
              className="flex h-12 w-12 items-center justify-center rounded-full hover:text-fourth/30"
            >
              <svg
                className="h-6 w-6 text-fourth"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isOpen ? "M6 6l12 12M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </nav>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${
            isOpen ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {/* max-h-[480px] must fit all links; duration-300 controls dropdown animation speed. */}
          {/* Adjust px-6 for menu side padding, pb-3/pt-6 for vertical padding,
              and py-3/text-xl in renderLink for row spacing and text size. */}
          <div className="flex flex-col divide-y divide-gray-200 px-6 pb-3 pt-6">
            {links.map((l) => renderLink(l, true))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default PopupMenu;
