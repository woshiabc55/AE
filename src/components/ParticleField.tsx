// 3D 粒子系统 - 核心渲染
// 使用 InstancedMesh + 自定义 Shader Material
// 性能：单 draw call，30000 粒子

import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import { useAudioStore, countFromDensity } from "@/store/useAudioStore"
import { basePosition, dynamicOffset, type PresetId } from "@/lib/presets"
import { PALETTES, sampleColor, type Palette } from "@/lib/palettes"

const MAX_PARTICLES = 30000

// 顶点着色器 - 计算位置 + 颜色 + 大小
const vertexShader = /* glsl */ `
  attribute float aIndex;
  attribute float aFreq;
  attribute vec3 aTarget;
  uniform float uTime;
  uniform float uSize;
  uniform float uBass;
  uniform float uMid;
  uniform float uTreble;
  uniform float uBeat;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform vec3 uColorD;
  varying float vIntensity;
  varying vec3 vColor;
  varying float vDist;

  vec3 sampleColor(float t) {
    float n = 3.0;
    float idx = t * n;
    float i0 = floor(idx);
    float f = fract(idx);
    if (i0 < 0.5) return mix(uColorA, uColorB, f);
    if (i0 < 1.5) return mix(uColorB, uColorC, f);
    if (i0 < 2.5) return mix(uColorC, uColorD, f);
    return mix(uColorD, uColorA, f);
  }

  void main() {
    vec3 pos = position;
    float t = aIndex / 30000.0;
    float beatBoost = uBeat * 1.5;
    float dist = length(pos);
    vDist = dist;

    // 个体大小：基于频段能量
    float freq = aFreq;
    float sizeBoost = 1.0 + freq * 1.8 + uBass * 0.6 + beatBoost * 0.5;
    vIntensity = clamp(freq * 1.4 + uBass * 0.5 + beatBoost * 0.3, 0.1, 2.5);

    // 颜色：根据索引 + 时间 + 音频
    float colorT = fract(t * 1.0 + uTime * 0.04 + uMid * 0.3);
    vec3 col = sampleColor(colorT);
    col = mix(col, uColorD, uTreble * 0.4);
    vColor = col;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * sizeBoost * (300.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`

// 片元着色器 - 圆形软粒子
const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uGlow;
  varying float vIntensity;
  varying vec3 vColor;
  varying float vDist;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);
    if (r > 0.5) discard;
    // 软核 + 外环
    float core = smoothstep(0.5, 0.0, r);
    float ring = smoothstep(0.5, 0.35, r) * 0.6;
    float a = core + ring * 0.3;
    vec3 col = vColor * (1.0 + uGlow * 0.8);
    col += vColor * vIntensity * (1.0 - r * 1.4);
    gl_FragColor = vec4(col, a * vIntensity);
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
    const targets = new Float32Array(MAX_PARTICLES * 3)

    for (let i = 0; i < MAX_PARTICLES; i++) {
      indices[i] = i
      freqs[i] = 0
      targets[i * 3] = 0
      targets[i * 3 + 1] = 0
      targets[i * 3 + 2] = 0
    }
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geom.setAttribute("aIndex", new THREE.BufferAttribute(indices, 1))
    geom.setAttribute("aFreq", new THREE.BufferAttribute(freqs, 1))
    geom.setAttribute("aTarget", new THREE.BufferAttribute(targets, 3))
    geom.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 100)

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 18 },
        uBass: { value: 0 },
        uMid: { value: 0 },
        uTreble: { value: 0 },
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

  useFrame((state, delta) => {
    const store = useAudioStore.getState()
    const preset = store.preset
    const density = store.density
    const speed = store.speed
    const glow = store.glow
    const palette: Palette = PALETTES[store.palette]
    const bass = store.bassLevel
    const mid = store.midLevel
    const treble = store.trebleLevel
    const beat = store.beatPulse
    const freqData = store.frequencyData
    const time = state.clock.elapsedTime

    // 计算当前实际粒子数
    const activeCount = countFromDensity(density)
    const visible = Math.min(activeCount, MAX_PARTICLES)

    const positions = geometry.attributes.position as THREE.BufferAttribute
    const freqs = geometry.attributes.aFreq as THREE.BufferAttribute
    const targets = geometry.attributes.aTarget as THREE.BufferAttribute

    // 更新 uniforms
    material.uniforms.uTime.value = time
    material.uniforms.uBass.value = bass
    material.uniforms.uMid.value = mid
    material.uniforms.uTreble.value = treble
    material.uniforms.uBeat.value = beat
    material.uniforms.uGlow.value = glow
    ;(material.uniforms.uColorA.value as THREE.Color).copy(palette.colors[0])
    ;(material.uniforms.uColorB.value as THREE.Color).copy(palette.colors[1])
    ;(material.uniforms.uColorC.value as THREE.Color).copy(palette.colors[2])
    ;(material.uniforms.uColorD.value as THREE.Color).copy(palette.colors[3])

    // 更新粒子位置
    for (let i = 0; i < visible; i++) {
      // 计算基础位置
      basePosition(preset, i, visible, basePos)
      // 动态偏移（在 basePos 上叠加）
      targetPos.copy(basePos)
      const freq = freqData[i % freqData.length] / 255
      dynamicOffset(preset, i, time, freq, bass, beat, speed, targetPos)

      // 平滑插值到 target
      const idx = i * 3
      const cur = positions.array as Float32Array
      cur[idx] += (targetPos.x - cur[idx]) * 0.18
      cur[idx + 1] += (targetPos.y - cur[idx + 1]) * 0.18
      cur[idx + 2] += (targetPos.z - cur[idx + 2]) * 0.18

      // 更新频段属性（带衰减）
      const freqArr = freqs.array as Float32Array
      freqArr[i] += (freq - freqArr[i]) * 0.25

      // target 缓冲备用
      const tArr = targets.array as Float32Array
      tArr[idx] = targetPos.x
      tArr[idx + 1] = targetPos.y
      tArr[idx + 2] = targetPos.z
    }

    // 不活跃粒子收到远处
    for (let i = visible; i < MAX_PARTICLES; i++) {
      const idx = i * 3
      const cur = positions.array as Float32Array
      cur[idx] = 0
      cur[idx + 1] = 0
      cur[idx + 2] = 0
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
