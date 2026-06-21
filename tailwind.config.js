/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        lg: "2.5rem",
        xl: "3rem",
      },
    },
    extend: {
      colors: {
        // 学术期刊配色
        ink: {
          DEFAULT: "#1a1a1a",
          soft: "#2b2b2b",
          muted: "#5c5c5c",
          light: "#8a8a8a",
        },
        paper: {
          DEFAULT: "#f5f1e8",
          warm: "#efe9da",
          deep: "#e8e0cc",
          cream: "#faf6ec",
        },
        crimson: {
          DEFAULT: "#8b1e1e",
          dark: "#6e1717",
          light: "#a83232",
        },
        moss: {
          DEFAULT: "#2d4a3e",
          light: "#3d6453",
        },
        gold: {
          DEFAULT: "#a07c2c",
          light: "#c9a44a",
        },
      },
      fontFamily: {
        serif: [
          "Noto Serif SC",
          "Source Han Serif SC",
          "Songti SC",
          "SimSun",
          "serif",
        ],
        sans: [
          "Noto Sans SC",
          "PingFang SC",
          "Hiragino Sans GB",
          "Microsoft YaHei",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "Source Code Pro",
          "Menlo",
          "monospace",
        ],
      },
      fontSize: {
        "display": ["clamp(3rem, 8vw, 6rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        "hero": ["clamp(2rem, 5vw, 3.5rem)", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
      },
      letterSpacing: {
        "widest-xl": "0.4em",
      },
      maxWidth: {
        "prose-narrow": "38rem",
        "prose-wide": "68rem",
      },
      backgroundImage: {
        "paper-grain":
          "radial-gradient(circle at 20% 30%, rgba(139,30,30,0.02) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(45,74,62,0.02) 0%, transparent 50%)",
        "grid-fine":
          "linear-gradient(to right, rgba(26,26,26,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(26,26,26,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-24": "24px 24px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "draw-line": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 0.8s ease-out both",
        "draw-line": "draw-line 0.9s cubic-bezier(0.16, 1, 0.3, 1) both",
        "float-slow": "float-slow 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
