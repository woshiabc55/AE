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
        display: ["Orbitron", "ui-sans-serif", "system-ui"],
        body: ["Rajdhani", "ui-sans-serif", "system-ui"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        space: {
          950: "#050510",
          900: "#0A0A14",
          800: "#0E0E1F",
          700: "#15152B",
          600: "#1E1B4B",
        },
        neon: {
          cyan: "#22D3EE",
          purple: "#A855F7",
          pink: "#F472B6",
          red: "#F43F5E",
          amber: "#FBBF24",
          green: "#34D399",
          blue: "#60A5FA",
          violet: "#E879F9",
          orange: "#FB923C",
        },
      },
      keyframes: {
        glow: {
          "0%, 100%": { textShadow: "0 0 18px rgba(168,85,247,0.7), 0 0 36px rgba(34,211,238,0.35)" },
          "50%": { textShadow: "0 0 28px rgba(34,211,238,0.85), 0 0 56px rgba(168,85,247,0.45)" },
        },
        floatY: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        popIn: {
          "0%": { opacity: "0", transform: "scale(0.85)" },
          "70%": { opacity: "1", transform: "scale(1.04)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        dashTrail: {
          "0%": { strokeDashoffset: "200" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      animation: {
        glow: "glow 3.5s ease-in-out infinite",
        floatY: "floatY 4s ease-in-out infinite",
        slideUp: "slideUp 0.5s ease-out forwards",
        popIn: "popIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        scanline: "scanline 6s linear infinite",
      },
    },
  },
  plugins: [],
};
