/**
 * 冲击波 — 圆形扩散
 */
export default function Shockwave({
  progress = 0,
  color = '#c8a464',
  maxScale = 8,
  rings = 3
}) {
  return (
    <div className="shot-layer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {Array.from({ length: rings }).map((_, i) => {
        const delay = i * 0.15
        const p = Math.max(0, Math.min(1, progress - delay))
        const scale = 0.3 + p * maxScale
        const opacity = (1 - p) * 0.7
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 200,
              height: 200,
              borderRadius: '50%',
              border: `2px solid ${color}`,
              transform: `translate(-50%, -50%) scale(${scale})`,
              left: '50%',
              top: '50%',
              opacity,
              boxShadow: `0 0 ${40 + p * 80}px ${color}`,
              mixBlendMode: 'screen'
            }}
          />
        )
      })}
    </div>
  )
}
