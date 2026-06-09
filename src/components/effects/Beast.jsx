/**
 * 太空巨兽 — 剪影
 */
export default function Beast({ progress = 0, scale = 1 }) {
  return (
    <div className="shot-layer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="80%" height="80%" viewBox="0 0 200 112" style={{ transform: `scale(${0.7 + progress * 0.3 * scale})` }}>
        <defs>
          <linearGradient id="beastGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000" stopOpacity="1" />
            <stop offset="60%" stopColor="#0a0608" stopOpacity="1" />
            <stop offset="100%" stopColor="#1a0a05" stopOpacity="1" />
          </linearGradient>
          <radialGradient id="beastEye" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#f0c878" />
            <stop offset="50%" stopColor="#c8a464" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* 巨兽剪影 - 多触手异形 */}
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
          fill="url(#beastGrad)"
          opacity="0.95"
        />
        {/* 鳞片纹理 */}
        {Array.from({ length: 20 }).map((_, i) => (
          <circle
            key={i}
            cx={30 + i * 7 + Math.sin(i) * 5}
            cy={50 + Math.cos(i * 0.5) * 15}
            r="2"
            fill="#1a0a05"
            opacity="0.5"
          />
        ))}
        {/* 眼睛群 */}
        <circle cx="70" cy="48" r="3" fill="url(#beastEye)" style={{ mixBlendMode: 'screen' }} />
        <circle cx="90" cy="52" r="2.5" fill="url(#beastEye)" style={{ mixBlendMode: 'screen' }} />
        <circle cx="110" cy="52" r="2.5" fill="url(#beastEye)" style={{ mixBlendMode: 'screen' }} />
        <circle cx="130" cy="48" r="3" fill="url(#beastEye)" style={{ mixBlendMode: 'screen' }} />
        <circle cx="85" cy="58" r="1.5" fill="url(#beastEye)" style={{ mixBlendMode: 'screen' }} />
        <circle cx="115" cy="58" r="1.5" fill="url(#beastEye)" style={{ mixBlendMode: 'screen' }} />
        {/* 巨口 */}
        <path
          d="M 85 65 Q 100 72 115 65"
          stroke="#000"
          strokeWidth="2"
          fill="#0a0604"
        />
        <path
          d="M 85 65 L 90 67 M 95 68 L 100 70 M 105 68 L 110 67"
          stroke="#c8a464"
          strokeWidth="0.5"
          opacity="0.6"
        />
      </svg>
      {/* 眼睛光晕 */}
      <div style={{
        position: 'absolute',
        top: '38%', left: '32%',
        width: 30, height: 30,
        background: 'radial-gradient(circle, #f0c878 0%, transparent 70%)',
        mixBlendMode: 'screen',
        filter: 'blur(8px)',
        opacity: progress
      }} />
    </div>
  )
}
