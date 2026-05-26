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
        'belize-blue': '#003F87',
        'belize-red': '#CE1126',
        'tropical-yellow': '#FFD100',
        'deep-navy': '#0A1628',
        'coral': '#FF6B6B',
        'emerald-pixel': '#00D4AA',
        'pixel-white': '#E8E8E8',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        pixelbody: ['"VT323"', 'monospace'],
      },
    },
  },
  plugins: [],
};
