/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', "ui-sans-serif", "system-ui"],
        sans: ['"Inter"', "ui-sans-serif", "system-ui"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular"],
      },
      colors: {
        bg: "#0B0D10",
        panel: "#14171C",
        panel2: "#1A1E25",
        line: "#252A33",
        fg: "#E6E9EF",
        mute: "#8B93A7",
        dim: "#5B6478",
        mint: "#7CFFB2",
        rose: "#FF5DA2",
        amber: "#FFC857",
        sky: "#7CC8FF",
      },
      boxShadow: {
        inset1: "inset 0 1px 0 0 rgba(255,255,255,0.04)",
        glow: "0 0 0 1px rgba(124,255,178,0.4), 0 0 24px rgba(124,255,178,0.18)",
      },
      backgroundImage: {
        grid: "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
        scan: "repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 3px)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "draw-x": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(124,255,178,0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(124,255,178,0)" },
        },
        "blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
      animation: {
        "fade-in": "fade-in 360ms ease-out both",
        "draw-x": "draw-x 600ms ease-out both",
        "pulse-glow": "pulse-glow 1800ms ease-in-out infinite",
        "blink": "blink 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
