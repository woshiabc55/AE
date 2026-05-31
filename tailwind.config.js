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
        primary: {
          DEFAULT: "#1A3A2A",
          50: "#E8F0EC",
          100: "#D1E1D9",
          200: "#A3C3B3",
          300: "#75A58D",
          400: "#4D8A6A",
          500: "#1A3A2A",
          600: "#153220",
          700: "#102718",
          800: "#0B1C10",
          900: "#061108",
        },
        accent: {
          DEFAULT: "#D4A853",
          50: "#FBF5E8",
          100: "#F7EBCC",
          200: "#EFD799",
          300: "#E7C366",
          400: "#D4A853",
          500: "#C49338",
          600: "#A0752D",
          700: "#7C5923",
          800: "#583E18",
          900: "#34230E",
        },
        coral: {
          DEFAULT: "#E8734A",
          50: "#FDF0EB",
          100: "#FBDCD7",
          200: "#F7B9AF",
          300: "#F39687",
          400: "#E8734A",
          500: "#D55A2F",
          600: "#A84624",
          700: "#7C331A",
          800: "#502010",
          900: "#240D07",
        },
        surface: {
          DEFAULT: "#FAFAF7",
          50: "#FFFFFF",
          100: "#FAFAF7",
          200: "#F5F5F0",
          300: "#EAEAE3",
          400: "#D5D5CB",
        },
        mint: {
          DEFAULT: "#E8F0EC",
          50: "#F5FAF7",
          100: "#E8F0EC",
          200: "#D1E1D9",
          300: "#BAD2C6",
          400: "#A3C3B3",
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        body: ['"DM Sans"', "system-ui", "sans-serif"],
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out forwards",
        slideUp: "slideUp 0.5s ease-out forwards",
        flipCard: "flipCard 0.6s ease-in-out",
        "pulse-ring": "pulseRing 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        flipCard: {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(180deg)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.8)", opacity: "1" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      borderRadius: {
        pill: "9999px",
      },
      boxShadow: {
        card: "0 2px 12px rgba(26, 58, 42, 0.08)",
        "card-hover": "0 8px 24px rgba(26, 58, 42, 0.12)",
        "accent-glow": "0 0 20px rgba(212, 168, 83, 0.3)",
      },
    },
  },
  plugins: [],
};
