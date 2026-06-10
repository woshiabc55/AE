/** @type {import('tailwindcss').Config} */

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0E0E10',
          900: '#08080A',
          800: '#0E0E10',
          700: '#15151A',
          600: '#1E1E25',
          500: '#2A2A33',
        },
        bone: {
          DEFAULT: '#EAE6DD',
          50: '#F6F2EA',
          100: '#EAE6DD',
          200: '#D6D1C4',
          300: '#B7B1A2',
        },
        oxide: '#B03A2E',
        coolgray: '#6B6F76',
        warmgray: '#9C8E7A',
      },
      fontFamily: {
        display: ['"Fraunces"', '"Noto Serif SC"', 'serif'],
        serif: ['"Cormorant Garamond"', '"Noto Serif SC"', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        wideish: '0.18em',
        widish: '0.32em',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px) scale(0.985)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'grain-shift': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '20%': { transform: 'translate(-2%, 1%)' },
          '40%': { transform: 'translate(1%, -2%)' },
          '60%': { transform: 'translate(-1%, 2%)' },
          '80%': { transform: 'translate(2%, -1%)' },
        },
        'breathe': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.012)' },
        },
        'sweep': {
          '0%': { transform: 'translateX(-110%)' },
          '100%': { transform: 'translateX(110%)' },
        },
        'blink': {
          '0%, 92%, 100%': { transform: 'scaleY(1)' },
          '95%': { transform: 'scaleY(0.05)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 1.1s cubic-bezier(.2,.7,.2,1) both',
        'fade-in': 'fade-in 1.4s ease-out both',
        'grain-shift': 'grain-shift 7s steps(5) infinite',
        'breathe': 'breathe 6s ease-in-out infinite',
        'sweep': 'sweep 8s linear infinite',
        'blink': 'blink 5.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
