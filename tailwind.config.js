/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0B0B0E',
          900: '#15151A',
          800: '#1C1C22',
          700: '#26262E',
          600: '#33333D',
        },
        amber: {
          300: '#F5D29B',
          400: '#F2C281',
          500: '#E8A85C',
          600: '#C68A41',
          700: '#8E5F2A',
        },
        curtain: {
          400: '#E36F7E',
          500: '#D14B5C',
          600: '#A73847',
        },
        bone: {
          50: '#F2EEDF',
          100: '#E8E4D2',
          200: '#D9D6C5',
          300: '#B5B1A0',
          400: '#8B8A85',
          500: '#6B6A65',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', '"Noto Serif SC"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', '"Noto Sans SC"', 'Menlo', 'monospace'],
        sans: ['"Inter"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        spotlight: '0 0 80px -20px rgba(232, 168, 92, 0.35)',
        frame: 'inset 0 0 0 1px rgba(232, 168, 92, 0.18), 0 24px 60px -30px rgba(0, 0, 0, 0.9)',
        reel: '0 18px 40px -22px rgba(0, 0, 0, 0.8)',
      },
      keyframes: {
        sweep: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        breath: {
          '0%, 100%': { opacity: 0.35, transform: 'scale(0.95)' },
          '50%': { opacity: 0.7, transform: 'scale(1.05)' },
        },
        floatUp: {
          '0%': { opacity: 0, transform: 'translateY(14px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        typewriter: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        flicker: {
          '0%, 100%': { opacity: 1 },
          '45%': { opacity: 0.7 },
          '55%': { opacity: 0.95 },
        },
      },
      animation: {
        sweep: 'sweep 1.2s ease-in-out',
        breath: 'breath 4s ease-in-out infinite',
        floatUp: 'floatUp 0.6s ease-out both',
        typewriter: 'typewriter 1.4s steps(20) both',
        flicker: 'flicker 3.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
