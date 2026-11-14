import React, { useEffect, useRef, useState } from "react";
import { ButtonLink } from "./Button";

export const RevealOnScroll = ({
  as: Element = "div",
  children,
  className = "",
  delay = 0,
  ...elementProps
}) => {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Element
      {...elementProps}
      ref={elementRef}
      className={`transition-[opacity,transform] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
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
}) => (
  <main className="min-h-screen bg-primary px-4 pb-16 pt-8 text-fourth">
    <div className="mx-auto max-w-5xl">
      {revealHeader ? (
        <RevealOnScroll className="mb-6 inline-block">
          <ButtonLink
            to="/"
            state={backState}
            variant="secondary"
          >
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
      )}
      {revealHeader ? (
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
      )}
      {children}
    </div>
  </main>
);

export const InfoCard = ({ title, price, badge, items = [], children }) => (
  <div className="relative flex flex-col rounded-[32px] bg-white p-7 shadow-xl">
    {badge && (
      <span className="absolute -top-3 right-6 rounded-3xl bg-secondary px-4 py-1 text-sm text-fourth">
        {badge}
      </span>
    )}
    <h2 className="mb-2 font-rocaTwoBold text-2xl font-bold">{title}</h2>
    {price && <p className="mb-4 text-xl font-bold">{price}</p>}
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
