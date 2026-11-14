import React, { forwardRef } from "react";
import { Link } from "react-router-dom";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-3xl px-6 py-2 text-center font-rocaTwoRegular text-base font-bold shadow-lg transition-transform duration-700 ease-out hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fourth/60 motion-reduce:transition-none motion-reduce:hover:scale-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 max-[359px]:px-4 md:px-10 md:py-3 md:text-xl";

const buttonVariants = {
  primary: "bg-secondary text-white",
  secondary: "bg-third text-fourth",
};

export const buttonClassName = (variant = "primary", className = "") =>
  `${buttonBase} ${buttonVariants[variant]} ${className}`;

export const Button = forwardRef(
  ({ variant = "primary", className = "", type = "button", ...props }, ref) => (
    <button
      {...props}
      ref={ref}
      type={type}
      className={buttonClassName(variant, className)}
    />
  ),
);

export const ButtonLink = ({
  variant = "primary",
  className = "",
  to,
  href,
  ...props
}) =>
  to ? (
    <Link {...props} to={to} className={buttonClassName(variant, className)} />
  ) : (
    <a {...props} href={href} className={buttonClassName(variant, className)} />
  );
