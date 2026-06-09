/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 剧本封皮色
        carbon: {
          900: '#0E0B08',
          800: '#161210',
          700: '#1F1A16',
          600: '#2A231D',
        },
        // 羊皮纸米白
        parchment: {
          50: '#F5EEDB',
          100: '#E8DCC4',
          200: '#D8C9A4',
          300: '#B8A57D',
          400: '#8E7A55',
        },
        // 烫金古铜
        gilt: {
          300: '#B8A074',
          400: '#9C8255',
          500: '#7E6740',
          600: '#6B5C3E',
          700: '#4D4129',
        },
        // 场记板红
        clapper: {
          400: '#D9513C',
          500: '#C8341B',
          600: '#9F2814',
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        serif: ['"EB Garamond"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        sans: ['"Inter Tight"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        script: '720px',
        scriptwide: '880px',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'flicker': 'flicker 4s linear infinite',
        'marquee': 'marquee 30s linear infinite',
        'slide-down': 'slideDown 0.5s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        flicker: {
          '0%, 96%, 100%': { opacity: '1' },
          '97%': { opacity: '0.85' },
          '98%': { opacity: '1' },
          '99%': { opacity: '0.92' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
