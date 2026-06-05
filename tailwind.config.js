/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { 950: '#0E0B08', 900: '#15110D', 800: '#1B1A18', 700: '#26221C' },
        silk: { DEFAULT: '#F2E9D8', 50: '#FBF6EA', 100: '#F2E9D8', 200: '#E5D8BD', 300: '#D2BF96' },
        cinnabar: { DEFAULT: '#A22B1F', 500: '#A22B1F', 600: '#8B1E13', 700: '#6F160C' },
        gold: { DEFAULT: '#C9A14A', 400: '#D9B563', 500: '#C9A14A', 600: '#A88432', 700: '#7A5A22' },
        jasper: { DEFAULT: '#3D5A5A', 500: '#3D5A5A', 700: '#2A4040' },
        inkstone: '#1B2A3A',
      },
      fontFamily: {
        brush: ['"Ma Shan Zheng"', '"ZCOOL XiaoWei"', '"Noto Serif SC"', 'serif'],
        serif: ['"Noto Serif SC"', '"Source Han Serif SC"', 'serif'],
        seal: ['"Cinzel"', '"Noto Serif SC"', 'serif'],
      },
      boxShadow: {
        seal: '0 6px 24px -8px rgba(162,43,31,0.55), inset 0 0 0 1px rgba(201,161,74,0.4)',
        scroll: '0 30px 80px -30px rgba(0,0,0,0.7)',
        paper: '0 1px 0 rgba(255,255,255,0.04) inset, 0 24px 60px -28px rgba(0,0,0,0.65)',
      },
      keyframes: {
        flicker: { '0%,100%': { opacity: '0.85' }, '50%': { opacity: '0.6' } },
      },
      animation: { flicker: 'flicker 2.4s ease-in-out infinite' },
    },
  },
  plugins: [],
}
