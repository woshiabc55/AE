/**
 * Shot 11 — 大全景 · 冲击波扩散
 * 急速后退 · 毁灭与安全边界
 */
import Shockwave from '../components/effects/Shockwave.jsx'

export default function Shot11({ progress }) {
  return (
    <div className="shot-layer" style={{
      background: 'linear-gradient(to bottom, #1a0a05 0%, #3a1a0a 50%, #1a0a05 100%)'
    }}>
      <svg width="100%" height="100%" viewBox="0 0 100 56" preserveAspectRatio="none">
        {/* 地面 */}
        <path d="M 0 30 L 100 30 L 100 56 L 0 56 Z" fill="#1a0a05" />
        {/* 中心安全岛 */}
        <ellipse cx="50" cy="40" rx="8" ry="3" fill="#3a1a0a" />
        <ellipse cx="50" cy="40" rx="6" ry="2" fill="#5a3a1c" />
        {/* 老头剪影 - 中心 */}
        <g transform="translate(50, 36)">
          <ellipse cx="0" cy="-2" rx="1.5" ry="0.5" fill="#000" />
          <circle cx="0" cy="-3.5" r="0.8" fill="#000" />
          <path d="M -1 -3 L -1.5 0 L 1.5 0 L 1 -3 Z" fill="#000" />
        </g>
        {/* 毁灭区域 - 边缘外 */}
        {Array.from({ length: 20 }).map((_, i) => {
          const angle = (i / 20) * Math.PI * 2
          const dist = 12 + progress * 30
          return (
            <g key={i} transform={`translate(${50 + Math.cos(angle) * dist}, ${35 + Math.sin(angle) * dist * 0.5})`}>
              <polygon points="-1,0 1,0 0.5,-2" fill="#1a0a05" />
              <line x1="0" y1="-2" x2={Math.cos(angle) * 2} y2={Math.sin(angle) * 2} stroke="#3a1a0a" strokeWidth="0.1" />
            </g>
          )
        })}
        {/* 边界 - 安全与毁灭 */}
        <ellipse
          cx="50" cy="40"
          rx={8 + progress * 4}
          ry={3 + progress * 1.5}
          fill="none"
          stroke="#f0c878"
          strokeWidth="0.2"
          opacity={progress}
          style={{ mixBlendMode: 'screen' }}
        />
        {/* 建筑摧毁 - 边缘 */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2
          const dist = 15 + progress * 35
          const x = 50 + Math.cos(angle) * dist
          const broken = progress > 0.3 + i * 0.08
          return (
            <g key={i} transform={`translate(${x}, ${35 + Math.sin(angle) * dist * 0.3})`}>
              {!broken ? (
                <rect x="-1" y="-6" width="2" height="6" fill="#1a0a05" />
              ) : (
                <>
                  <polygon points="-2,0 0,-3 1,-1" fill="#1a0a05" />
                  <polygon points="0,0 2,-2 1,-4" fill="#0a0402" />
                </>
              )}
            </g>
          )
        })}
      </svg>
      <Shockwave progress={progress} color="#a8512a" maxScale={10} rings={4} />
    </div>
  )
}
