/**
 * Shot 08 — 中景 · 金属铠甲骑士
 * 逆光剪影
 */
import Particles from '../components/effects/Particles.jsx'

export default function Shot08({ progress }) {
  return (
    <div className="shot-layer" style={{
      background: 'linear-gradient(to bottom, #f0c878 0%, #c8a464 30%, #1a0a05 100%)'
    }}>
      {/* 强逆光 */}
      <div style={{
        position: 'absolute',
        top: '15%', left: '50%',
        transform: 'translateX(-50%)',
        width: 400, height: 400,
        background: 'radial-gradient(circle, #fff 0%, #f0c878 30%, transparent 60%)',
        mixBlendMode: 'screen',
        filter: 'blur(20px)',
        opacity: 0.7
      }} />
      <Particles count={100} color="#c8a464" size={1.5} speed={0.5} blur />
      <svg width="100%" height="100%" viewBox="0 0 100 56" preserveAspectRatio="none">
        {/* 骑士剪影 */}
        <g transform="translate(50, 32)">
          {/* 头盔 */}
          <path d="M -3 -8 L -4 -3 L -3 0 L 3 0 L 4 -3 L 3 -8 Z" fill="#000" />
          {/* 头盔顶刺 */}
          <path d="M 0 -8 L -0.5 -11 L 0.5 -11 Z" fill="#000" />
          {/* 身躯铠甲 */}
          <path d="M -5 -1 L -6 12 L 6 12 L 5 -1 Z" fill="#000" />
          {/* 胸甲刻线 */}
          <line x1="-4" y1="2" x2="4" y2="2" stroke="#5a4630" strokeWidth="0.2" />
          <line x1="-4" y1="6" x2="4" y2="6" stroke="#5a4630" strokeWidth="0.2" />
          {/* 肩甲 */}
          <ellipse cx="-5" cy="0" rx="2" ry="3" fill="#000" />
          <ellipse cx="5" cy="0" rx="2" ry="3" fill="#000" />
          {/* 手臂 */}
          <path d="M -6 2 L -8 12" stroke="#000" strokeWidth="2" fill="none" />
          <path d="M 6 2 L 8 12" stroke="#000" strokeWidth="2" fill="none" />
          {/* 武器 - 长剑 */}
          <line x1="-8" y1="0" x2="-12" y2="-12" stroke="#000" strokeWidth="0.8" />
          <rect x="-12.5" y="-13" width="1" height="2" fill="#000" />
        </g>
      </svg>
    </div>
  )
}
