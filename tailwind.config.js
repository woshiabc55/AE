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
        void: "#050510",
        nebula: {
          deep: "#0a0a1f",
          purple: "#1a0f2e",
          cyan: "#0a1a2f",
        },
        star: {
          ember: "#ff4a2b",
          flare: "#ff8c42",
          core: "#ffd9a0",
          blue: "#3a6ea5",
          white: "#e8f0ff",
        },
        magma: {
          crust: "#2a0a05",
          flow: "#ff5a1f",
          glow: "#ffb347",
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "serif"],
        serif: ['"Noto Serif SC"', "serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "drift": "drift 20s linear infinite",
        "flicker": "flicker 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        drift: {
          "0%": { transform: "translateX(0) translateY(0)" },
          "50%": { transform: "translateX(20px) translateY(-10px)" },
          "100%": { transform: "translateX(0) translateY(0)" },
        },
        flicker: {
          "0%, 100%": { opacity: "0.85" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
