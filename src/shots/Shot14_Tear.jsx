/**
 * Shot 14 — 中景 · 空间撕裂
 * 快速横移
 */
import { motion } from 'framer-motion'
import SpaceRift from '../components/effects/SpaceRift.jsx'
import Beast from '../components/effects/Beast.jsx'

export default function Shot14({ progress }) {
  return (
    <div className="shot-layer" style={{
      background: 'linear-gradient(to bottom, #0a0402 0%, #1a0a05 50%, #000 100%)',
      overflow: 'hidden'
    }}>
      <motion.div
        animate={{
          x: progress * 100 - 50
        }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Beast progress={0.8} scale={1} />
      </motion.div>
      {/* 空间裂隙 */}
      <SpaceRift progress={progress} open={progress} />
      {/* 玻璃碎裂线 */}
      <svg width="100%" height="100%" viewBox="0 0 100 56" preserveAspectRatio="none" style={{ position: 'absolute' }}>
        {Array.from({ length: 30 }).map((_, i) => {
          const angle = (i / 30) * Math.PI * 2
          const len = 3 + progress * 12
          return (
            <line
              key={i}
              x1={50 + Math.cos(angle) * 5}
              y1={28 + Math.sin(angle) * 5}
              x2={50 + Math.cos(angle) * (5 + len)}
              y2={28 + Math.sin(angle) * (5 + len)}
              stroke="#fff"
              strokeWidth="0.1"
              opacity={progress * 0.8}
              style={{ mixBlendMode: 'screen' }}
            />
          )
        })}
        {/* 裂片 */}
        {Array.from({ length: 15 }).map((_, i) => {
          const angle = (i / 15) * Math.PI * 2
          const dist = 5 + progress * 25
          return (
            <polygon
              key={i}
              transform={`translate(${50 + Math.cos(angle) * dist}, ${28 + Math.sin(angle) * dist}) rotate(${angle * 180 / Math.PI})`}
              points="0,-0.5 0.3,0 0,0.5 -0.3,0"
              fill="#c8a464"
              opacity={1 - progress}
              style={{ mixBlendMode: 'screen' }}
            />
          )
        })}
      </svg>
    </div>
  )
}
