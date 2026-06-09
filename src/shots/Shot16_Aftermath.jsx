/**
 * Shot 16 — 远景 · 余韵
 * 巨兽尸体 · 佝偻农夫
 */
export default function Shot16({ progress }) {
  return (
    <div className="shot-layer" style={{
      background: 'linear-gradient(to bottom, #2a1810 0%, #1a0a05 50%, #0a0402 100%)'
    }}>
      <svg width="100%" height="100%" viewBox="0 0 100 56" preserveAspectRatio="none">
        {/* 远景 - 破碎星球残骸 */}
        <ellipse cx="20" cy="25" rx="8" ry="5" fill="#3a2412" opacity="0.4" />
        <ellipse cx="80" cy="20" rx="6" ry="4" fill="#3a2412" opacity="0.4" />
        <ellipse cx="50" cy="15" rx="5" ry="3" fill="#3a2412" opacity="0.5" />
        {/* 巨兽尸体 - 漂浮 */}
        <g transform={`translate(${60 + progress * 5}, ${35 - progress * 2}) rotate(${-10 + progress * 5})`} opacity={1 - progress * 0.3}>
          <path
            d="M 0 0
               C -20 -5, -30 0, -35 -3
               C -38 -2, -38 2, -32 4
               C -25 6, -20 8, -15 6
               C -10 10, -5 8, 0 6
               C 5 8, 10 10, 15 6
               C 20 8, 25 6, 32 4
               C 38 2, 38 -2, 35 -3
               C 30 0, 20 -5, 0 0 Z"
            fill="#0a0402"
          />
          {/* 鳞片 */}
          {Array.from({ length: 10 }).map((_, i) => (
            <circle
              key={i}
              cx={-25 + i * 5}
              cy={3}
              r="0.8"
              fill="#1a0a05"
            />
          ))}
        </g>
        {/* 碎石 - 老头站立 */}
        <g transform="translate(50, 42)">
          <ellipse cx="0" cy="3" rx="6" ry="1.5" fill="#1a0a05" />
          <ellipse cx="0" cy="2" rx="5" ry="1" fill="#3a2412" />
          {/* 老头 - 佝偻 */}
          <g transform="rotate(2)">
            <ellipse cx="0" cy="-3" rx="3" ry="0.7" fill="#1a0a05" />
            <path d="M -1.5 -3 L -1 -5 L 1 -5 L 1.5 -3 Z" fill="#1a0a05" />
            <circle cx="0" cy="-2" r="1" fill="#3a2412" />
            <path d="M -2 -1 L -2.5 3 L 2.5 3 L 2 -1 Z" fill="#1a0a05" />
            {/* 佝偻背 */}
            <path d="M -2 -1 Q 0 0.5 2 -1" stroke="#0a0402" strokeWidth="0.2" fill="none" />
            <line x1="-0.5" y1="3" x2="-0.5" y2="5" stroke="#0a0402" strokeWidth="0.4" />
            <line x1="0.5" y1="3" x2="0.5" y2="5" stroke="#0a0402" strokeWidth="0.4" />
          </g>
        </g>
        {/* 星辰 */}
        {Array.from({ length: 30 }).map((_, i) => (
          <circle
            key={i}
            cx={Math.random() * 100}
            cy={Math.random() * 40}
            r={0.1 + Math.random() * 0.3}
            fill="#c8a464"
            opacity={0.5 + Math.random() * 0.5}
            style={{ mixBlendMode: 'screen' }}
          />
        ))}
      </svg>
    </div>
  )
}
