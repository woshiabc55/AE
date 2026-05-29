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
        celadon: {
          50: '#f0f5f0',
          100: '#dce8dd',
          200: '#B0C4B1',
          300: '#8aab8c',
          400: '#6a946e',
          500: '#4A7C59',
          600: '#3d6449',
          700: '#304d39',
          800: '#243729',
          900: '#17211a',
        },
        kiln: {
          50: '#fef3ee',
          100: '#fde4d4',
          200: '#fbc5a7',
          300: '#f5a06f',
          400: '#D4622B',
          500: '#c04e1a',
          600: '#a33d12',
          700: '#862f10',
          800: '#6c2613',
          900: '#5C3A21',
        },
        glaze: {
          50: '#F5F0E8',
          100: '#ede5d6',
          200: '#ddd0b8',
          300: '#c9b894',
          400: '#b5a070',
          500: '#a48b55',
          600: '#977b47',
          700: '#7d643b',
          800: '#655133',
          900: '#53442c',
        },
        gold: {
          400: '#C9A84C',
          500: '#b8963a',
        },
        iron: {
          900: '#2C2C2C',
          950: '#1a1410',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'serif'],
        sans: ['"Noto Sans SC"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1.5s ease-out forwards',
        'fade-in-slow': 'fadeIn 3s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
