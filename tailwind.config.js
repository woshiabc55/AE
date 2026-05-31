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
        'neon-cyan': '#00ffd5',
        'neon-orange': '#ff6b35',
        'dark-bg': '#0a0a0f',
        'dark-surface': '#0d0d18',
        'dark-card': '#12121f',
        'dark-border': '#1a1a2e',
      },
      fontFamily: {
        'display': ['Orbitron', 'sans-serif'],
        'body': ['Noto Sans SC', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
