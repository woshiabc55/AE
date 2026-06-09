import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { usePlayer } from '../context/PlayerContext.jsx'

import Shot01 from '../shots/Shot01_Desert.jsx'
import Shot02 from '../shots/Shot02_Farmer.jsx'
import Shot03 from '../shots/Shot03_Eye.jsx'
import Shot04 from '../shots/Shot04_Ruins.jsx'
import Shot05 from '../shots/Shot05_Confront.jsx'
import Shot06 from '../shots/Shot06_Incant.jsx'
import Shot07 from '../shots/Shot07_Meteor.jsx'
import Shot08 from '../shots/Shot08_Knight.jsx'
import Shot09 from '../shots/Shot09_Face.jsx'
import Shot10 from '../shots/Shot10_Push.jsx'
import Shot11 from '../shots/Shot11_Wave.jsx'
import Shot12 from '../shots/Shot12_FirstHit.jsx'
import Shot13 from '../shots/Shot13_Cosmos.jsx'
import Shot14 from '../shots/Shot14_Tear.jsx'
import Shot15 from '../shots/Shot15_Dragon.jsx'
import Shot16 from '../shots/Shot16_Aftermath.jsx'
import Shot17 from '../shots/Shot17_Wink.jsx'
import Shot18 from '../shots/Shot18_Black.jsx'

const SHOT_MAP = {
  Desert: Shot01, Farmer: Shot02, Eye: Shot03, Ruins: Shot04,
  Confront: Shot05, Incant: Shot06, Meteor: Shot07, Knight: Shot08,
  Face: Shot09, Push: Shot10, Wave: Shot11, FirstHit: Shot12,
  Cosmos: Shot13, Tear: Shot14, Dragon: Shot15, Aftermath: Shot16,
  Wink: Shot17, Black: Shot18
}

export default function ShotRenderer() {
  const { currentShot, shotProgress } = usePlayer()
  const ShotComp = SHOT_MAP[currentShot.render] || Shot01

  // 镜头运动变换参数
  const cam = currentShot.camera || {}
  const scale = cam.startScale + (cam.endScale - cam.startScale) * shotProgress
  const ty = (cam.startY || 0) + ((cam.endY || 0) - (cam.startY || 0)) * shotProgress
  const rotate = (cam.rotate || 0) * shotProgress

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      background: '#000'
    }}>
      <motion.div
        key={currentShot.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateY(${ty}%) scale(${scale}) rotate(${rotate}deg)`,
          transformOrigin: 'center center',
          transition: 'transform 0.05s linear',
          filter: cam.blur && shotProgress < 0.3 ? `blur(${(0.3 - shotProgress) * 8}px)` : 'none'
        }}
      >
        <ShotComp progress={shotProgress} />
      </motion.div>
    </div>
  )
}
