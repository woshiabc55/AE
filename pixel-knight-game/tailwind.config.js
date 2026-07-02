/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: { center: true },
    extend: {
      colors: {
        night: {
          950: "#05060c",
          900: "#0a0e1a",
          800: "#101a33",
          700: "#1a2540",
        },
        moon: {
          DEFAULT: "#cfe0f0",
          glow: "#8ab4c4",
        },
        ember: {
          DEFAULT: "#ff5733",
          fire: "#ff8a3c",
          core: "#ffd23f",
        },
        blood: "#c01828",
        ghoul: "#3ddc84",
        gold: "#ffd23f",
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', "monospace"],
        term: ['"VT323"', "monospace"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(255,138,60,0.45)",
        inset: "inset 0 -3px 0 rgba(0,0,0,0.45), inset 0 2px 0 rgba(255,255,255,0.2)",
      },
    },
  },
  plugins: [],
};
