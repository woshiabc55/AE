/**
 * Shot 15 — 大全景 · 水墨金龙贯穿
 * 360度环绕
 */
import { motion } from 'framer-motion'
import InkDragon from '../components/effects/InkDragon.jsx'

export default function Shot15({ progress }) {
  return (
    <div className="shot-layer" style={{
      background: 'radial-gradient(ellipse at center, #1a0a05 0%, #000 100%)',
      perspective: '1400px'
    }}>
      <motion.div
        style={{
          position: 'absolute', inset: 0,
          transformStyle: 'preserve-3d'
        }}
        animate={{
          rotateY: progress * 360,
          rotateX: progress * 15
        }}
      >
        {/* 巨兽轮廓 - 远景 */}
        <div style={{
          position: 'absolute',
          top: '30%', left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 1 - progress
        }}>
          <svg width="500" height="280" viewBox="0 0 200 112">
            <path
              d="M 100 56
                 C 60 30, 30 35, 15 25
                 C 8 22, 5 28, 12 35
                 C 22 42, 30 50, 25 60
                 C 18 70, 22 80, 35 75
                 C 50 68, 60 72, 70 65
                 C 80 78, 90 80, 100 75
                 C 110 80, 120 78, 130 65
                 C 140 72, 150 68, 165 75
                 C 178 80, 182 70, 175 60
                 C 170 50, 178 42, 188 35
                 C 195 28, 192 22, 185 25
                 C 170 35, 140 30, 100 56 Z"
              fill="#0a0402"
            />
          </svg>
        </div>
        {/* 金龙贯穿 */}
        <InkDragon progress={progress} />
        {/* 金光爆发 */}
        <div style={{
          position: 'absolute', top: '40%', left: '20%',
          transform: 'translate(-50%, -50%)',
          width: 100, height: 100,
          background: 'radial-gradient(circle, #f0c878 0%, transparent 70%)',
          mixBlendMode: 'screen',
          filter: 'blur(10px)',
          opacity: progress
        }} />
      </motion.div>
      {/* 宇宙星尘 */}
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: 1, height: 1,
            background: '#c8a464',
            borderRadius: '50%',
            opacity: 0.6
          }}
        />
      ))}
    </div>
  )
}
