import React from "react";
import { Link } from "react-router-dom";

export const PageShell = ({ title, intro, children, backState }) => (
  <main className="min-h-screen bg-primary px-4 pb-16 pt-8 text-fourth">
    <div className="mx-auto max-w-5xl">
      <Link
        to="/"
        state={backState}
        className="mb-6 inline-block rounded-3xl bg-third px-6 py-2 font-rocaTwoRegular text-base font-black text-fourth"
      >
        ← Начало
      </Link>
      <h1 className="mb-4 text-center font-rocaTwoBold text-3xl font-bold sm:text-5xl">
        {title}
      </h1>
      {intro && (
        <p className="mx-auto mb-10 max-w-2xl text-center text-lg">{intro}</p>
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

export const CtaLink = ({ href, to, children }) => {
  const cls =
    "inline-block rounded-3xl bg-secondary px-8 py-2 font-rocaTwoRegular text-lg text-fourth";
  return to ? (
    <Link to={to} className={cls}>
      {children}
    </Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {children}
    </a>
  );
};
