/**
 * Shot 07 — 大全景 · 行星坠落
 */
import Meteor from '../components/effects/Meteor.jsx'
import Particles from '../components/effects/Particles.jsx'

export default function Shot07({ progress }) {
  return (
    <div className="shot-layer" style={{
      background: 'linear-gradient(to bottom, #000 0%, #1a0a05 30%, #3a1a0a 70%, #6b4524 100%)'
    }}>
      {/* 天空撕裂 */}
      <div style={{
        position: 'absolute', top: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: 2, height: '30%',
        background: 'linear-gradient(to bottom, #fff 0%, #f0c878 50%, transparent 100%)',
        opacity: progress * 0.8,
        boxShadow: '0 0 30px #f0c878',
        mixBlendMode: 'screen'
      }} />
      <Meteor progress={progress} />
      <Particles count={200} color="#f0c878" size={2} speed={1.2} spread={50} />
      {/* 冲击波环 */}
      {progress > 0.5 && (
        <div style={{
          position: 'absolute', left: '50%', bottom: '15%',
          transform: 'translate(-50%, 0)',
          width: (progress - 0.5) * 100 + '%',
          height: (progress - 0.5) * 40 + '%',
          borderRadius: '50%',
          border: '2px solid #f0c878',
          opacity: 1 - progress,
          boxShadow: '0 0 40px #f0c878',
          mixBlendMode: 'screen'
        }} />
      )}
    </div>
  )
}
