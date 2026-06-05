/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['Rajdhani', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        body: ['Noto Sans SC', 'Inter', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
      },
      colors: {
        bg: {
          base: '#0a0d12',
          surface: '#141a22',
          panel: '#1a222d',
          deep: '#060a0f',
        },
        line: {
          DEFAULT: '#2a3441',
          strong: '#3a4654',
          dim: '#1f2731',
        },
        amber: {
          DEFAULT: '#ffb547',
          dim: '#a87424',
          glow: '#ffd17a',
        },
        cyan: {
          DEFAULT: '#4dd0ff',
          glow: '#7be4ff',
          dim: '#1d6e8a',
        },
        danger: {
          DEFAULT: '#ff4d5e',
          glow: '#ff8090',
        },
        ok: {
          DEFAULT: '#7cffb2',
          glow: '#a8ffd1',
        },
        rarity: {
          t1: '#7e8a96',
          t2: '#4dd0ff',
          t3: '#7cffb2',
          t4: '#ffb547',
          t5: '#ff7eb6',
          t6: '#ff4d5e',
        },
      },
      boxShadow: {
        'amber-glow': '0 0 18px rgba(255,181,71,0.45), 0 0 36px rgba(255,181,71,0.18)',
        'cyan-glow': '0 0 14px rgba(77,208,255,0.55), 0 0 28px rgba(77,208,255,0.25)',
        'inset-line': 'inset 0 0 0 1px rgba(255,255,255,0.04)',
      },
      animation: {
        scanline: 'scanline 8s linear infinite',
        flicker: 'flicker 4s linear infinite',
        pulseGlow: 'pulseGlow 2.4s ease-in-out infinite',
        slideIn: 'slideIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        barGrow: 'barGrow 0.6s ease-out forwards',
        hexAppear: 'hexAppear 0.5s ease-out backwards',
        spinSlow: 'spin 14s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.92' },
          '52%': { opacity: '0.6' },
          '54%': { opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 6px rgba(255,181,71,0.5), 0 0 12px rgba(255,181,71,0.25)' },
          '50%': { boxShadow: '0 0 14px rgba(255,181,71,0.9), 0 0 28px rgba(255,181,71,0.45)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(40px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        barGrow: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        hexAppear: {
          '0%': { transform: 'scale(0.4) translateY(20px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
