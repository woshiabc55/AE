/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0f0f1a',
        surface: '#1a1a2e',
        accent: '#e94560',
        'accent-2': '#0f3460',
        glow: '#533483',
        text: '#eaeaea',
        'text-dim': '#a0a0b0',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};