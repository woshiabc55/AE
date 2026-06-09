/**
 * Shot 10 — 中景 · 老头单手平推 · 行星坍缩
 * 环绕长镜头
 */
import { motion } from 'framer-motion'
import Shockwave from '../components/effects/Shockwave.jsx'

export default function Shot10({ progress }) {
  return (
    <div className="shot-layer" style={{
      background: 'radial-gradient(ellipse at center, #0a0402 0%, #000 100%)',
      perspective: '1400px'
    }}>
      <motion.div
        style={{
          position: 'absolute', inset: 0,
          transformStyle: 'preserve-3d'
        }}
        animate={{
          rotateY: progress * 30 - 15
        }}
      >
        {/* 行星 - 即将坍缩 */}
        <motion.div
          animate={{
            scale: 1 - progress * 0.7,
            rotate: progress * 360
          }}
          style={{
            position: 'absolute',
            top: '25%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300, height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, #f0c878 0%, #a8512a 30%, #3a1a0a 60%, #000 100%)',
            boxShadow: '0 0 80px #f0c878, inset -40px -40px 80px #000'
          }}
        />
        {/* 几何碎片 */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2
          const dist = 50 + progress * 150
          return (
            <motion.polygon
              key={i}
              animate={{
                x: Math.cos(angle) * dist,
                y: Math.sin(angle) * dist,
                opacity: 1 - progress
              }}
              points="0,-3 2,0 0,3 -2,0"
              fill="#c8a464"
              style={{ mixBlendMode: 'screen' }}
            />
          )
        })}
        {/* 引力透镜环 */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: 1 - progress * (0.2 + i * 0.1),
              opacity: (1 - progress) * (1 - i * 0.15)
            }}
            style={{
              position: 'absolute',
              top: '25%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 320, height: 320,
              borderRadius: '50%',
              border: '1px solid #c8a464',
              mixBlendMode: 'screen'
            }}
          />
        ))}
      </motion.div>
      {/* 老头剪影 - 底部 */}
      <div style={{
        position: 'absolute',
        bottom: '20%', left: '50%',
        transform: 'translateX(-50%)'
      }}>
        <svg width="100" height="80" viewBox="0 0 100 80">
          <g transform="translate(50, 40)">
            <ellipse cx="0" cy="-12" rx="10" ry="2" fill="#1a0a05" />
            <path d="M -5 -12 L -4 -20 L 4 -20 L 5 -12 Z" fill="#1a0a05" />
            <circle cx="0" cy="-8" r="4" fill="#000" />
            <path d="M -6 -6 L -8 18 L 8 18 L 6 -6 Z" fill="#000" />
            {/* 推出之手 */}
            <ellipse cx="14" cy="0" rx="6" ry="3" fill="#000" />
            <line x1="14" y1="0" x2="20" y2="0" stroke="#000" strokeWidth="2" />
          </g>
        </svg>
      </div>
      <Shockwave progress={progress} color="#c8a464" maxScale={3} rings={2} />
    </div>
  )
}
