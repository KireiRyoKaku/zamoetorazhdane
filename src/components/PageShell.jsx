import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ButtonLink } from "./Button";

const RevealSequenceContext = createContext(null);

export const RevealSequence = ({ children }) => {
  const observerRef = useRef(null);
  const callbacksRef = useRef(new Map());

  const register = useCallback((element, callback) => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const entering = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) =>
              a.target.compareDocumentPosition(b.target) &
              Node.DOCUMENT_POSITION_FOLLOWING
                ? -1
                : 1,
            );
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              callbacksRef.current.get(entry.target)?.(false, 0);
            }
          });
          entering.forEach((entry, index) => {
            callbacksRef.current.get(entry.target)?.(
              true,
              Math.min(index * 120, 360),
            );
          });
        },
        { threshold: 0 },
      );
    }

    callbacksRef.current.set(element, callback);
    observerRef.current.observe(element);
    return () => {
      observerRef.current?.unobserve(element);
      callbacksRef.current.delete(element);
    };
  }, []);

  useEffect(
    () => () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    },
    [],
  );

  return (
    <RevealSequenceContext.Provider value={register}>
      {children}
    </RevealSequenceContext.Provider>
  );
};

export const RevealOnScroll = ({
  as: Element = "div",
  children,
  className = "",
  delay,
  ...elementProps
}) => {
  const elementRef = useRef(null);
  const register = useContext(RevealSequenceContext);
  const [reveal, setReveal] = useState({ visible: false, delay: 0 });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      setReveal({ visible: true, delay: 0 });
      return undefined;
    }

    if (register) {
      return register(element, (visible, staggerDelay) => {
        setReveal({ visible, delay: visible ? (delay ?? staggerDelay) : 0 });
      });
    }

    const observer = new IntersectionObserver(
      ([entry]) =>
        setReveal({ visible: entry.isIntersecting, delay: delay ?? 0 }),
      { threshold: 0 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [delay, register]);

  return (
    <Element
      {...elementProps}
      ref={elementRef}
      className={`transition-[opacity,transform] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        reveal.visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
      style={{ transitionDelay: `${reveal.delay}ms` }}
    >
      {children}
    </Element>
  );
};

export const PageShell = ({
  title,
  intro,
  introClassName = "text-lg",
  introMarginClassName = "-mb-8",
  children,
  backState,
  revealHeader = false,
  showBackButton = true,
  className = "",
}) => (
  <main
    className={`min-h-screen bg-primary px-4 pb-16 pt-8 text-fourth ${className}`}
  >
    <div className="mx-auto max-w-5xl">
      {showBackButton &&
        (revealHeader ? (
          <RevealOnScroll className="mb-6 inline-block">
            <ButtonLink to="/" state={backState} variant="secondary">
              ← Начало
            </ButtonLink>
          </RevealOnScroll>
        ) : (
          <ButtonLink
            to="/"
            state={backState}
            variant="secondary"
            className="mb-6"
          >
            ← Начало
          </ButtonLink>
        ))}
      {title &&
        (revealHeader ? (
          <>
            <RevealOnScroll
              as="h1"
              className="mb-4 text-center font-rocaTwoBold text-3xl font-bold sm:text-5xl"
            >
              {title}
            </RevealOnScroll>
            {intro && (
              <RevealOnScroll
                as="p"
                delay={120}
                className={`mx-auto ${introMarginClassName} max-w-2xl text-center ${introClassName}`}
              >
                {intro}
              </RevealOnScroll>
            )}
          </>
        ) : (
          <>
            <h1 className="mb-4 text-center font-rocaTwoBold text-3xl font-bold sm:text-5xl">
              {title}
            </h1>
            {intro && (
              <p
                className={`mx-auto ${introMarginClassName} max-w-2xl text-center ${introClassName}`}
              >
                {intro}
              </p>
            )}
          </>
        ))}
      {children}
    </div>
  </main>
);

export const ServiceQuote = ({ children }) => (
  <RevealOnScroll
    as="section"
    className="relative z-10 -mt-6 mb-12 rounded-[32px] bg-fourth px-6 py-5 text-center text-white shadow-xl md:mb-16 md:px-14 md:py-8"
  >
    <span
      aria-hidden="true"
      className="pointer-events-none -mb-14 block select-none font-rocaTwoBold text-9xl leading-none text-secondary sm:-mb-20 sm:text-[11rem]"
    >
      “
    </span>
    <div className="relative mx-auto max-w-3xl font-rocaTwoThin text-lg leading-7">
      {children}
    </div>
    <span
      aria-hidden="true"
      className="pointer-events-none -mt-14 block rotate-180 select-none font-rocaTwoBold text-9xl leading-none text-secondary sm:-mt-20 sm:text-[11rem]"
    >
      “
    </span>
  </RevealOnScroll>
);

export const InfoCard = ({ title, price, badge, items = [], children }) => (
  <div className="relative flex flex-col rounded-[32px] bg-white p-7 shadow-xl">
    {badge && (
      <span className="absolute -top-3 right-6 rounded-3xl bg-secondary px-4 py-1 text-sm text-fourth">
        {badge}
      </span>
    )}
    <h2 className="mb-2 text-center font-rocaTwoBold text-2xl font-bold">
      {title}
    </h2>
    {price && (
      <p className="mb-4 p-5 text-center text-xl font-bold text-secondary">
        {price}
      </p>
    )}
    {children}
    {items.length > 0 && (
      <ul className="list-disc space-y-2 pl-5">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )}
  </div>
);

export const CtaLink = ({ href, to, children }) => (
  <ButtonLink
    href={href}
    to={to}
    target={to ? undefined : "_blank"}
    rel={to ? undefined : "noopener noreferrer"}
  >
    {children}
  </ButtonLink>
);
