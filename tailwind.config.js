/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', "monospace"],
        mono: ['"Space Mono"', "ui-monospace", "monospace"],
      },
      colors: {
        void: "#06070C",
        ink: "#0A0C14",
        panel: "rgba(10, 12, 20, 0.55)",
        stroke: "rgba(255, 255, 255, 0.08)",
      },
      keyframes: {
        spin: {
          to: { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};
