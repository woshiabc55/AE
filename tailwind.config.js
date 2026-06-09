/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Bricolage Grotesque"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      },
      colors: {
        paper: 'var(--paper)',
        ink: 'var(--ink)',
        accent: 'var(--accent)',
        accentSoft: 'var(--accent-soft)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        chip: 'var(--chip)',
        chipText: 'var(--chip-text)'
      },
      letterSpacing: {
        tightish: '-0.01em',
        tighter2: '-0.03em',
        wider2: '0.18em'
      }
    }
  },
  plugins: []
}
