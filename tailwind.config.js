/** @type {import('tailwindcss').Config} */
export const content = ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"];
export const theme = {
  extend: {
    colors: {
      moetoRazhdanePurple: "#EDAFB8",
      moetoRazhdaneDarkGreen: "#B0C4B1",
      moetoRazhdaneLightGreen: "#DEDBD2",
      moetoRazhdaneYellow: "#F7E1D7",
      moetoRazhdaneWhite: "#4E5F4C",
      bodyBackground: {
        DEFAULT: "#EDAFB8", // default color
      },
      
    },
    fontFamily: {
      makLight: ["MakLight", "sans-serif"],
      hitchHike: ["Hitch Hike", "sans-serif"],
      playfairDisplay: ["Playfair-Display", "sans-serif"],
      playfairDisplaySc: ['"Playfair Display SC"', "serif"],
      yanoneKaffeesatz: ['"Yanone Kaffeesatz"', "sans-serif"],
      magnoliaScript: ['"Magnolia Script"', "cursive"],
      rocaTwoRegular: ['"Roca Two Regular"', "cursive"],
      rocaTwoBold: ['"Roca Two Bold"', "cursive"],
      rocaTwoThin: ['"Roca Two Thin"', "cursive"],
      rocaTwoItalic: ['"Roca Two Italic"', "cursive"],
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
