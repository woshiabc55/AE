/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        void: {
          950: "#030407",
          900: "#05060a",
          800: "#0a0c14",
          700: "#11141f",
          600: "#1a1e2e",
        },
        resonance: {
          400: "#5fe0ff",
          500: "#3ad7ff",
          600: "#1bb8e6",
        },
        echo: {
          400: "#ffe48a",
          500: "#ffd86b",
          600: "#e6b73f",
        },
        shadow: {
          400: "#9a63ff",
          500: "#7a3bff",
          600: "#5d22d6",
        },
        warn: {
          500: "#ff3b5c",
        },
        rift: {
          500: "#ff5be3",
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', "monospace"],
        term: ['"VT323"', "monospace"],
      },
      boxShadow: {
        pixel: "inset 0 -3px 0 rgba(0,0,0,0.55), inset 0 2px 0 rgba(255,255,255,0.18)",
        glowReso: "0 0 18px rgba(58,215,255,0.45)",
        glowEcho: "0 0 18px rgba(255,216,107,0.5)",
        glowRift: "0 0 22px rgba(255,91,227,0.5)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        flicker: "flicker 2.4s linear infinite",
        "float-slow": "floatSlow 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        flicker: {
          "0%,18%,22%,25%,53%,57%,100%": { opacity: "1" },
          "20%,24%,55%": { opacity: "0.4" },
        },
        floatSlow: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};
