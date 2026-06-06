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
        display: ['"Bebas Neue"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
        serif: ['"Noto Serif SC"', '"Cormorant Garamond"', "serif"],
      },
      colors: {
        abyss: "#050810",
        deep: "#0A1620",
        trench: "#0F2A3D",
        cyan: "#1A4D6B",
        blood: "#E63946",
        sun: "#F4A261",
        bone: "#E8E8E8",
        fog: "#7A8B99",
        ash: "#6B5B73",
        char: "#1A1A1A",
      },
      keyframes: {
        caustic: {
          "0%, 100%": { opacity: "0.4", transform: "translate(0,0) scale(1)" },
          "50%": { opacity: "0.9", transform: "translate(8px,-6px) scale(1.06)" },
        },
        bubble: {
          "0%": { transform: "translateY(0) scale(0.6)", opacity: "0" },
          "20%": { opacity: "0.8" },
          "100%": { transform: "translateY(-180px) scale(1.4)", opacity: "0" },
        },
        sediment: {
          "0%": { transform: "scale(0.2)", opacity: "0.9" },
          "70%": { transform: "scale(1.1)", opacity: "0.5" },
          "100%": { transform: "scale(1.4)", opacity: "0" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.92" },
        },
        rise: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        dust: {
          "0%": { transform: "translate(0,0)" },
          "100%": { transform: "translate(40px,-30px)" },
        },
      },
      animation: {
        caustic: "caustic 4s ease-in-out infinite",
        bubble: "bubble 6s ease-out infinite",
        sediment: "sediment 3s ease-out forwards",
        scan: "scan 8s linear infinite",
        flicker: "flicker 3s ease-in-out infinite",
        rise: "rise 0.9s ease-out forwards",
        dust: "dust 12s linear infinite",
      },
    },
  },
  plugins: [],
};
