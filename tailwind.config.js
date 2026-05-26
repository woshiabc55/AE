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
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        neon: '#00ff88',
        pink: '#ff0066',
        dark: {
          DEFAULT: '#0a0a0f',
          100: '#0d0d14',
          200: '#111118',
        },
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'scan-line': 'scan-line 8s linear infinite',
        'neon-flicker': 'neon-flicker 3s infinite',
      },
    },
  },
  plugins: [],
};
