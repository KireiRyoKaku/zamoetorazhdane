/** @type {import('tailwindcss').Config} */
export const content = ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"];
export const theme = {
  extend: {
    colors: {
      moetoRazhdanePurple: "#beb46d",
      moetoRazhdaneDarkGreen: "#626F47",
      moetoRazhdaneLightGreen: "#A4B465",
      moetoRazhdaneYellow: "#FFCF50",
      moetoRazhdaneWhite: "#FEFAE0",
      bodyBackground: {
        DEFAULT: "#626F47", // default color
      },
    },
    fontFamily: {
      makLight: ["MakLight", "sans-serif"],
      hitchHike: ["Hitch Hike", "sans-serif"],
      playfairDisplay: ["Playfair-Display", "sans-serif"],
      playfairDisplaySc: ['"Playfair Display SC"', "serif"],
      yanoneKaffeesatz: ['"Yanone Kaffeesatz"', "sans-serif"],
    },
    screens: {
      xs: "320px",
      sm: "360px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    borderRadius: {
      full: "100%",
    },
    dropShadow: {
      "2xl": "0.75rem 0.5rem #4e5f4c",
    },
    fontSize: {
      "2.5xl": "1.70rem",
    },
  },
};
export const plugins = [];
export const mode = "jit";
