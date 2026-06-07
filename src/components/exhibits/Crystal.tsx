import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { mulberry32 } from '@/lib/random'

const PALETTES: Record<string, { bg: string; c1: string; c2: string; c3: string; light: string; ambient: string }> = {
  mist:  { bg: '#0A0B12', c1: '#D4AF37', c2: '#E8E4D8', c3: '#9aa0b4', light: '#FFE9B0', ambient: '#3a3320' },
  flame: { bg: '#120A0A', c1: '#EF476F', c2: '#FFB05C', c3: '#FFD166', light: '#FFE0B5', ambient: '#5a1a1a' },
  aurora:{ bg: '#0A1014', c1: '#5BC0EB', c2: '#06D6A0', c3: '#7B2CBF', light: '#A0F0FF', ambient: '#0e3640' },
  polar: { bg: '#050610', c1: '#7B2CBF', c2: '#5BC0EB', c3: '#E8E4D8', light: '#E0D0FF', ambient: '#1a0e2a' },
}

const COUNT = 8000
const GRID = 200

function Crystals({ palette }: { palette: keyof typeof PALETTES }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const tmp = useMemo(() => new THREE.Object3D(), [])
  const c1 = useMemo(() => new THREE.Color(PALETTES[palette].c1), [palette])
  const c2 = useMemo(() => new THREE.Color(PALETTES[palette].c2), [palette])
  const c3 = useMemo(() => new THREE.Color(PALETTES[palette].c3), [palette])

  const instances = useMemo(() => {
    const rng = mulberry32(0xC257415)
    const arr: { x: number; z: number; baseH: number; phase: number; tone: THREE.Color }[] = []
    for (let i = 0; i < COUNT; i++) {
      const gx = (i % GRID) - GRID / 2
      const gz = Math.floor(i / GRID) - GRID / 2
      const x = gx * 0.85 + (rng() - 0.5) * 0.4
      const z = gz * 0.85 + (rng() - 0.5) * 0.4
      const r = Math.hypot(x, z)
      const baseH = 1.5 + Math.max(0, 4 - r * 0.07) + rng() * 0.6
      const phase = rng() * Math.PI * 2
      const t = rng()
      const tone = t < 0.4 ? c1 : t < 0.75 ? c2 : c3
      arr.push({ x, z, baseH, phase, tone })
    }
    return arr
  }, [c1, c2, c3])

  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    for (let i = 0; i < instances.length; i++) {
      mesh.setColorAt(i, instances[i].tone)
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [instances])

  const { camera, pointer } = useThree()
  const target = useRef(new THREE.Vector3())

  useFrame((state) => {
    const t = state.clock.elapsedTime
    target.current.set(pointer.x * 6, 0, pointer.y * -6)
    for (let i = 0; i < COUNT; i++) {
      const it = instances[i]
      const sway = Math.sin(t * 0.7 + it.phase) * 0.04
      const dx = it.x - target.current.x
      const dz = it.z - target.current.z
      const d = Math.hypot(dx, dz)
      const k = Math.max(0, 1 - d / 3.5)
      const bendX = (dx / (d || 1)) * k * 0.6
      const bendZ = (dz / (d || 1)) * k * 0.6
      tmp.position.set(it.x + bendX, it.baseH * 0.5 + sway, it.z + bendZ)
      tmp.rotation.set(bendZ * 0.4, 0, -bendX * 0.4)
      tmp.scale.set(0.08, it.baseH, 0.08)
      tmp.updateMatrix()
      meshRef.current.setMatrixAt(i, tmp.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
    camera.position.x = Math.sin(t * 0.08) * 0.4
    camera.position.z = 8 + Math.cos(t * 0.08) * 0.4
    camera.lookAt(0, 1, 0)
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        metalness={0.65}
        roughness={0.15}
        emissiveIntensity={0.4}
        envMapIntensity={0.8}
        vertexColors={false}
      />
    </instancedMesh>
  )
}

function Rig({ palette }: { palette: keyof typeof PALETTES }) {
  const p = PALETTES[palette]
  return (
    <>
      <color attach="background" args={[p.bg]} />
      <fog attach="fog" args={[p.bg, 6, 22]} />
      <ambientLight intensity={0.4} color={p.ambient} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} color={p.light} />
      <directionalLight position={[-5, 3, -5]} intensity={0.6} color={p.c2} />
      <Crystals palette={palette} />
    </>
  )
}

export function Crystal() {
  const [palette, setPalette] = useState<keyof typeof PALETTES>('aurora')
  const order: (keyof typeof PALETTES)[] = ['aurora', 'mist', 'flame', 'polar']

  useEffect(() => {
    let i = 0
    const t = setInterval(() => {
      i = (i + 1) % order.length
      setPalette(order[i])
    }, 9000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Canvas
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
        camera={{ fov: 50, position: [0, 1.5, 8], near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <Rig palette={palette} />
          <EffectComposer multisampling={0}>
            <Bloom intensity={0.7} luminanceThreshold={0.55} luminanceSmoothing={0.4} mipmapBlur />
            <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.0008, 0.0008] as any} radialModulation={false} modulationOffset={0} />
            <Vignette eskil={false} offset={0.3} darkness={0.7} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute left-6 top-24 md:left-12 md:top-28 z-10 max-w-md">
        <div className="section-meta">
          <span className="num">03</span>
          <span>CRYSTAL · 晶阵</span>
        </div>
        <h2 className="font-display section-title mt-3 gilt-text">
          八千<br />晶柱<br />听风
        </h2>
        <p className="font-han section-sub mt-5">
          8,000 根晶柱形成对称山谷，光标是统一引力场。
          移动鼠标，看晶阵缓缓弯折。
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {(Object.keys(PALETTES) as (keyof typeof PALETTES)[]).map((k) => (
            <button
              key={k}
              onClick={() => setPalette(k)}
              className={`tag-pill transition-colors duration-500 ${palette === k ? 'bord-gilt-50 text-gilt' : ''}`}
              data-cursor="hover"
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute right-6 top-24 md:right-12 md:top-28 z-10 text-right font-mono text-[0.7rem] tracking-widest text-paper/60">
        <div>CRYSTALS · 8,000</div>
        <div className="text-paper/40 mt-1">DRAW CALLS · 1</div>
        <div className="text-paper/40 mt-1">PALETTE · {palette}</div>
      </div>
    </div>
  )
}
