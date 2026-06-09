/**
 * Shot 06 — 特写 · 咒语
 * "炽龙！逮住他！"
 */
import { motion } from 'framer-motion'

export default function Shot06({ progress }) {
  return (
    <div className="shot-layer" style={{
      background: 'radial-gradient(ellipse at center, #3a1a0a 0%, #0a0402 70%)'
    }}>
      <svg width="100%" height="100%" viewBox="0 0 100 56" preserveAspectRatio="none">
        {/* 嘴部特写 */}
        <g transform="translate(50, 28)">
          <ellipse cx="0" cy="0" rx="20" ry="15" fill="#1a0a05" opacity="0.4" />
          <ellipse cx="0" cy="2" rx="10" ry="8" fill="#8a5a3a" />
          {/* 嘴张开 */}
          <motion.ellipse
            cx="0" cy="3"
            rx={3 + progress * 3}
            ry={1 + progress * 2.5}
            fill="#0a0402"
            animate={{
              rx: 3 + progress * 3,
              ry: 1 + progress * 2.5
            }}
          />
          {/* 牙齿 */}
          <rect x="-1.5" y="2" width="0.5" height="1" fill="#e8d9b6" />
          <rect x="-0.5" y="2" width="0.5" height="1" fill="#e8d9b6" />
          <rect x="0.5" y="2" width="0.5" height="1" fill="#e8d9b6" />
        </g>
        {/* 咒语字符 - 飘散 */}
        {Array.from({ length: 12 }).map((_, i) => {
          const t = (progress * 2 + i / 12) % 1
          const x = 50 + Math.sin(t * Math.PI * 2 + i) * 30
          const y = 28 - t * 25
          return (
            <text
              key={i}
              x={x}
              y={y}
              fontSize="2"
              fill="#f0c878"
              opacity={1 - t}
              textAnchor="middle"
              style={{ mixBlendMode: 'screen' }}
            >
              {['炽', '龙', '逮', '住', '他', '咒', '敕', '令', '封', '镇', '诛', '灭'][i]}
            </text>
          )
        })}
        {/* 空间扭曲波纹 */}
        {Array.from({ length: 3 }).map((_, i) => (
          <circle
            key={i}
            cx="50"
            cy="28"
            r={progress * 30 + i * 8}
            fill="none"
            stroke="#c8a464"
            strokeWidth="0.2"
            opacity={progress * (1 - i * 0.3)}
            style={{ mixBlendMode: 'screen' }}
          />
        ))}
      </svg>
      {/* 台词字幕 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          position: 'absolute',
          bottom: '15%', left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'var(--f-serif)',
          fontSize: 28,
          color: '#f0c878',
          textShadow: '0 0 12px #c8a464, 0 0 24px #c8a464',
          letterSpacing: '0.3em',
          whiteSpace: 'nowrap'
        }}
      >
        炽龙！逮住他！
      </motion.div>
    </div>
  )
}
