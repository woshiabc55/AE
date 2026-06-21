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
        // 拼豆工坊调色板
        ink: {
          900: "#0f0f14", // 最深底色
          800: "#1a1a1f", // 主背景
          700: "#2d2d44", // 面板背景
          600: "#3a3a52", // 边框/分隔
          500: "#4a4a66", // 次级文字
          400: "#6b6b8a", // 弱化文字
        },
        cream: "#f4f1de", // 主文字米白
        coral: "#ff5e5b", // 珊瑚红
        mint: "#39e991", // 薄荷绿
        volt: "#ffd23f", // 电光黄
        aqua: "#3bceac", // 天蓝绿
        grape: "#9b5de5", // 紫罗兰
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', "monospace"],
        mono: ['"JetBrains Mono"', "monospace"],
        sans: ['"Noto Sans SC"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        // 拼豆立体凸起
        bead: "0 3px 0 0 rgba(0,0,0,0.45), 0 4px 8px rgba(0,0,0,0.35)",
        "bead-sm": "0 2px 0 0 rgba(0,0,0,0.45)",
        "bead-press": "0 1px 0 0 rgba(0,0,0,0.45)",
        glow: "0 0 16px rgba(57,233,145,0.45)",
        "glow-coral": "0 0 16px rgba(255,94,91,0.5)",
      },
      borderRadius: {
        bead: "8px",
      },
      backgroundImage: {
        "grid-dots":
          "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
        "noise":
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "blink": "blink 1.2s steps(2) infinite",
        "scan": "scan 6s linear infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.2" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
    },
  },
  plugins: [],
};
