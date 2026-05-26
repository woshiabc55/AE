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
        editor: {
          bg: '#1a1a2e',
          panel: '#16213e',
          border: '#0f3460',
          accent: '#00d4aa',
          input: '#0a0a1a',
        },
      },
    },
  },
  plugins: [],
};
