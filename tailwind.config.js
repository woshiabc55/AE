export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'system-ui', 'monospace'],
        vt: ['"VT323"', 'monospace'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        serif: ['"Noto Serif SC"', 'serif'],
      },
      colors: {
        ink: '#0b0d12',
        bone: '#f5e6c8',
        neon: '#ff5b3a',
        arcade: '#3ddc97',
        azure: '#3aa0ff',
        arcane: '#a06cd5',
      },
      boxShadow: {
        pixel: '4px 4px 0 0 rgba(0,0,0,0.55)',
        glow: '0 0 24px rgba(255,91,58,0.45)',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        flicker: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.86' },
        },
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        scan: 'scan 6s linear infinite',
        flicker: 'flicker 2.4s ease-in-out infinite',
        floaty: 'floaty 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
