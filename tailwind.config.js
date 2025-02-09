/** @type {import('tailwindcss').Config} */
export const content = ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"];
export const theme = {
  extend: {
    colors: {
      moetoRazhdanePurple: "#9CAEEF",
      moetoRazhdaneDarkGreen: "#375241",
    },
    fontFamily: {
      makLight: ["MakLight", "sans-serif"],
      hitchHike: ["Hitch Hike", "sans-serif"],
      peaceSans: ["Peace Sans", "sans-serif"],
      montserrat: ["Montserrat", "sans-serif"],
      playfairDisplay: ["Playfair-Display", "sans-serif"],
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    borderRadius: {
      full: "100%",
    },
    dropShadow: {
      "2xl": "0.75rem 0.5rem #375241",
    },
  },
};
export const plugins = [];
export const mode = "jit";
