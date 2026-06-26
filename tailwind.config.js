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
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
      },
      colors: {
        canvas: {
          bg: '#0f1117',
          panel: '#1a1d27',
          border: '#2a2d37',
          hover: '#2f3240',
        },
        accent: {
          cyan: '#00e5ff',
          orange: '#ff6b6b',
        },
      },
    },
  },
  plugins: [],
};
