/**
 * 行星 / 流星
 */
export default function Meteor({ progress = 0 }) {
  return (
    <div className="shot-layer">
      <svg width="100%" height="100%" viewBox="0 0 100 56" preserveAspectRatio="none">
        <defs>
          <radialGradient id="meteorCore" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="30%" stopColor="#f0c878" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#a8512a" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1a0a05" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="meteorTrail" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0c878" stopOpacity="0" />
            <stop offset="40%" stopColor="#c8a464" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#a8512a" stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* 拖尾 */}
        <ellipse
          cx={50}
          cy={-10 + progress * 70}
          rx={1 + progress * 1.5}
          ry={10 + progress * 30}
          fill="url(#meteorTrail)"
          opacity="0.8"
        />
        {/* 主体 */}
        <circle
          cx={50}
          cy={-10 + progress * 70}
          r={3 + progress * 5}
          fill="url(#meteorCore)"
          style={{ mixBlendMode: 'screen' }}
        />
        {/* 落地冲击波 */}
        {progress > 0.7 && (
          <ellipse
            cx={50}
            cy={60}
            rx={(progress - 0.7) * 200}
            ry={(progress - 0.7) * 40}
            fill="none"
            stroke="#f0c878"
            strokeWidth="0.3"
            opacity={1 - progress}
          />
        )}
      </svg>
      {/* 大气摩擦光晕 */}
      <div style={{
        position: 'absolute',
        top: `${-10 + progress * 70}%`,
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: `${(3 + progress * 5) * 4}%`,
        height: `${(3 + progress * 5) * 4}%`,
        background: 'radial-gradient(circle, #f0c878 0%, transparent 60%)',
        mixBlendMode: 'screen',
        filter: 'blur(20px)',
        opacity: 0.8
      }} />
    </div>
  )
}
