// 后处理效果 - Bloom + Vignette + Noise
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
} from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"
import { useAudioStore } from "@/store/useAudioStore"

export function Postprocessing() {
  const glow = useAudioStore((s) => s.glow)

  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        intensity={0.6 + glow * 0.9}
        luminanceThreshold={0.08}
        luminanceSmoothing={0.5}
        mipmapBlur
      />
      <Noise opacity={0.04} blendFunction={BlendFunction.OVERLAY} />
      <Vignette eskil={false} offset={0.15} darkness={0.7} />
    </EffectComposer>
  )
}
