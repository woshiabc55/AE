/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.5rem", lg: "2.5rem" },
    },
    extend: {
      colors: {
        ink: {
          950: "#06060c",
          900: "#0a0a12",
          850: "#0e0e1a",
          800: "#12121f",
          700: "#1a1a2b",
          600: "#24243a",
          500: "#33334d",
        },
        magenta: {
          DEFAULT: "#ff2e7e",
          soft: "#ff6ba6",
          deep: "#c4156a",
        },
        cyan: {
          DEFAULT: "#22e0d6",
          soft: "#6ff0e9",
          deep: "#0fa8a0",
        },
        rarity: {
          common: "#9aa3b2",
          rare: "#4d8dff",
          epic: "#b15cff",
          legendary: "#ffb547",
        },
      },
      fontFamily: {
        display: ['"Orbitron"', '"Noto Sans SC"', "sans-serif"],
        sans: ['"Noto Sans SC"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      boxShadow: {
        glow: "0 0 24px -4px rgba(255,46,126,0.55), 0 0 60px -20px rgba(34,224,214,0.35)",
        "glow-magenta": "0 0 30px -6px rgba(255,46,126,0.6)",
        "glow-cyan": "0 0 30px -6px rgba(34,224,214,0.5)",
        "inset-line": "inset 0 1px 0 0 rgba(255,255,255,0.06)",
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(circle at 50% 0%, rgba(255,46,126,0.16), transparent 60%)",
        "grid-faint":
          "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
      },
      keyframes: {
        floatY: {
          "0%,100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-26px,0)" },
        },
        floatY2: {
          "0%,100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(20px,18px,0) scale(1.06)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-130%) skewX(-18deg)" },
          "100%": { transform: "translateX(230%) skewX(-18deg)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(22px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        glowPulse: {
          "0%,100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        floatY: "floatY 9s ease-in-out infinite",
        floatY2: "floatY2 12s ease-in-out infinite",
        shimmer: "shimmer 1.1s ease-in-out",
        fadeUp: "fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both",
        fadeIn: "fadeIn 0.6s ease both",
        marquee: "marquee 40s linear infinite",
        glowPulse: "glowPulse 4s ease-in-out infinite",
        spinSlow: "spinSlow 26s linear infinite",
      },
    },
  },
  plugins: [],
};
