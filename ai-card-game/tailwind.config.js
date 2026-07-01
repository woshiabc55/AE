/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        // 历史编年史·暗黑学术档案 调色板
        ink: {
          950: "#0E0B08", // 羊皮纸焦痕（主背景）
          900: "#15110D",
          800: "#1E1812",
          700: "#2A2118",
          600: "#3A2E20",
        },
        gold: {
          50: "#F5E9C8",
          100: "#E8D09A",
          200: "#D9B76A",
          300: "#C9A24B", // 陈年金（鎏金印章）
          400: "#B0832E",
          500: "#8C6420",
        },
        vermillion: {
          400: "#B04434",
          500: "#8B2E1F", // 朱砂批注
          600: "#6E2418",
        },
        bronze: {
          400: "#52725F",
          500: "#3E5C4D", // 氧化铜锈
          600: "#2E4739",
        },
        parchment: {
          100: "#F2E8D0",
          200: "#E8DCC0", // 羊皮纸奶油
          300: "#D4C49E",
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Noto Serif SC"', "serif"],
        mono: ['"JetBrains Mono"', '"Noto Sans Mono"', "monospace"],
      },
      boxShadow: {
        seal: "0 0 0 1px rgba(201,162,75,0.4), 0 4px 20px rgba(0,0,0,0.6)",
        "seal-hover": "0 0 0 1px rgba(201,162,75,0.8), 0 8px 32px rgba(201,162,75,0.2)",
        inset: "inset 0 2px 12px rgba(0,0,0,0.6)",
      },
      backgroundImage: {
        "parchment-grain":
          "radial-gradient(circle at 20% 30%, rgba(201,162,75,0.04) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(139,46,31,0.03) 0%, transparent 40%)",
        "gold-sheen":
          "linear-gradient(135deg, rgba(201,162,75,0) 0%, rgba(201,162,75,0.15) 50%, rgba(201,162,75,0) 100%)",
      },
      keyframes: {
        "ink-spread": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "60%": { opacity: "0.9" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "gold-thread": {
          "0%": { strokeDashoffset: "100", opacity: "0" },
          "40%": { opacity: "1" },
          "100%": { strokeDashoffset: "0", opacity: "1" },
        },
        "seal-press": {
          "0%": { transform: "scale(1.15)" },
          "50%": { transform: "scale(0.92)" },
          "100%": { transform: "scale(1)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "ink-spread": "ink-spread 0.5s ease-out",
        "gold-thread": "gold-thread 0.8s ease-out forwards",
        "seal-press": "seal-press 0.3s ease-out",
        "fade-up": "fade-up 0.4s ease-out",
      },
    },
  },
  plugins: [],
};
