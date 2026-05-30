import { useEffect, useRef } from 'react'
import { conceptVert, conceptFrag } from '@/shaders/conceptArt'
import { useConceptArtStore } from '@/store/conceptArtStore'
import type { CinematicStyle, MoodType, LightingType } from '@/store/conceptArtStore'

const STYLE_MAP: Record<CinematicStyle, number> = {
  noir: 1.0, cyberpunk: 2.0, fantasy: 3.0, wasteland: 4.0,
  ocean: 5.0, forest: 6.0, space: 7.0, ancient: 8.0,
}
const MOOD_MAP: Record<MoodType, number> = {
  dramatic: 1.0, serene: 2.0, mysterious: 3.0,
  melancholic: 4.0, epic: 5.0, eerie: 6.0,
}
const LIGHTING_MAP: Record<LightingType, number> = {
  golden: 1.0, cold: 2.0, volumetric: 3.0,
  backlit: 4.0, neon: 5.0, moonlight: 6.0,
}

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function createProgram(gl: WebGLRenderingContext, vSrc: string, fSrc: string) {
  const v = createShader(gl, gl.VERTEX_SHADER, vSrc)
  const f = createShader(gl, gl.FRAGMENT_SHADER, fSrc)
  if (!v || !f) return null
  const prog = gl.createProgram()!
  gl.attachShader(prog, v)
  gl.attachShader(prog, f)
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error('Link error:', gl.getProgramInfoLog(prog))
    return null
  }
  return prog
}

export default function ConceptCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current!
    const gl = canvas.getContext('webgl2', { antialias: true, alpha: false })
      || canvas.getContext('webgl', { antialias: true, alpha: false })
    if (!gl) return

    const prog = createProgram(gl, conceptVert, conceptFrag)
    if (!prog) return

    const verts = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW)

    const posLoc = gl.getAttribLocation(prog, 'position')

    const uLocs: Record<string, WebGLUniformLocation | null> = {}
    const uniforms = [
      'uTime', 'uResolution', 'uMouse',
      'uStyle', 'uMood', 'uLighting',
      'uColorIntensity', 'uFogDensity', 'uCameraHeight',
      'uCameraAngle', 'uTimeOfDay', 'uParticleDensity',
      'uGrainAmount', 'uVignetteStrength', 'uDepthOfField',
    ]
    for (const u of uniforms) {
      uLocs[u] = gl.getUniformLocation(prog, u)
    }

    const startTime = performance.now()

    function render() {
      const dpr = Math.min(window.devicePixelRatio, 2)
      const w = Math.floor(canvas.clientWidth * dpr)
      const h = Math.floor(canvas.clientHeight * dpr)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      gl.viewport(0, 0, w, h)
      gl.useProgram(prog)

      gl.enableVertexAttribArray(posLoc)
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

      const s = useConceptArtStore.getState().scene
      gl.uniform1f(uLocs.uTime!, (performance.now() - startTime) / 1000)
      gl.uniform2f(uLocs.uResolution!, w, h)
      gl.uniform2f(uLocs.uMouse!, 0.5, 0.5)
      gl.uniform1f(uLocs.uStyle!, STYLE_MAP[s.style])
      gl.uniform1f(uLocs.uMood!, MOOD_MAP[s.mood])
      gl.uniform1f(uLocs.uLighting!, LIGHTING_MAP[s.lighting])
      gl.uniform1f(uLocs.uColorIntensity!, s.colorIntensity)
      gl.uniform1f(uLocs.uFogDensity!, s.fogDensity)
      gl.uniform1f(uLocs.uCameraHeight!, s.cameraHeight)
      gl.uniform1f(uLocs.uCameraAngle!, s.cameraAngle)
      gl.uniform1f(uLocs.uTimeOfDay!, s.timeOfDay)
      gl.uniform1f(uLocs.uParticleDensity!, s.particleDensity)
      gl.uniform1f(uLocs.uGrainAmount!, s.grainAmount)
      gl.uniform1f(uLocs.uVignetteStrength!, s.vignetteStrength)
      gl.uniform1f(uLocs.uDepthOfField!, s.depthOfField)

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      animRef.current = requestAnimationFrame(render)
    }

    render()
    return () => {
      cancelAnimationFrame(animRef.current)
      gl.deleteProgram(prog)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  )
}
