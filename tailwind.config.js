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
        ink: "#0a0a0f",
        "ink-elev": "#14141c",
        "ink-deep": "#06060a",
        cyan: {
          DEFAULT: "#00d4ff",
          dim: "#0a8aaa",
        },
        crimson: {
          DEFAULT: "#ff2d4a",
          dim: "#aa1830",
        },
        paper: "#f5f1e8",
        ash: "#8a8a8a",
        line: "#2a2a35",
      },
      fontFamily: {
        display: ['"Bebas Neue"', "system-ui", "sans-serif"],
        kuaile: ['"ZCOOL KuaiLe"', '"Noto Serif SC"', "serif"],
        serif: ['"Noto Serif SC"', '"Shippori Mincho"', "serif"],
        mincho: ['"Shippori Mincho"', '"Noto Serif SC"', "serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      animation: {
        "dragon-breathe": "dragon-breathe 4s ease-in-out infinite",
        "tail-sway": "tail-sway 3s ease-in-out infinite",
        "scan-line": "scan-line 6s linear infinite",
        "glitch-x": "glitch-x 2.4s steps(1) infinite",
        "ken-burns": "ken-burns 18s ease-in-out infinite alternate",
        "flicker": "flicker 3s linear infinite",
        "seal-stamp": "seal-stamp 0.6s cubic-bezier(0.2, 1.2, 0.4, 1) forwards",
        "head-shake": "head-shake 0.18s linear infinite",
      },
      keyframes: {
        "dragon-breathe": {
          "0%, 100%": { transform: "scale(1)", filter: "drop-shadow(0 0 0 rgba(0,212,255,0.0))" },
          "50%": { transform: "scale(1.04)", filter: "drop-shadow(0 0 30px rgba(0,212,255,0.35))" },
        },
        "tail-sway": {
          "0%, 100%": { transform: "rotate(-3deg) translateY(0)" },
          "50%": { transform: "rotate(6deg) translateY(-6px)" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "glitch-x": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "20%": { transform: "translate(-1px, 1px)" },
          "40%": { transform: "translate(1px, -1px)" },
          "60%": { transform: "translate(-2px, 0)" },
          "80%": { transform: "translate(0, 1px)" },
        },
        "ken-burns": {
          "0%": { transform: "scale(1.05) translate(0, 0)" },
          "100%": { transform: "scale(1.18) translate(-2%, -1%)" },
        },
        "flicker": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.55 },
        },
        "seal-stamp": {
          "0%": { transform: "scale(2) rotate(-30deg)", opacity: 0 },
          "60%": { transform: "scale(0.95) rotate(-8deg)", opacity: 1 },
          "100%": { transform: "scale(1) rotate(-6deg)", opacity: 1 },
        },
        "head-shake": {
          "0%": { transform: "translate(0,0) rotate(0)" },
          "20%": { transform: "translate(2px,-1px) rotate(1deg)" },
          "40%": { transform: "translate(-2px,1px) rotate(-1deg)" },
          "60%": { transform: "translate(1px,1px) rotate(0.5deg)" },
          "80%": { transform: "translate(-1px,-1px) rotate(-0.5deg)" },
          "100%": { transform: "translate(0,0) rotate(0)" },
        },
      },
    },
  },
  plugins: [],
};
