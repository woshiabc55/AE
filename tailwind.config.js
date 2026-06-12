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
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        body: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
        script: ["Caveat", "cursive"],
      },
      colors: {
        paper: {
          50: "#FBF8F1",
          100: "#F4EFE6",
          200: "#E8E0D0",
          300: "#D9CFB8",
        },
        ink: {
          50: "#F5F2EB",
          400: "#7A7165",
          500: "#5A5246",
          700: "#2D2920",
          900: "#1A1814",
        },
        oxblood: {
          400: "#9C3030",
          500: "#7A1F1F",
          600: "#5A1414",
        },
        amber2: {
          400: "#D49242",
          500: "#B8741A",
          600: "#8E5712",
        },
        indigo2: {
          400: "#3A4E8A",
          500: "#1F2D5C",
          600: "#152043",
        },
        forest: {
          400: "#4A6B47",
          500: "#2F4A2D",
          600: "#1F3520",
        },
        plum: {
          400: "#7A3DAB",
          500: "#5A2A82",
          600: "#3F1D5C",
        },
        midnight: {
          900: "#0A0A12",
          800: "#12121C",
          700: "#1A1A28",
          600: "#252538",
        },
      },
      boxShadow: {
        paper: "0 1px 0 0 rgba(26,24,20,0.05), 0 8px 24px -12px rgba(26,24,20,0.15)",
        card: "0 1px 0 0 rgba(26,24,20,0.04), 0 4px 14px -4px rgba(26,24,20,0.12)",
        ink: "inset 0 0 0 1px rgba(26,24,20,0.85)",
        "ink-soft": "inset 0 0 0 1px rgba(26,24,20,0.18)",
      },
      keyframes: {
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        popIn: {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "70%": { opacity: "1", transform: "scale(1.02)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-2px) rotate(-0.4deg)" },
          "75%": { transform: "translateX(2px) rotate(0.4deg)" },
        },
      },
      animation: {
        slideUp: "slideUp 0.5s ease-out forwards",
        slideRight: "slideRight 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        popIn: "popIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        fadeIn: "fadeIn 0.4s ease-out forwards",
        shake: "shake 0.3s ease-in-out",
      },
    },
  },
  plugins: [],
};
