/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0A0A0B',
          900: '#101013',
          800: '#15151A',
          700: '#1B1B22',
          600: '#22222B',
          500: '#2A2A33',
          400: '#3A3A45',
        },
        bone: {
          50: '#F2EEE2',
          100: '#E8E4D8',
          200: '#D6D0BF',
          300: '#B8B19E',
        },
        amber: {
          glow: '#D4A24C',
          deep: '#A87C2E',
          flame: '#E8B964',
        },
        blood: {
          DEFAULT: '#9A2A2A',
          deep: '#6B1A1A',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'Georgia', 'serif'],
        sans: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Courier New"', 'monospace'],
      },
      boxShadow: {
        'inner-glow': 'inset 0 0 0 1px rgba(212,162,76,0.35), inset 0 0 24px rgba(212,162,76,0.08)',
        'cell-focus': '0 0 0 1px #D4A24C, 0 0 18px rgba(212,162,76,0.25)',
        'film-grain': '0 0 0 1px rgba(212,162,76,0.15), 0 8px 28px rgba(0,0,0,0.6)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out both',
        'cursor-blink': 'cursorBlink 1s steps(1) infinite',
        'progress-shine': 'progressShine 1.6s linear infinite',
        'noise-shift': 'noiseShift 8s steps(6) infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        cursorBlink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        progressShine: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        noiseShift: {
          '0%, 100%': { transform: 'translate(0,0)' },
          '20%': { transform: 'translate(-2%,1%)' },
          '40%': { transform: 'translate(1%,-1%)' },
          '60%': { transform: 'translate(-1%,2%)' },
          '80%': { transform: 'translate(2%,-2%)' },
        },
      },
    },
  },
  plugins: [],
};
