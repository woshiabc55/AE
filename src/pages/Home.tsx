// 主舞台页面 - 3D 音乐粒子
import { Canvas } from "@react-three/fiber"
import { ParticleField } from "@/components/ParticleField"
import { CameraRig } from "@/components/CameraRig"
import { Postprocessing } from "@/components/Postprocessing"
import { FrameDriver, GlobalShortcuts } from "@/components/FrameDriver"
import { HUD } from "@/components/HUD"
import { BackgroundCanvas } from "@/components/BackgroundCanvas"
import { Suspense } from "react"

export default function Home() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-void">
      <BackgroundCanvas />
      <div className="absolute inset-0 z-10">
        <Canvas
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            stencil: false,
            depth: false,
          }}
          camera={{ position: [0, 0.4, 8], fov: 55, near: 0.1, far: 100 }}
        >
          <color attach="background" args={["#06070C"]} />
          <ambientLight intensity={0.2} />
          <Suspense fallback={null}>
            <ParticleField />
          </Suspense>
          <CameraRig />
          <FrameDriver />
          <Postprocessing />
        </Canvas>
      </div>
      <HUD />
      <GlobalShortcuts />
    </div>
  )
}
