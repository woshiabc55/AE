/**
 * 水墨金龙 — 最终一击
 */
export default function InkDragon({ progress = 0, color = '#1a1611' }) {
  // 龙身路径 - 动态蜿蜒
  const path = `M ${10 + progress * 20} 60
    C ${20 + progress * 30} ${30 - progress * 10}, ${50 + progress * 20} ${80 + progress * 10}, ${80} 50
    C ${85 + progress * 5} 40, ${90} 45, ${95 - progress * 5} 50`

  return (
    <div className="shot-layer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="inkBlur">
            <feGaussianBlur stdDeviation="0.4" />
          </filter>
          <linearGradient id="dragonGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity="0" />
            <stop offset="20%" stopColor={color} stopOpacity="0.8" />
            <stop offset="50%" stopColor="#000" stopOpacity="1" />
            <stop offset="80%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="dragonGold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#c8a464" stopOpacity="0" />
            <stop offset="50%" stopColor="#f0c878" stopOpacity="1" />
            <stop offset="100%" stopColor="#c8a464" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 水墨拖尾 — 多条 */}
        {Array.from({ length: 5 }).map((_, i) => (
          <path
            key={i}
            d={path}
            stroke={i === 2 ? '#000' : color}
            strokeWidth={2 - i * 0.3}
            fill="none"
            opacity={(0.3 + progress * 0.7) * (1 - i * 0.15)}
            filter="url(#inkBlur)"
            strokeLinecap="round"
            style={{
              transform: `translate(${i * 1}px, ${i * 0.5}px) scale(${1 + i * 0.02})`
            }}
          />
        ))}

        {/* 主龙身 */}
        <path
          d={path}
          stroke="url(#dragonGrad)"
          strokeWidth="2.5"
          fill="none"
          filter="url(#inkBlur)"
          strokeLinecap="round"
        />

        {/* 金色光芒 */}
        <path
          d={path}
          stroke="url(#dragonGold)"
          strokeWidth="0.4"
          fill="none"
          opacity={progress}
          strokeLinecap="round"
        />

        {/* 龙首 - 圆形突起 */}
        <g style={{ transform: `translate(${10 + progress * 20}px, 60px)` }}>
          <circle r="4" fill="#000" filter="url(#inkBlur)" />
          <circle r="2" fill={color} />
          <circle cx="-1" cy="-1" r="0.6" fill="#f0c878" />
          {/* 龙须 */}
          <path d="M 0 0 L -3 3 M 0 0 L -2 4 M 0 0 L -4 2" stroke="#000" strokeWidth="0.3" fill="none" />
        </g>

        {/* 鳞片点 */}
        {Array.from({ length: 12 }).map((_, i) => {
          const t = i / 12
          const x = 10 + progress * 20 + t * 70
          const y = 60 + Math.sin(t * Math.PI * 3 + progress * 2) * 15
          return <circle key={i} cx={x} cy={y} r="0.6" fill="#c8a464" opacity={progress * 0.6} />
        })}
      </svg>
    </div>
  )
}
