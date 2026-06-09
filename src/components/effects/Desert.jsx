/**
 * 荒芜大地 — 第一幕开场
 */
export default function Desert({ progress = 0 }) {
  return (
    <div className="shot-layer" style={{
      background: 'linear-gradient(to bottom, #1a1208 0%, #2a1d10 35%, #4a2f1a 65%, #6b4524 100%)'
    }}>
      {/* 远山地平线 */}
      <svg width="100%" height="100%" viewBox="0 0 100 56" preserveAspectRatio="none">
        <defs>
          <linearGradient id="duneGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1208" />
            <stop offset="60%" stopColor="#3a2412" />
            <stop offset="100%" stopColor="#6b4524" />
          </linearGradient>
          <linearGradient id="crackGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0c878" stopOpacity="0" />
            <stop offset="50%" stopColor="#f0c878" stopOpacity="1" />
            <stop offset="100%" stopColor="#f0c878" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* 远山轮廓 */}
        <path
          d="M 0 38 L 8 32 L 18 36 L 28 30 L 42 35 L 55 28 L 70 34 L 85 30 L 100 36 L 100 56 L 0 56 Z"
          fill="url(#duneGrad)"
          opacity="0.7"
        />
        {/* 中景山丘 */}
        <path
          d="M 0 45 L 12 40 L 25 44 L 40 38 L 55 42 L 70 36 L 85 42 L 100 38 L 100 56 L 0 56 Z"
          fill="#2a1810"
          opacity="0.85"
        />
        {/* 前景地面 */}
        <path
          d="M 0 50 L 15 48 L 30 50 L 50 47 L 70 50 L 85 48 L 100 50 L 100 56 L 0 56 Z"
          fill="#15100a"
        />
        {/* 地裂 */}
        <path
          d={`M ${50 - progress * 15} 56 L ${50 + (progress - 0.5) * 30} ${56 - progress * 30} L ${50 + progress * 15} 0`}
          stroke="url(#crackGrad)"
          strokeWidth="0.4"
          fill="none"
          opacity={Math.min(1, progress * 1.5)}
        />
      </svg>
      {/* 太阳 / 强光 */}
      <div style={{
        position: 'absolute',
        top: '20%', left: '50%',
        transform: 'translateX(-50%)',
        width: 200, height: 200,
        background: 'radial-gradient(circle, #f0c878 0%, #c8a464 30%, transparent 70%)',
        opacity: 0.4 + progress * 0.3,
        mixBlendMode: 'screen',
        filter: 'blur(8px)'
      }} />
    </div>
  )
}
