/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Inter Tight"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: '#0a0a0a',
        bone: '#f5f1e8',
        volt: '#f0ff00',
        pink: '#ff3da5',
        cyan: '#00e5ff',
      },
    },
  },
  plugins: [],
};
