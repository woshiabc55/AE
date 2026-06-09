/**
 * Shot 12 — 近景 · 第一次交锋
 * 水墨画风格打击轨迹
 */
import { motion } from 'framer-motion'
import Beast from '../components/effects/Beast.jsx'

export default function Shot12({ progress }) {
  return (
    <div className="shot-layer" style={{
      background: 'radial-gradient(ellipse at center, #1a0a05 0%, #000 100%)'
    }}>
      <Beast progress={Math.min(1, progress * 1.5)} scale={0.8} />
      {/* 老头出拳 - 左下 */}
      <div style={{
        position: 'absolute',
        bottom: '15%', left: '20%',
        transform: 'rotate(-15deg)'
      }}>
        <svg width="120" height="80" viewBox="0 0 120 80">
          <g transform="translate(20, 40)">
            <ellipse cx="0" cy="-8" rx="6" ry="1.5" fill="#1a0a05" />
            <circle cx="0" cy="-6" r="2.5" fill="#000" />
            <path d="M -3 -4 L -4 12 L 4 12 L 3 -4 Z" fill="#000" />
            {/* 出拳 - 伸出 */}
            <motion.g
              animate={{
                x: progress * 60,
                rotate: -10
              }}
            >
              <ellipse cx="20" cy="0" rx="6" ry="2.5" fill="#000" />
              <ellipse cx="28" cy="0" rx="3" ry="3" fill="#000" />
              <line x1="14" y1="0" x2="20" y2="0" stroke="#000" strokeWidth="3" />
            </motion.g>
          </g>
        </svg>
      </div>
      {/* 水墨拳风轨迹 */}
      <svg width="100%" height="100%" viewBox="0 0 100 56" preserveAspectRatio="none" style={{ position: 'absolute' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.path
            key={i}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: progress, opacity: progress * 0.8 }}
            d={`M ${20 + i * 4} 38 Q ${40 + i * 2} ${30 - i} 60 25`}
            stroke="#000"
            strokeWidth={1.5 - i * 0.2}
            fill="none"
            strokeLinecap="round"
            style={{ mixBlendMode: 'multiply' }}
          />
        ))}
      </svg>
      {/* 闪光 */}
      {progress > 0.3 && progress < 0.5 && (
        <div style={{
          position: 'absolute', inset: 0,
          background: '#fff',
          opacity: 1 - (progress - 0.3) * 5,
          mixBlendMode: 'screen'
        }} />
      )}
    </div>
  )
}
