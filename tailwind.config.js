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
        ink: {
          950: "#05060f",
          900: "#0a0e27",
          800: "#101535",
          700: "#1a1f4a",
        },
        neon: {
          cyan: "#00d4ff",
          pink: "#ff6b9d",
          gold: "#ffd700",
          jade: "#00ffa3",
          violet: "#a855f7",
        },
      },
      fontFamily: {
        display: ['"Cinzel"', "serif"],
        serif: ['"Noto Serif SC"', "serif"],
        sans: ['"Noto Sans SC"', '"Inter"', "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "nebula":
          "radial-gradient(ellipse at 20% 20%, rgba(168,85,247,0.25), transparent 50%), radial-gradient(ellipse at 80% 30%, rgba(0,212,255,0.18), transparent 55%), radial-gradient(ellipse at 50% 80%, rgba(255,107,157,0.18), transparent 60%)",
        "grid":
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 12s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        "fade-in-up": "fadeInUp 0.6s ease-out both",
        "fade-in": "fadeIn 0.4s ease-out both",
        "scale-in": "scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) both",
        "spin-slow": "spin 18s linear infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseGlow: {
          "0%,100%": { boxShadow: "0 0 30px rgba(0,212,255,0.25)" },
          "50%": { boxShadow: "0 0 60px rgba(0,212,255,0.55)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
