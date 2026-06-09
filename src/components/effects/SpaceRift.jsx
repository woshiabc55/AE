/**
 * 空间裂隙 / 空间褶皱
 */
export default function SpaceRift({ progress = 0, open = 1, color = '#c8a464' }) {
  return (
    <div className="shot-layer" style={{ overflow: 'hidden' }}>
      <svg width="100%" height="100%" viewBox="0 0 100 56" preserveAspectRatio="none">
        <defs>
          <linearGradient id="riftGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity="0" />
            <stop offset="40%" stopColor={color} stopOpacity="0.8" />
            <stop offset="50%" stopColor="#fff" stopOpacity="1" />
            <stop offset="60%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <radialGradient id="riftGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor={color} stopOpacity="0.9" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* 裂隙光晕 */}
        <ellipse
          cx="50" cy="28"
          rx={open * 45}
          ry={open * 25}
          fill="url(#riftGlow)"
          opacity={progress * 0.7}
        />
        {/* 裂隙主体 */}
        <path
          d={`M ${50 - open * 35} 28
              Q ${50 - open * 10} ${28 - open * 12 * Math.sin(progress * Math.PI * 2)} 50 28
              Q ${50 + open * 10} ${28 + open * 12 * Math.sin(progress * Math.PI * 2)} ${50 + open * 35} 28`}
          stroke="url(#riftGrad)"
          strokeWidth={open * 0.5}
          fill="none"
          opacity={progress}
        />
        {/* 内部裂线 */}
        {Array.from({ length: 7 }).map((_, i) => (
          <line
            key={i}
            x1={50 - open * 30 + i * 8}
            y1={28 - open * 8 + i * 1.5}
            x2={50 - open * 25 + i * 8}
            y2={28 + open * 8 - i * 1.5}
            stroke={color}
            strokeWidth="0.15"
            opacity={progress * 0.6}
          />
        ))}
      </svg>
    </div>
  )
}
