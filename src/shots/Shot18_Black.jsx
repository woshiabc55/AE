/**
 * Shot 18 — 黑屏 · 编钟余韵
 */
export default function Shot18({ progress }) {
  return (
    <div className="shot-layer" style={{
      background: '#000'
    }}>
      {/* 钟波 */}
      {Array.from({ length: 5 }).map((_, i) => {
        const ringP = (progress - i * 0.15) % 1
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 100 + ringP * 600,
              height: 100 + ringP * 600,
              borderRadius: '50%',
              border: '1px solid #c8a464',
              opacity: (1 - ringP) * 0.4,
              mixBlendMode: 'screen'
            }}
          />
        )
      })}
      {/* 钟形光晕 */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 200, height: 200,
        background: 'radial-gradient(circle, #c8a464 0%, transparent 70%)',
        opacity: 0.3 * (1 - progress),
        mixBlendMode: 'screen',
        filter: 'blur(20px)'
      }} />
      {/* 字幕 — 片名 */}
      <div style={{
        position: 'absolute',
        top: '40%', left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: 'var(--f-display)',
        fontSize: 64,
        color: '#c8a464',
        textShadow: '0 0 30px #c8a464, 0 0 60px #c8a464',
        letterSpacing: '0.5em',
        opacity: progress,
        textAlign: 'center',
        whiteSpace: 'nowrap'
      }}>
        觉 醒
      </div>
      <div style={{
        position: 'absolute',
        top: '55%', left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: 'var(--f-mono)',
        fontSize: 11,
        color: '#8a6f44',
        letterSpacing: '0.5em',
        opacity: progress * 0.8
      }}>
        THE AWAKENING
      </div>
    </div>
  )
}
