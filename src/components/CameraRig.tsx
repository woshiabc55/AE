// 相机控制器 - 鼠标视差 + 音频低频摆动
import { useFrame, useThree } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"
import { useAudioStore } from "@/store/useAudioStore"
import { useMouseParax } from "@/hooks/useMouseParax"

export function CameraRig() {
  const { camera } = useThree()
  const mouse = useMouseParax()
  const targetPos = useRef(new THREE.Vector3(0, 0.4, 8))
  const basePos = useRef(new THREE.Vector3(0, 0.4, 8))

  useFrame((state) => {
    const store = useAudioStore.getState()
    const bass = store.bassLevel
    const beat = store.beatPulse
    const time = state.clock.elapsedTime

    // 基础位置：缓慢漂移
    basePos.current.set(
      Math.sin(time * 0.15) * 0.4,
      0.4 + Math.cos(time * 0.18) * 0.3,
      8
    )

    // 目标位置 = 基础 + 鼠标视差 + 低频摆动
    targetPos.current.set(
      basePos.current.x + mouse.x * 0.8,
      basePos.current.y + mouse.y * 0.5,
      basePos.current.z + bass * 0.6 + beat * 0.3
    )

    // 平滑过渡
    camera.position.lerp(targetPos.current, 0.04)

    // 略微俯视中心
    camera.lookAt(0, 0, 0)
  })

  return null
}
