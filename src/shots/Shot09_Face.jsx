/**
 * Shot 09 — 特写 · 骑士面部
 * 异域神秘，慢动作
 */
export default function Shot09({ progress }) {
  return (
    <div className="shot-layer" style={{
      background: 'radial-gradient(ellipse at center, #1a0a05 0%, #000 100%)'
    }}>
      <svg width="100%" height="100%" viewBox="0 0 100 56" preserveAspectRatio="none">
        <g transform="translate(50, 28)">
          {/* 头盔 */}
          <path d="M -10 -10 L -12 0 L -10 10 L 10 10 L 12 0 L 10 -10 Z" fill="#1a0a05" />
          <path d="M -10 -10 L -12 -12 L 12 -12 L 10 -10 Z" fill="#0a0402" />
          {/* 面甲缝 */}
          <line x1="-2" y1="-6" x2="-2" y2="6" stroke="#000" strokeWidth="0.4" />
          {/* 眼缝 - 发光 */}
          <rect x="-7" y="-3" width="14" height="1" fill="#f0c878" style={{ mixBlendMode: 'screen', filter: 'drop-shadow(0 0 4px #f0c878)' }} />
          {/* 鼻甲 */}
          <path d="M -3 -2 L -4 5 L -1 8 L 1 8 L 4 5 L 3 -2 Z" fill="#0a0402" />
          {/* 符文刻线 */}
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={i}
              x1={-8 + i * 3}
              y1={-8}
              x2={-8 + i * 3}
              y2={-6}
              stroke="#c8a464"
              strokeWidth="0.15"
              opacity="0.4"
            />
          ))}
          {/* 装饰刻纹 */}
          <path d="M -6 4 Q 0 6 6 4" stroke="#3a2412" strokeWidth="0.2" fill="none" />
        </g>
        {/* 微光尘埃 */}
        {Array.from({ length: 8 }).map((_, i) => (
          <circle
            key={i}
            cx={40 + i * 3}
            cy={25 + Math.sin(i) * 5}
            r="0.3"
            fill="#c8a464"
            opacity="0.6"
            style={{ mixBlendMode: 'screen' }}
          />
        ))}
      </svg>
    </div>
  )
}
