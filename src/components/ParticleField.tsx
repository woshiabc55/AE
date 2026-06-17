// 3D 粒子系统 - 核心渲染
// 使用 InstancedMesh + 自定义 Shader Material
// 性能：单 draw call，30000 粒子

import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import { useAudioStore, countFromDensity } from "@/store/useAudioStore"
import { basePosition, dynamicOffset, type PresetId } from "@/lib/presets"
import { PALETTES, sampleColor, type Palette } from "@/lib/palettes"

const MAX_PARTICLES = 5000

// 顶点着色器 - 计算位置 + 颜色 + 大小（精简版）
const vertexShader = /* glsl */ `
  attribute float aIndex;
  attribute float aFreq;
  uniform float uTime;
  uniform float uSize;
  uniform float uBass;
  uniform float uMid;
  uniform float uBeat;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform vec3 uColorD;
  varying float vIntensity;
  varying vec3 vColor;

  void main() {
    vec3 pos = position;
    float t = aIndex / 5000.0;
    float beatBoost = uBeat * 1.5;
    float freq = aFreq;

    // 个体大小
    float sizeBoost = 1.0 + freq * 1.6 + uBass * 0.5 + beatBoost * 0.4;
    vIntensity = clamp(freq * 1.3 + uBass * 0.4 + beatBoost * 0.25, 0.1, 2.0);

    // 颜色：索引 + 轻微时间偏移
    float colorT = fract(t + uTime * 0.04 + uMid * 0.25);
    float idx = colorT * 3.0;
    float i0 = floor(idx);
    float f = fract(idx);
    if (i0 < 0.5) vColor = mix(uColorA, uColorB, f);
    else if (i0 < 1.5) vColor = mix(uColorB, uColorC, f);
    else vColor = mix(uColorC, uColorD, f);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * sizeBoost * (300.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`

// 片元着色器 - 圆形软粒子（精简版）
const fragmentShader = /* glsl */ `
  uniform float uGlow;
  varying float vIntensity;
  varying vec3 vColor;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);
    if (r > 0.5) discard;
    float core = smoothstep(0.5, 0.0, r);
    vec3 col = vColor * (1.0 + uGlow * 0.6);
    col += vColor * vIntensity * (1.0 - r * 1.2);
    gl_FragColor = vec4(col, core * vIntensity);
  }
`

export function ParticleField() {
  const meshRef = useRef<THREE.Points>(null)
  const { gl } = useThree()

  // 初始化属性缓冲
  const { geometry, material } = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    const positions = new Float32Array(MAX_PARTICLES * 3)
    const indices = new Float32Array(MAX_PARTICLES)
    const freqs = new Float32Array(MAX_PARTICLES)

    for (let i = 0; i < MAX_PARTICLES; i++) {
      indices[i] = i
      freqs[i] = 0
    }
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geom.setAttribute("aIndex", new THREE.BufferAttribute(indices, 1))
    geom.setAttribute("aFreq", new THREE.BufferAttribute(freqs, 1))
    geom.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 100)

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 22 },
        uBass: { value: 0 },
        uMid: { value: 0 },
        uBeat: { value: 0 },
        uGlow: { value: 0.8 },
        uColorA: { value: new THREE.Color() },
        uColorB: { value: new THREE.Color() },
        uColorC: { value: new THREE.Color() },
        uColorD: { value: new THREE.Color() },
      },
    })
    return { geometry: geom, material: mat }
  }, [])

  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  // 全局：开启 additive blending 透明渲染
  useEffect(() => {
    gl.setClearColor(new THREE.Color("#06070C"), 1)
  }, [gl])

  // 临时变量避免每帧分配
  const tmpVec = useMemo(() => new THREE.Vector3(), [])
  const basePos = useMemo(() => new THREE.Vector3(), [])
  const targetPos = useMemo(() => new THREE.Vector3(), [])

  // 切换预设时重新计算基础位置（带平滑过渡）
  useEffect(() => {
    // 不重置位置，由动画自然过渡即可
  }, [])

  useFrame((state) => {
    const store = useAudioStore.getState()
    const preset = store.preset
    const density = store.density
    const speed = store.speed
    const glow = store.glow
    const palette: Palette = PALETTES[store.palette]
    const bass = store.bassLevel
    const mid = store.midLevel
    const beat = store.beatPulse
    const freqData = store.frequencyData
    const time = state.clock.elapsedTime

    // 计算当前实际粒子数
    const activeCount = countFromDensity(density)
    const visible = Math.min(activeCount, MAX_PARTICLES)

    const positions = geometry.attributes.position as THREE.BufferAttribute
    const freqs = geometry.attributes.aFreq as THREE.BufferAttribute

    // 更新 uniforms
    material.uniforms.uTime.value = time
    material.uniforms.uBass.value = bass
    material.uniforms.uMid.value = mid
    material.uniforms.uBeat.value = beat
    material.uniforms.uGlow.value = glow
    ;(material.uniforms.uColorA.value as THREE.Color).copy(palette.colors[0])
    ;(material.uniforms.uColorB.value as THREE.Color).copy(palette.colors[1])
    ;(material.uniforms.uColorC.value as THREE.Color).copy(palette.colors[2])
    ;(material.uniforms.uColorD.value as THREE.Color).copy(palette.colors[3])

    const posArr = positions.array as Float32Array
    const freqArr = freqs.array as Float32Array
    const freqLen = freqData.length
    const lerp = 0.2

    // 更新粒子位置
    for (let i = 0; i < visible; i++) {
      // 计算基础位置
      basePosition(preset, i, visible, basePos)
      // 动态偏移（在 basePos 上叠加）
      targetPos.copy(basePos)
      const freq = freqData[i % freqLen] / 255
      dynamicOffset(preset, i, time, freq, bass, beat, speed, targetPos)

      // 平滑插值到 target
      const idx = i * 3
      posArr[idx] += (targetPos.x - posArr[idx]) * lerp
      posArr[idx + 1] += (targetPos.y - posArr[idx + 1]) * lerp
      posArr[idx + 2] += (targetPos.z - posArr[idx + 2]) * lerp

      // 更新频段属性（带衰减）
      freqArr[i] += (freq - freqArr[i]) * 0.25
    }

    positions.needsUpdate = true
    freqs.needsUpdate = true

    // 控制实际渲染数
    if (meshRef.current) {
      meshRef.current.geometry.setDrawRange(0, visible)
    }
  })

  return (
    <points ref={meshRef} geometry={geometry} material={material} frustumCulled={false}>
    </points>
  )
}
