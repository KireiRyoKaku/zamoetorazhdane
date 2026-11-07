import React from "react";

const LoadingSpinner = ({
  size = "md",
  color = "green",
  text = "Зареждане...",
}) => {
  // Size classes
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  // Color classes
  const colorClasses = {
    green: "border-primary border-t-primary",
    pink: "border-secondary border-t-secondary",
    yellow: "border-third border-t-primary",
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div
        className={` ${sizeClasses[size] || sizeClasses.md} ${colorClasses[color] || colorClasses.green} animate-spin rounded-full border-4`}
      ></div>
      {text && <p className="mt-3 text-lg text-fourth">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
