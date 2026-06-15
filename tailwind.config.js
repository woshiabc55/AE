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
        bg: "var(--bg)",
        fg: "var(--fg)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        alert: "var(--alert)",
        line: "var(--line)",
      },
      fontFamily: {
        display: ['Fraunces', 'Times New Roman', 'serif'],
        mono: ['"IBM Plex Mono"', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        crunch: '-0.025em',
      },
      fontSize: {
        // 巨大显示字号
        'mega': ['clamp(5rem, 18vw, 18rem)', { lineHeight: '0.85', letterSpacing: '-0.04em' }],
        'hero': ['clamp(3.5rem, 11vw, 11rem)', { lineHeight: '0.9', letterSpacing: '-0.035em' }],
        'display': ['clamp(2.5rem, 6vw, 6rem)', { lineHeight: '1', letterSpacing: '-0.025em' }],
        'h2': ['clamp(1.75rem, 3.5vw, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },
      animation: {
        'marquee': 'marquee 40s linear infinite',
        'marquee-slow': 'marquee 60s linear infinite',
        'mesh-drift': 'mesh-drift 16s ease-in-out infinite',
        'cursor-blink': 'cursor-blink 1.1s steps(2) infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'rise': 'rise 0.9s cubic-bezier(0.2, 0.7, 0.1, 1) forwards',
        'spin-slow': 'spin 30s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'mesh-drift': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(8%, -4%) scale(1.05)' },
          '66%': { transform: 'translate(-6%, 5%) scale(0.95)' },
        },
        'cursor-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        rise: {
          '0%': { transform: 'translateY(28px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'mesh-accent':
          'radial-gradient(at 18% 22%, rgba(215,255,58,0.18) 0px, transparent 45%), radial-gradient(at 82% 12%, rgba(255,77,46,0.16) 0px, transparent 50%), radial-gradient(at 60% 80%, rgba(215,255,58,0.10) 0px, transparent 50%)',
        'grain':
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>\")",
      },
    },
  },
  plugins: [],
};
