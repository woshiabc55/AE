/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      // 颜色继续以 hex 形式提供 fallback，主要颜色也通过 CSS 变量实时切换
      colors: {
        ink: 'var(--bg)',
        bone: 'var(--fg)',
        volt: 'var(--volt)',
        pink: 'var(--pink)',
        cyan: 'var(--cyan)',
        plum: 'var(--plum)',
      },
    },
  },
  plugins: [],
};
