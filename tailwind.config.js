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
        serif: ['Noto Serif SC', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        porcelain: {
          white: '#e8e4d9',
          blue: '#1e3a5f',
          mid: '#2d5a8e',
          cream: '#f5f2ec',
        },
        archive: {
          bg: '#f0efed',
          grid: '#d4d2cf',
          text: '#1a1a1a',
          muted: '#999999',
        },
      },
    },
  },
  plugins: [],
};
