/** @type {import('tailwindcss').Config} */
export const content = ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"];
export const theme = {
  extend: {
    colors: {
      primary: "#d4dee0ff",   //bluish
      secondary: "#edafb8ff", //pinkish
      third: "#f7e1d7ff", //yellowisch 
      fourth: "#6c698dff",  //purplish
      white: "#ffffff",   //white
      "section-background": "#d4dee0ff",
      "banner-background": "#edafb8ff",
    },
    transitionDuration: {
      1500: "1500ms",
      2000: "2000ms",
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
      "2xl": "0 25px 25px rgb(0 0 0 / 0.15)",
    },
    fontSize: {
      "2.5xl": "1.70rem",
    },
  },
};
export const plugins = [];
export const mode = "jit";
