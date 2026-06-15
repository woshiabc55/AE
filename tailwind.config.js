/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 深色技术风设计令牌
        ink: {
          950: '#0B0F14',
          900: '#0F141B',
          800: '#11161D',
          700: '#1B2330',
          600: '#222B38',
          500: '#2C3848',
        },
        signal: {
          cyan: '#7DF9FF',
          magenta: '#FF7AC6',
          lime: '#A0FFB0',
          amber: '#FFC36B',
          red: '#FF6B7A',
        },
        edge: '#1E2A39',
        muted: '#5C6B7E',
        text: {
          primary: '#E6EDF3',
          secondary: '#9AAAB8',
          dim: '#5C6B7E',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Manrope', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 0 1px rgba(125,249,255,0.35), 0 0 24px rgba(125,249,255,0.15)',
        'glow-magenta': '0 0 0 1px rgba(255,122,198,0.35), 0 0 24px rgba(255,122,198,0.15)',
        panel: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 0 0 1px rgba(255,255,255,0.04)',
      },
      keyframes: {
        flow: {
          '0%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '-40' },
        },
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(255,107,122,0.6)' },
          '100%': { boxShadow: '0 0 0 12px rgba(255,107,122,0)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scan: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        flow: 'flow 1.4s linear infinite',
        pulseRing: 'pulseRing 1.4s ease-out infinite',
        fadeUp: 'fadeUp 280ms ease-out both',
        scan: 'scan 2.4s linear infinite',
      },
    },
  },
  plugins: [],
};
