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
    green: "border-moetoRazhdaneDarkGreen border-t-moetoRazhdaneLightGreen",
    pink: "border-moetoRazhdanePurple border-t-moetoRazhdanePurpleLighter",
    yellow: "border-moetoRazhdaneYellow border-t-moetoRazhdaneDarkGreen",
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div
        className={` ${sizeClasses[size] || sizeClasses.md} ${colorClasses[color] || colorClasses.green} animate-spin rounded-full border-4`}
      ></div>
      {text && <p className="mt-3 text-lg text-moetoRazhdaneWhite">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
