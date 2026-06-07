/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
    },
    extend: {
      colors: {
        xuan: {
          50: "#fbf6ea",
          100: "#f5ecd5",
          200: "#ead7a8",
          300: "#dcbf78",
          400: "#c9a04a",
          500: "#a87a2c",
        },
        mo: {
          900: "#0e0a07",
          800: "#1a1410",
          700: "#2a2018",
          600: "#3a2c20",
          500: "#5b4634",
        },
        zhu: {
          50: "#fbe9e6",
          100: "#f3c5bd",
          200: "#e08a7d",
          300: "#c8523f",
          400: "#a23420",
          500: "#7d1f10",
          600: "#5d160a",
        },
        qi: {
          400: "#6c8a73",
          500: "#4a6852",
          600: "#33493b",
        },
        jin: {
          300: "#e6c25a",
          400: "#c89a2a",
          500: "#9b7517",
        },
      },
      fontFamily: {
        xiao: ['"ZCOOL XiaoWei"', "serif"],
        serif: ['"Noto Serif SC"', "serif"],
        brush: ['"Ma Shan Zheng"', "cursive"],
        cang: ['"Long Cang"', "cursive"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      backgroundImage: {
        "paper-grain":
          "radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)",
        "paper-fade":
          "linear-gradient(180deg, rgba(245,236,213,0.0) 0%, rgba(245,236,213,0.6) 30%, rgba(245,236,213,0.95) 70%, rgba(245,236,213,1) 100%)",
        "mountain-mist":
          "linear-gradient(180deg, rgba(74,104,82,0.25) 0%, rgba(74,104,82,0.05) 50%, rgba(74,104,82,0) 100%)",
      },
      boxShadow: {
        seal: "0 1px 0 rgba(125,31,16,0.4), inset 0 0 0 1px rgba(255,255,255,0.2)",
        scroll: "0 30px 60px -30px rgba(58,44,32,0.45), 0 12px 30px -12px rgba(58,44,32,0.3)",
        ink: "0 2px 0 rgba(14,10,7,0.4)",
      },
      keyframes: {
        smoke: {
          "0%": { transform: "translateY(0) scale(1)", opacity: "0.5" },
          "50%": { opacity: "0.8" },
          "100%": { transform: "translateY(-120px) scale(1.6)", opacity: "0" },
        },
        stampDown: {
          "0%": { transform: "scale(1.4) rotate(-8deg)", opacity: "0" },
          "60%": { transform: "scale(0.95) rotate(2deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        fadeUp: {
          "0%": { transform: "translateY(28px) rotate(-1deg)", opacity: "0" },
          "100%": { transform: "translateY(0) rotate(0deg)", opacity: "1" },
        },
        flicker: {
          "0%,100%": { opacity: "0.85" },
          "50%": { opacity: "1" },
        },
        dash: {
          "0%": { transform: "translateX(0) rotate(0deg)" },
          "40%": { transform: "translateX(40vw) rotate(8deg)" },
          "60%": { transform: "translateX(45vw) rotate(-6deg)" },
          "100%": { transform: "translateX(80vw) rotate(2deg)" },
        },
        flagWave: {
          "0%,100%": { transform: "skewX(-6deg)" },
          "50%": { transform: "skewX(6deg)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.8)", opacity: "0.7" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        inkDrop: {
          "0%": { transform: "scale(0)", opacity: "1" },
          "80%": { transform: "scale(1.05)", opacity: "0.6" },
          "100%": { transform: "scale(1)", opacity: "0" },
        },
      },
      animation: {
        smoke: "smoke 6s linear infinite",
        stamp: "stampDown 0.6s cubic-bezier(.2,.8,.2,1) both",
        fadeUp: "fadeUp 0.7s cubic-bezier(.2,.8,.2,1) both",
        flicker: "flicker 1.6s ease-in-out infinite",
        dash: "dash 4s ease-in-out infinite",
        flag: "flagWave 2.4s ease-in-out infinite",
        ring: "pulseRing 1.8s ease-out infinite",
        ink: "inkDrop 1.2s ease-out forwards",
      },
    },
  },
  plugins: [],
};
