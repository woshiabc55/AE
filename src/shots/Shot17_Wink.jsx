/**
 * Shot 17 — 特写 · 收束
 * 老头眼神 · 反差感
 */
export default function Shot17({ progress }) {
  return (
    <div className="shot-layer" style={{
      background: 'radial-gradient(ellipse at center, #3a2412 0%, #1a0a05 70%)'
    }}>
      <svg width="100%" height="100%" viewBox="0 0 100 56" preserveAspectRatio="none">
        <g transform="translate(50, 28)">
          <ellipse cx="0" cy="0" rx="18" ry="22" fill="#8a5a3a" />
          <ellipse cx="6" cy="3" rx="14" ry="18" fill="#000" opacity="0.4" />
          {Array.from({ length: 6 }).map((_, i) => (
            <path
              key={i}
              d={`M ${-10 + i * 4} -8 Q ${-9 + i * 4} -5 ${-10 + i * 4} -2`}
              stroke="#3a1a08"
              strokeWidth="0.2"
              fill="none"
              opacity="0.5"
            />
          ))}
          <path d="M -8 -8 L -3 -10" stroke="#1a0a05" strokeWidth="0.8" />
          <path d="M 3 -10 L 8 -8" stroke="#1a0a05" strokeWidth="0.8" />
          {/* 眼睛 - 这次是浑浊/温和 */}
          <ellipse cx="-4" cy="-4" rx="2" ry="1.2" fill="#e8d9b6" />
          <circle cx="-4" cy="-4" r="0.6" fill="#1a0a05" />
          <ellipse cx="4" cy="-4" rx="2" ry="1.2" fill="#e8d9b6" />
          <circle cx="4" cy="-4" r="0.6" fill="#1a0a05" />
          {/* 鼻 */}
          <path d="M 0 -3 L -1 5 L 1 5 Z" fill="#5a3a1c" />
          {/* 嘴 - 狡黠笑容 */}
          <path
            d={`M -4 10 Q 0 ${10 + 4 * (1 - progress)} 4 10`}
            stroke="#1a0a05"
            strokeWidth="0.5"
            fill="none"
          />
        </g>
      </svg>
      {/* 字幕 */}
      <div style={{
        position: 'absolute',
        bottom: '20%', left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: 'var(--f-serif)',
        fontSize: 16,
        color: '#c8a464',
        textShadow: '0 0 8px #000',
        letterSpacing: '0.3em',
        opacity: progress
      }}>
        又种完一茬地
      </div>
    </div>
  )
}
