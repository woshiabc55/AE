/**
 * Shot 04 — 全景 · 战场废墟 · 妖塔
 * 画面割裂 + 不稳定手持
 */
import { motion } from 'framer-motion'

export default function Shot04({ progress }) {
  // 不稳定手持震动
  const shake = progress < 0.9 ? Math.sin(progress * 50) * 8 : 0
  return (
    <motion.div
      className="shot-layer"
      style={{
        background: 'linear-gradient(to bottom, #1a0a05 0%, #3a1a0a 50%, #1a0a05 100%)'
      }}
      animate={{ x: shake, y: Math.cos(progress * 30) * 5 }}
    >
      <svg width="100%" height="100%" viewBox="0 0 100 56" preserveAspectRatio="none">
        <defs>
          <linearGradient id="towerGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c8a464" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#c8a464" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* 九层妖塔虚影 */}
        <g transform={`translate(50, 5) scale(${0.8 + Math.sin(progress * Math.PI) * 0.2})`}>
          {Array.from({ length: 9 }).map((_, i) => {
            const y = i * 4
            const w = 14 - i * 1
            return (
              <g key={i} transform={`translate(0, ${y})`}>
                <path
                  d={`M ${-w} 0 L ${-w - 1} 4 L ${w + 1} 4 L ${w} 0 Z`}
                  fill="#1a0a05"
                  stroke="#3a1a0a"
                  strokeWidth="0.1"
                />
                <path d={`M ${-w} 0 L 0 -2 L ${w} 0`} fill="#3a1a0a" />
                <rect x={-w + 1} y="1" width={(w - 1) * 2} height="2" fill="#0a0402" />
                <line x1="0" y1="0" x2="0" y2="4" stroke="#c8a464" strokeWidth="0.1" opacity="0.3" />
              </g>
            )
          })}
          {/* 塔尖 */}
          <path d="M 0 -8 L -2 -4 L 2 -4 Z" fill="#c8a464" />
          <circle cx="0" cy="-9" r="1" fill="#f0c878" style={{ mixBlendMode: 'screen' }} />
        </g>
        {/* 塔光晕 */}
        <ellipse cx="50" cy="20" rx="20" ry="35" fill="url(#towerGlow)" opacity={0.4 + progress * 0.3} />
        {/* 地面废墟 */}
        <path d="M 0 40 L 20 38 L 35 42 L 55 39 L 75 43 L 100 40 L 100 56 L 0 56 Z" fill="#0a0402" />
        {/* 碎石 */}
        {Array.from({ length: 15 }).map((_, i) => (
          <polygon
            key={i}
            points={`${i * 7},${45 + Math.sin(i) * 3} ${i * 7 + 2},${48} ${i * 7 + 4},${46 + Math.cos(i) * 2}`}
            fill="#1a0a05"
            opacity="0.8"
          />
        ))}
        {/* 裂纹 */}
        {Array.from({ length: 5 }).map((_, i) => (
          <line
            key={i}
            x1={20 + i * 15}
            y1={45}
            x2={22 + i * 15 + Math.sin(i) * 3}
            y2={50}
            stroke="#3a1a0a"
            strokeWidth="0.15"
            opacity="0.6"
          />
        ))}
      </svg>
      {/* 画面割裂效果 - 颜色闪烁 */}
      {progress > 0.4 && progress < 0.6 && (
        <div style={{
          position: 'absolute', inset: 0,
          background: progress > 0.5 ? 'rgba(168, 81, 42, 0.3)' : 'rgba(74, 107, 90, 0.3)',
          mixBlendMode: 'color'
        }} />
      )}
    </motion.div>
  )
}
