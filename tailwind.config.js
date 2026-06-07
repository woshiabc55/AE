/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        display: ['Orbitron', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        serif: ['"Noto Serif SC"', 'serif'],
      },
      colors: {
        // 冷色基底
        void: '#0a0a0a',
        obsidian: '#101013',
        panel: '#16161c',
        'panel-light': '#1d1d26',
        bone: '#e8e6df',
        // 强调色
        amber: '#ffe600',     // 荧光黄 - 能源/UI高亮
        alert: '#ff0033',     // 警报红 - 收容失效
        // 辅助色
        enkephalin: '#4dff88', // 脑啡肽绿
        crt: '#00ffd5',        // 监视器青
        // 字体灰度
        'text-mute': '#8a8a8a',
        'text-dim': '#5a5a5a',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        'alert-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,0,51,0.6)' },
          '50%': { boxShadow: '0 0 16px 4px rgba(255,0,51,0.9)' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-1px, 1px)' },
          '40%': { transform: 'translate(1px, -1px)' },
          '60%': { transform: 'translate(-1px, -1px)' },
          '80%': { transform: 'translate(1px, 1px)' },
        },
        'text-blink': {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
      },
      animation: {
        flicker: 'flicker 4s infinite',
        'alert-pulse': 'alert-pulse 1s infinite',
        glitch: 'glitch 0.3s infinite',
        'text-blink': 'text-blink 1s infinite',
      },
    },
  },
  plugins: [],
};
