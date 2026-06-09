/**
 * Shot 13 — 特写→全景 · 神力涟漪
 * 镜头瞬间变化 · 速度线 · 动态模糊
 */
import { motion } from 'framer-motion'

export default function Shot13({ progress }) {
  return (
    <div className="shot-layer" style={{
      background: 'radial-gradient(ellipse at center, #0a0402 0%, #000 100%)'
    }}>
      <svg width="100%" height="100%" viewBox="0 0 100 56" preserveAspectRatio="none">
        {/* 宇宙背景 */}
        {Array.from({ length: 80 }).map((_, i) => (
          <circle
            key={i}
            cx={Math.random() * 100}
            cy={Math.random() * 56}
            r={0.1 + Math.random() * 0.3}
            fill="#c8a464"
            opacity={0.4 + Math.random() * 0.5}
          />
        ))}
        {/* 速度线 - 中心放射 */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i / 24) * Math.PI * 2
          const len = 10 + progress * 40
          return (
            <line
              key={i}
              x1={50 + Math.cos(angle) * 3}
              y1={28 + Math.sin(angle) * 3}
              x2={50 + Math.cos(angle) * (3 + len)}
              y2={28 + Math.sin(angle) * (3 + len)}
              stroke="#f0c878"
              strokeWidth="0.3"
              opacity={progress * 0.7}
              style={{ mixBlendMode: 'screen' }}
            />
          )
        })}
        {/* 涟漪环 */}
        {Array.from({ length: 4 }).map((_, i) => {
          const ringP = (progress - i * 0.15) % 1
          return (
            <ellipse
              key={i}
              cx="50" cy="28"
              rx={ringP * 50}
              ry={ringP * 28}
              fill="none"
              stroke="#c8a464"
              strokeWidth="0.2"
              opacity={1 - ringP}
              style={{ mixBlendMode: 'screen' }}
            />
          )
        })}
        {/* 中心拳头 */}
        <circle cx="50" cy="28" r="4" fill="#000" />
        <circle cx="50" cy="28" r="6" fill="none" stroke="#f0c878" strokeWidth="0.3" style={{ mixBlendMode: 'screen' }} />
      </svg>
    </div>
  )
}
