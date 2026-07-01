/** @type {import('tailwindcss').Config} */
// 复用拼豆工坊的视觉语言（ink/ember 像素风），保证游戏 UI 风格统一
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: { center: true },
    extend: {
      colors: {
        ink: {
          900: "#0f0a1a", 800: "#1a1625", 700: "#241d33", 600: "#2f2640",
          500: "#3c3151", 400: "#5a4d72", 300: "#8a7da3", 200: "#b8aed0", 100: "#e6e0f5",
        },
        ember: { 500: "#ff6b35", 400: "#ff8a5b", 600: "#e8541c" },
        mint: { 500: "#4ecdc4", 400: "#6dd8d0", 600: "#3aa9a0" },
        sun: { 500: "#ffd23f", 400: "#ffdf6b" },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', "monospace"],
        mono: ['"JetBrains Mono"', "monospace"],
        sans: ['"Noto Sans SC"', "sans-serif"],
      },
      boxShadow: {
        panel: "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
        glow: "0 0 24px rgba(255,107,53,0.35)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "fade-in": "fadeIn 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
