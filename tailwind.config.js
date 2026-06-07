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
        iron: "#0A0E14",
        oxide: "#1A1410",
        trench: "#0F2A3D",
        cyan: "#1A4D6B",
        blood: "#E63946",
        rust: "#C95A2B",
        bronze: "#8B5A3C",
        patina: "#4A6741",
        sun: "#F4A261",
        bone: "#E8E8E8",
        fog: "#7A8B99",
        ash: "#6B5B73",
      },
      fontSize: {
        hero: ["240px", { lineHeight: "0.85", letterSpacing: "-0.02em" }],
        mega: ["320px", { lineHeight: "0.8", letterSpacing: "-0.04em" }],
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
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        lightleak: {
          "0%, 100%": { opacity: "0.3", transform: "translateX(0)" },
          "50%": { opacity: "0.6", transform: "translateX(20px)" },
        },
        glow: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
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
        marquee: "marquee 30s linear infinite",
        lightleak: "lightleak 6s ease-in-out infinite",
        glow: "glow 3s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
      },
      boxShadow: {
        "depth-1": "0 1px 2px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)",
        "depth-2": "0 1px 2px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.4), 0 12px 32px rgba(0,0,0,0.3)",
        "depth-3":
          "0 1px 2px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.4), 0 24px 64px rgba(0,0,0,0.5)",
        "depth-4":
          "0 1px 2px rgba(0,0,0,0.5), 0 12px 32px rgba(0,0,0,0.5), 0 40px 96px rgba(0,0,0,0.6)",
        "depth-5":
          "0 2px 4px rgba(0,0,0,0.5), 0 16px 48px rgba(0,0,0,0.5), 0 48px 128px rgba(0,0,0,0.7)",
        rust: "0 0 32px rgba(201, 90, 43, 0.4), 0 0 64px rgba(201, 90, 43, 0.2)",
        blood: "0 0 32px rgba(230, 57, 70, 0.5), 0 0 64px rgba(230, 57, 70, 0.2)",
        sun: "0 0 32px rgba(244, 162, 97, 0.5), 0 0 80px rgba(244, 162, 97, 0.3)",
        glass: "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.4)",
      },
      backgroundImage: {
        "rust-radial":
          "radial-gradient(ellipse 80% 60% at 30% 30%, rgba(201, 90, 43, 0.15), transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(139, 90, 60, 0.1), transparent 60%)",
        "metal-rust":
          "linear-gradient(135deg, rgba(201, 90, 43, 0.12) 0%, rgba(10, 14, 20, 0.6) 40%, rgba(139, 90, 60, 0.08) 100%)",
        "glass-dark":
          "linear-gradient(135deg, rgba(232, 232, 232, 0.04) 0%, rgba(10, 14, 20, 0.3) 100%)",
      },
    },
  },
  plugins: [],
};
