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
        // 冷紫 → 暖金 渐变主题色（建木 → 朱雀门 色温曲线）
        ink: {
          950: "#0A0612",   // 深夜底色
          900: "#110B1F",
          800: "#1B1233",
          700: "#2A1B47",
          600: "#3A2A6B",   // 冷紫主色
          500: "#4F3E8A",
        },
        bronze: {
          400: "#C7A36A",
          500: "#A88652",
          600: "#7A5C2E",   // 青铜回纹
          700: "#5A4220",
          900: "#2E1F0E",
        },
        gold: {
          200: "#F2D89A",
          400: "#E3B85F",
          500: "#D4A24C",   // 暖金（朱雀门）
          600: "#B8862E",
        },
        core: {
          300: "#9ED1FF",
          400: "#7AB8FF",
          500: "#4FA8FF",   // 能量核心蓝
          600: "#2A7DD6",
        },
        jianmu: "#3A2A6B",   // 别名
        changan: "#D4A24C",  // 别名
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', '"Noto Serif SC"', "serif"],
        serif: ['"Noto Serif SC"', '"Cormorant Garamond"', "serif"],
        sans: ['"Noto Sans SC"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      letterSpacing: {
        widest2: "0.4em",
      },
      backgroundImage: {
        "jianmu-grad":
          "radial-gradient(ellipse at 20% 0%, rgba(79,62,138,0.55) 0%, rgba(11,6,18,0) 55%), linear-gradient(180deg, #0A0612 0%, #1B1233 50%, #110B1F 100%)",
        "changan-grad":
          "radial-gradient(ellipse at 80% 100%, rgba(212,162,76,0.45) 0%, rgba(11,6,18,0) 55%), linear-gradient(180deg, #110B1F 0%, #2A1B47 40%, #5A4220 100%)",
        "cloud-noise":
          "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(154,138,210,0.18) 0%, rgba(11,6,18,0) 70%)",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { opacity: "0.55", filter: "blur(0.5px)" },
          "50%": { opacity: "1", filter: "blur(0px)" },
        },
        ripple: {
          "0%": { transform: "scale(0.85)", opacity: "0.8" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        rise: {
          "0%": { transform: "translateY(24px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        sweep: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        breathe: "breathe 3.6s ease-in-out infinite",
        ripple: "ripple 2s ease-out infinite",
        rise: "rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) both",
        sweep: "sweep 2.4s linear infinite",
      },
    },
  },
  plugins: [],
};
