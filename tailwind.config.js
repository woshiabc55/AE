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
        // 深夜黑场
        ink: {
          950: "#08080B",
          900: "#0B0B0E",
          800: "#13131A",
          700: "#1C1C24",
          600: "#262630",
          500: "#3A3A40",
          400: "#5A5A60",
          300: "#85858A",
        },
        // 牛皮纸米白
        paper: {
          50: "#F5F1E8",
          100: "#E8E1D4",
          200: "#D6CDBC",
          300: "#BFB39C",
        },
        // 场记板琥珀
        amber: {
          DEFAULT: "#D4A857",
          glow: "#E8C77B",
          deep: "#9C7B36",
        },
        // 胶片红印章
        reel: {
          DEFAULT: "#C8102E",
          deep: "#8A0A1E",
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        serif: ['"Lora"', "Georgia", "serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      letterSpacing: {
        widest2: "0.32em",
      },
      backgroundImage: {
        "film-grain":
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.04) 0px, transparent 1px), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.03) 0px, transparent 1px)",
        "vignette":
          "radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.6) 100%)",
        "reel-strip":
          "repeating-linear-gradient(90deg, #0B0B0E 0px, #0B0B0E 28px, #1C1C24 28px, #1C1C24 32px, #0B0B0E 32px, #0B0B0E 60px)",
      },
      keyframes: {
        "frame-rise": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "cursor-blink": {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        "marquee": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "shutter": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.96)" },
        },
      },
      animation: {
        "frame-rise": "frame-rise 0.6s ease-out forwards",
        "cursor-blink": "cursor-blink 1s steps(1) infinite",
        "marquee": "marquee 40s linear infinite",
        "shutter": "shutter 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
