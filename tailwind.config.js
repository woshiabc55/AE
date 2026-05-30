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
        qblue: {
          DEFAULT: '#1a3a6b',
          mid: '#3a6aaa',
          light: '#7aaad4',
          pale: '#a8c8e8',
        },
        ink: '#1a1a1a',
        paper: '#ffffff',
        'paper-warm': '#faf8f5',
        'grid-bg': '#f0f0f0',
      },
    },
  },
  plugins: [],
};
