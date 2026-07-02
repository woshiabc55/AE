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
          950: "#070a08",
          900: "#0a0f0c",
          800: "#0d1410",
          700: "#141c16",
          600: "#1d2a1f",
        },
        tac: {
          400: "#7fe8d4",
          500: "#4fd6c2",
          600: "#2fae9c",
        },
        alpha: {
          400: "#5fa6ff",
          500: "#3a8cff",
          600: "#2a6ad6",
        },
        bravo: {
          400: "#ff6a82",
          500: "#ff3b5c",
          600: "#d62a45",
        },
        warn: {
          400: "#ffa55c",
          500: "#ff8a3d",
        },
        gold: {
          400: "#ffe48a",
          500: "#ffd86b",
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', "monospace"],
        term: ['"VT323"', "monospace"],
      },
      boxShadow: {
        pixel: "inset 0 -3px 0 rgba(0,0,0,0.55), inset 0 2px 0 rgba(255,255,255,0.18)",
        glowTac: "0 0 18px rgba(79,214,194,0.45)",
        glowAlpha: "0 0 16px rgba(58,140,255,0.5)",
        glowBravo: "0 0 16px rgba(255,59,92,0.5)",
        glowGold: "0 0 18px rgba(255,216,107,0.5)",
        glowWarn: "0 0 16px rgba(255,138,61,0.5)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        flicker: "flicker 2.4s linear infinite",
        "float-slow": "floatSlow 6s ease-in-out infinite",
        heartbeat: "heartbeat 1s ease-in-out infinite",
        "heartbeat-pulse": "heartbeatPulse 1s ease-in-out infinite",
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
        heartbeat: {
          "0%,100%": { opacity: "0.4" },
          "30%": { opacity: "1" },
          "45%": { opacity: "0.5" },
          "60%": { opacity: "0.95" },
        },
        heartbeatPulse: {
          "0%,100%": { transform: "scale(0.7)", opacity: "0.6" },
          "30%": { transform: "scale(1.15)", opacity: "1" },
          "45%": { transform: "scale(0.85)", opacity: "0.7" },
          "60%": { transform: "scale(1.1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
