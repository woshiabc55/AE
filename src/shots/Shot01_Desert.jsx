/**
 * Shot 01 — 大全景 · 荒芜大地
 * 镜头：地面仰拍 → 急速拉升
 */
import Desert from '../components/effects/Desert.jsx'
import Particles from '../components/effects/Particles.jsx'

export default function Shot01({ progress }) {
  return (
    <>
      <Desert progress={progress} />
      <Particles count={150} color="#c8a464" size={1.5} speed={0.4} blur />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)'
      }} />
    </>
  )
}
