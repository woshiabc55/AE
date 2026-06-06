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
      fontFamily: {
        display: ['"Orbitron"', '"Bebas Neue"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        sans: ['"Inter"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          900: "#06060b",
          800: "#0a0a0f",
          700: "#11111a",
          600: "#1a1a26",
          500: "#252533",
        },
        neon: {
          pink: "#ff2d95",
          cyan: "#00f0ff",
          violet: "#9d4edd",
          yellow: "#ffd60a",
          green: "#39ff14",
        },
        ghost: "#fafafa",
      },
      boxShadow: {
        "neon-pink": "0 0 12px rgba(255, 45, 149, 0.6), 0 0 24px rgba(255, 45, 149, 0.3)",
        "neon-cyan": "0 0 12px rgba(0, 240, 255, 0.6), 0 0 24px rgba(0, 240, 255, 0.3)",
        "neon-violet": "0 0 12px rgba(157, 78, 221, 0.6), 0 0 24px rgba(157, 78, 221, 0.3)",
        "neon-yellow": "0 0 12px rgba(255, 214, 10, 0.6), 0 0 24px rgba(255, 214, 10, 0.3)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "scan-line": "scanLine 8s linear infinite",
        "pulse-glow": "pulseGlow 2.4s ease-in-out infinite",
        "marquee": "marquee 30s linear infinite",
        "blink": "blink 1.4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: 0.6 },
          "50%": { opacity: 1 },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.2 },
        },
      },
      backgroundImage: {
        "grid-neon": "linear-gradient(rgba(0, 240, 255, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.07) 1px, transparent 1px)",
        "radial-fade": "radial-gradient(circle at 50% 0%, rgba(255, 45, 149, 0.18) 0%, rgba(9, 9, 15, 0) 60%)",
      },
    },
  },
  plugins: [],
};
