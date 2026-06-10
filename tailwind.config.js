/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0B0B0C',
          50: '#F5F1E8',
          100: '#E8E4D8',
          200: '#3A3A3C',
          300: '#6B6B6E',
          400: '#1A1A1C',
        },
        vermillion: {
          DEFAULT: '#E8453C',
          soft: '#FF6B5C',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        serif: ['"Fraunces"', 'Georgia', 'serif'],
      },
      letterSpacing: {
        tightest: '-0.05em',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'slide-in': 'slideIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'pulse-vermillion': 'pulseVermillion 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseVermillion: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
};
