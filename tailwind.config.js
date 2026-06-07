/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          950: '#070710',
          900: '#0B0B12',
          800: '#10101C',
          700: '#161626',
          600: '#1F1F2A',
          500: '#2A2A38',
        },
        neon: {
          cyan: '#7CF9FF',
          blue: '#5DA8FF',
          violet: '#B47CFF',
        },
        ember: {
          DEFAULT: '#FF6A3D',
          soft: '#FF9270',
        },
        fog: {
          DEFAULT: '#A6A6B3',
          dim: '#6E6E80',
        },
        cream: '#F5F5F7',
      },
      backgroundImage: {
        'grid-faint': 'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
        'mesh-glow': 'radial-gradient(circle at 20% 20%, rgba(124,249,255,0.18), transparent 45%), radial-gradient(circle at 80% 30%, rgba(180,124,255,0.16), transparent 50%), radial-gradient(circle at 50% 80%, rgba(255,106,61,0.12), transparent 50%)',
      },
      backgroundSize: {
        grid: '40px 40px',
      },
      boxShadow: {
        glow: '0 0 24px rgba(124, 249, 255, 0.35)',
        ember: '0 0 24px rgba(255, 106, 61, 0.35)',
        panel: '0 8px 28px -12px rgba(0, 0, 0, 0.6), 0 2px 6px -2px rgba(0, 0, 0, 0.4)',
      },
      keyframes: {
        floaty: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(124,249,255,0.4)' },
          '50%': { boxShadow: '0 0 24px 4px rgba(124,249,255,0.0)' },
        },
        scanline: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        blink: {
          '0%,92%,100%': { transform: 'scaleY(1)' },
          '95%': { transform: 'scaleY(0.05)' },
        },
        breathe: {
          '0%,100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        headSway: {
          '0%,100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
      },
      animation: {
        floaty: 'floaty 4s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.4s ease-in-out infinite',
        scanline: 'scanline 2.4s linear infinite',
        shimmer: 'shimmer 3s linear infinite',
        blink: 'blink 4.2s ease-in-out infinite',
        breathe: 'breathe 3.6s ease-in-out infinite',
        headSway: 'headSway 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
