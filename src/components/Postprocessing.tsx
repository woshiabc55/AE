// 后处理效果 - 精简版：仅 Bloom + Vignette
import {
  EffectComposer,
  Bloom,
  Vignette,
} from "@react-three/postprocessing"
import { useAudioStore } from "@/store/useAudioStore"

export function Postprocessing() {
  const glow = useAudioStore((s) => s.glow)

  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        intensity={0.5 + glow * 0.7}
        luminanceThreshold={0.1}
        luminanceSmoothing={0.5}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.2} darkness={0.7} />
    </EffectComposer>
  )
}
