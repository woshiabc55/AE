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
        brand: {
          bg: '#1A1F36',
          surface: '#232847',
          card: '#2A3058',
          border: '#3A4070',
          accent: '#FF6B4A',
          'accent-hover': '#FF8266',
          mint: '#4ECDC4',
          amber: '#FFD93D',
          purple: '#A78BFA',
          pink: '#F472B6',
          blue: '#3B82F6',
        },
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Noto Sans SC', 'Noto Sans JP', 'Noto Sans KR', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delay': 'float 6s ease-in-out 2s infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'flip': 'flip 0.6s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'celebrate': 'celebrate 0.8s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        celebrate: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255,107,74,0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(255,107,74,0.6)' },
        },
      },
    },
  },
  plugins: [],
};
