/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0E1116',
        celadon: '#6FA39B',
        kiln: '#C2502A',
        gold: '#C9A972',
        paper: '#EFE7D6',
        ash: '#3A3530',
        smoke: '#1A1B20',
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'STKaiti', 'KaiTi', 'serif'],
        sans: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      animation: {
        'flicker': 'flicker 2.4s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'scan': 'scan 6s linear infinite',
        'rotate-slow': 'rotate 18s linear infinite',
        'dash-flow': 'dashFlow 4s linear infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '0.85' },
          '50%': { opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.9' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        dashFlow: {
          to: { strokeDashoffset: '-200' },
        },
      },
    },
  },
  plugins: [],
}
