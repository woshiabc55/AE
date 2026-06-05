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
        ark: {
          0: "#050810",
          1: "#0a0e1a",
          2: "#111a2e",
          3: "#1a2540",
          line: "#3a4458",
          lineSoft: "#232b3d",
          cyan: "#5ee3ff",
          amber: "#ff8a3d",
          gold: "#e8c477",
          violet: "#c15bff",
          silver: "#d6dee9",
          white: "#f2f5fa",
        },
      },
      fontFamily: {
        display: ["Orbitron", "Noto Sans SC", "sans-serif"],
        body: ["Rajdhani", "Noto Sans SC", "sans-serif"],
        mono: ["JetBrains Mono", "Orbitron", "monospace"],
      },
    },
  },
  plugins: [],
};
