/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A0B12',
        paper: '#E8E4D8',
        gilt: '#D4AF37',
        electric: '#5BC0EB',
        magenta: '#EF476F',
        sprout: '#06D6A0',
        twilight: '#7B2CBF',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Inter Tight"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        han: ['"Noto Serif SC"', 'serif'],
      },
      transitionTimingFunction: {
        'soft': 'cubic-bezier(.2,.8,.2,1)',
      },
    },
  },
  plugins: [],
}
