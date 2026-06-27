/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lawn: {
          50: "#e8f5df",
          100: "#c8e8b5",
          200: "#a3d78a",
          300: "#7ec65e",
          400: "#5ba848",
          500: "#3e7d2e",
          600: "#2e5f22",
          700: "#1f4217",
          800: "#142b0f",
        },
        sky: {
          300: "#a9ddf7",
          400: "#87ceeb",
          500: "#5caee3",
          600: "#3b82c4",
        },
        sun: {
          300: "#fff0a6",
          400: "#ffe066",
          500: "#ffd23f",
          600: "#ffb700",
        },
        plant: {
          light: "#a8e063",
          DEFAULT: "#66b032",
          dark: "#3a6b1f",
        },
        zombie: {
          skin: "#7a8a7a",
          suit: "#3d4b3d",
          dark: "#2f3a2f",
        },
        nut: {
          light: "#d49a5a",
          DEFAULT: "#a0662e",
          dark: "#5e3a15",
        },
        peashooter: {
          head: "#4a9c2d",
          leaf: "#66b032",
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', "monospace"],
        sans: ['"Noto Sans SC"', "sans-serif"],
      },
      boxShadow: {
        card: "0 6px 0 rgba(0,0,0,0.25)",
        hud: "0 4px 0 rgba(0,0,0,0.2)",
      },
      animation: {
        bob: "bob 1.2s ease-in-out infinite",
        float: "float 2.2s ease-in-out infinite",
        wiggle: "wiggle 0.5s ease-in-out infinite",
        pulseSlow: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
      },
      keyframes: {
        bob: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(-3deg)" },
          "50%": { transform: "translateY(-8px) rotate(3deg)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(4deg)" },
        },
      },
    },
  },
  plugins: [],
};
