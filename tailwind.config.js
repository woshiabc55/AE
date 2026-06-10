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
        display: ['"Zen Maru Gothic"', '"Noto Sans SC"', "system-ui", "sans-serif"],
        body: ['"Noto Sans SC"', '"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', '"Fira Code"', "ui-monospace", "monospace"],
      },
      colors: {
        ink: {
          900: "#070A14",
          800: "#0B0F1A",
          700: "#101527",
          600: "#1A2236",
          500: "#252E47",
        },
        sakura: {
          50: "#FFF1F7",
          100: "#FFE3EE",
          200: "#FFC7DD",
          300: "#FFA8C8",
          400: "#FF7AB6",
          500: "#FF4D9D",
          600: "#E52D85",
        },
        butter: {
          200: "#FFEAB0",
          300: "#FFE089",
          400: "#FFD66B",
          500: "#F5C04A",
        },
        mist: {
          50: "#F4F6FB",
          100: "#E6E9F2",
          200: "#C9CFDE",
          300: "#9AA3B8",
          400: "#6B7591",
        },
        leaf: "#7CE3B5",
        sky: "#7CC0FF",
        flame: "#FF8B5C",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(7,10,20,0.06), 0 4px 16px rgba(7,10,20,0.08)",
        pop: "0 4px 0 0 rgba(7,10,20,0.9), 0 8px 24px rgba(7,10,20,0.18)",
        glow: "0 0 0 1px rgba(255,122,182,0.4), 0 0 24px rgba(255,122,182,0.35)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.3)",
      },
      backgroundImage: {
        grain:
          "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
        "grid-light":
          "linear-gradient(rgba(154,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(154,163,184,0.08) 1px, transparent 1px)",
        "sakura-glow":
          "radial-gradient(circle at 20% 10%, rgba(255,122,182,0.25), transparent 45%), radial-gradient(circle at 80% 90%, rgba(255,214,107,0.18), transparent 50%)",
        "ink-grain":
          "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        grain: "4px 4px",
        "grid-light": "32px 32px",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-10px) rotate(0.5deg)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255,122,182,0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(255,122,182,0)" },
        },
        riseIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-12px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        blink: {
          "0%, 92%, 100%": { transform: "scaleY(1)" },
          "96%": { transform: "scaleY(0.05)" },
        },
        breathe: {
          "0%, 100%": { transform: "translateY(0px) scale(1)" },
          "50%": { transform: "translateY(-3px) scale(1.01)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        pulseGlow: "pulseGlow 1.6s ease-out infinite",
        riseIn: "riseIn 0.5s cubic-bezier(0.2,0.7,0.2,1) both",
        slideIn: "slideIn 0.4s cubic-bezier(0.2,0.7,0.2,1) both",
        spinSlow: "spinSlow 20s linear infinite",
        blink: "blink 4s ease-in-out infinite",
        breathe: "breathe 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
