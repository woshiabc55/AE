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
        // 工业陷阱主题色
        ink: {
          950: "#07080B",
          900: "#0A0B0F",
          800: "#0F1116",
          700: "#1B1F26",
          600: "#262B33",
          500: "#3A3F49",
          400: "#5B626D",
        },
        danger: {
          DEFAULT: "#FF2A2A",
          400: "#FF5757",
          500: "#FF2A2A",
          600: "#D11414",
        },
        neon: {
          DEFAULT: "#7CF6FF",
          400: "#A6FAFF",
          500: "#7CF6FF",
          600: "#3DD8E2",
        },
        warn: {
          DEFAULT: "#FF8A2A",
          500: "#FF8A2A",
        },
      },
      fontFamily: {
        display: ["Anton", "Bebas Neue", "Oswald", "Impact", "sans-serif"],
        cond: ["Bebas Neue", "Oswald", "Anton", "Impact", "sans-serif"],
        zh: ['"Noto Sans SC"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.06em",
        crunch: "-0.04em",
      },
      animation: {
        flicker: "flicker 4s linear infinite",
        scan: "scan 6s linear infinite",
        pulse2: "pulse2 2.4s ease-in-out infinite",
        marquee: "marquee 22s linear infinite",
        spin60: "spin 60s linear infinite",
        spin120: "spin 120s linear infinite",
        glitch: "glitch 2.6s steps(1) infinite",
        shake: "shake 0.6s ease-in-out infinite",
        type: "type 1.2s steps(2) infinite",
        bgpulse: "bgpulse 3s ease-in-out infinite",
        rise: "rise 1.4s cubic-bezier(.2,.8,.2,1) both",
      },
      keyframes: {
        flicker: {
          "0%,19%,21%,23%,25%,54%,56%,100%": { opacity: "1" },
          "20%,22%,24%,55%": { opacity: "0.45" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        pulse2: {
          "0%,100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.15)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        glitch: {
          "0%,90%,100%": { transform: "translate(0,0)" },
          "92%": { transform: "translate(-2px,1px)" },
          "94%": { transform: "translate(2px,-1px)" },
          "96%": { transform: "translate(-1px,2px)" },
        },
        shake: {
          "0%,100%": { transform: "translate(0,0) rotate(0)" },
          "25%": { transform: "translate(-0.5px,0.5px) rotate(-0.2deg)" },
          "50%": { transform: "translate(0.5px,-0.5px) rotate(0.2deg)" },
          "75%": { transform: "translate(-0.5px,-0.5px) rotate(-0.1deg)" },
        },
        type: {
          "0%,49%": { opacity: "1" },
          "50%,100%": { opacity: "0" },
        },
        bgpulse: {
          "0%,100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(40px) scale(0.96)", filter: "blur(8px)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)", filter: "blur(0)" },
        },
      },
    },
  },
  plugins: [],
};
