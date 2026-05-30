import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { SceneId, ParticleConfig, SceneAtmosphere, LightData, CameraData } from '@/engine/types'
import { sceneInfo } from '@/engine/types'
import KilnFireCanvas from '@/components/canvas/KilnFireCanvas'
import CrackCanvas from '@/components/canvas/CrackCanvas'
import ShardCanvas from '@/components/canvas/ShardCanvas'
import { useCanvasAnimation } from '@/hooks/useCanvasAnimation'

interface BackgroundLayerProps {
  scene: SceneId
  transition?: 'fade' | 'dissolve' | 'slide_left' | 'slide_right' | 'crack' | 'shard' | 'ink' | 'flash'
  particleConfig: ParticleConfig
  atmosphere: Partial<SceneAtmosphere>
  light: Partial<LightData>
  camera: CameraData
}

export default function BackgroundLayer({
  scene,
  transition = 'fade',
  particleConfig,
  atmosphere,
  light,
  camera,
}: BackgroundLayerProps) {
  const [currentScene, setCurrentScene] = useState(scene)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [opacity, setOpacity] = useState(1)
  const [flashOpacity, setFlashOpacity] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scene === currentScene) return

    if (transition === 'flash') {
      setFlashOpacity(1)
      setIsTransitioning(true)
      const switchTimer = setTimeout(() => setCurrentScene(scene), 150)
      const fadeTimer = setTimeout(() => {
        setFlashOpacity(0)
        setIsTransitioning(false)
      }, 400)
      return () => {
        clearTimeout(switchTimer)
        clearTimeout(fadeTimer)
      }
    }

    setIsTransitioning(true)
    setOpacity(0)
    const duration = transition === 'crack' || transition === 'shard' || transition === 'ink' ? 1200 : 600
    const timer = setTimeout(() => {
      setCurrentScene(scene)
      setOpacity(1)
      setIsTransitioning(false)
    }, duration)
    return () => clearTimeout(timer)
  }, [scene, currentScene, transition])

  useEffect(() => {
    if (camera.shake <= 0) {
      if (containerRef.current) {
        containerRef.current.style.transform = ''
      }
      return
    }
    let frame: number
    const run = () => {
      if (containerRef.current) {
        const x = (Math.random() - 0.5) * 2 * camera.shake
        const y = (Math.random() - 0.5) * 2 * camera.shake
        containerRef.current.style.transform = `translate(${x}px, ${y}px)`
      }
      frame = requestAnimationFrame(run)
    }
    frame = requestAnimationFrame(run)
    return () => cancelAnimationFrame(frame)
  }, [camera.shake])

  const info = sceneInfo[currentScene]

  const vignetteStrength = atmosphere.vignetteStrength ?? 0.4
  const grainIntensity = atmosphere.grainIntensity ?? 0.02
  const fogDensity = atmosphere.fogDensity ?? 0
  const fogColor = atmosphere.fogColor ?? '#1a1410'
  const lightRays = atmosphere.lightRays ?? false
  const lightRayColor = atmosphere.lightRayColor ?? '#F5F0E8'

  const glowColorMap: Record<string, string> = { warm: '#D4622B', cool: '#4A7C59', mixed: '#B46E32' }

  const kilnConfig = useMemo<ParticleConfig>(() => {
    const scheme = currentScene.includes('ancient') || currentScene === 'kiln_night' ? 'warm' : 'mixed'
    return { intensity: 0.5, colorScheme: scheme, direction: 'up', speed: 0.5, sizeRange: [2, 6], glowRadius: 300, glowColor: glowColorMap[scheme] }
  }, [currentScene])

  const stormConfig = useMemo<ParticleConfig>(() => ({
    intensity: 0.8, colorScheme: 'warm', direction: 'up', speed: 0.8, sizeRange: [2, 6], glowRadius: 300, glowColor: '#D4622B',
  }), [])

  const campConfig = useMemo<ParticleConfig>(() => ({
    intensity: 0.3, colorScheme: 'mixed', direction: 'up', speed: 0.3, sizeRange: [2, 6], glowRadius: 300, glowColor: '#B46E32',
  }), [])

  const resonanceConfig = useMemo<ParticleConfig>(() => ({
    intensity: 0.6, colorScheme: 'mixed', direction: 'up', speed: 0.6, sizeRange: [2, 6], glowRadius: 300, glowColor: '#B46E32',
  }), [])

  const renderSceneEffect = () => {
    switch (currentScene) {
      case 'kiln_night':
      case 'kiln_day':
      case 'ancient_kiln_exterior':
      case 'ancient_kiln_interior':
      case 'joint_firing':
        return <KilnFireCanvas config={kilnConfig} />
      case 'crack_closeup':
        return <CrackCanvas progress={isTransitioning ? 0 : 1} />
      case 'shard_closeup':
      case 'creek':
        return <ShardCanvas progress={isTransitioning ? 0 : 1} />
      case 'storm_night':
        return <KilnFireCanvas config={stormConfig} />
      case 'summer_camp':
        return <KilnFireCanvas config={campConfig} />
      case 'resonance':
        return <KilnFireCanvas config={resonanceConfig} />
      default:
        return null
    }
  }

  const grainDraw = useCallback(
    (ctx: CanvasRenderingContext2D, _time: number, _delta: number) => {
      const width = ctx.canvas.getBoundingClientRect().width
      const height = ctx.canvas.getBoundingClientRect().height
      if (width === 0 || height === 0) return
      ctx.clearRect(0, 0, width, height)
      const count = Math.floor(grainIntensity * 6000)
      ctx.fillStyle = `rgba(200,200,200,${Math.min(grainIntensity * 4, 0.3)})`
      for (let i = 0; i < count; i++) {
        ctx.fillRect(Math.random() * width, Math.random() * height, 1.5, 1.5)
      }
    },
    [grainIntensity],
  )

  const grainCanvasRef = useCanvasAnimation(grainDraw)

  const fogHex = Math.round(Math.min(fogDensity, 1) * 255).toString(16).padStart(2, '0')

  return (
    <div ref={containerRef} className="absolute inset-0 z-0">
      <div
        className={`absolute inset-0 bg-gradient-to-b ${info.bgStyle} transition-opacity duration-500`}
        style={{ opacity }}
      />
      <div className="absolute inset-0 transition-opacity duration-500" style={{ opacity }}>
        {renderSceneEffect()}
      </div>

      {fogDensity > 0 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, transparent 0%, ${fogColor}${fogHex} 50%, transparent 100%)`,
          }}
        />
      )}

      {lightRays && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-0"
            style={{
              left: '20%',
              width: '8%',
              height: '100%',
              background: `linear-gradient(to bottom, ${lightRayColor}30, transparent 70%)`,
              transform: 'skewX(-5deg)',
            }}
          />
          <div
            className="absolute top-0"
            style={{
              left: '45%',
              width: '12%',
              height: '100%',
              background: `linear-gradient(to bottom, ${lightRayColor}25, transparent 60%)`,
              transform: 'skewX(3deg)',
            }}
          />
          <div
            className="absolute top-0"
            style={{
              left: '70%',
              width: '6%',
              height: '100%',
              background: `linear-gradient(to bottom, ${lightRayColor}20, transparent 65%)`,
              transform: 'skewX(-8deg)',
            }}
          />
        </div>
      )}

      {light.pulse && (light.pulseSpeed ?? 0) >= 3 && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 bg-glaze-50/5"
            style={{ animation: 'lightning 4s infinite' }}
          />
        </div>
      )}

      {currentScene === 'crack_closeup' && lightRays && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 rounded-full bg-gold-400/5 animate-glow" />
        </div>
      )}

      {grainIntensity > 0 && (
        <canvas
          ref={grainCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ mixBlendMode: 'overlay' }}
        />
      )}

      {vignetteStrength > 0 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 ${Math.floor(vignetteStrength * 150)}px ${Math.floor(vignetteStrength * 80)}px rgba(0,0,0,${vignetteStrength})`,
          }}
        />
      )}

      {flashOpacity > 0 && (
        <div
          className="absolute inset-0 bg-white pointer-events-none transition-opacity duration-300"
          style={{ opacity: flashOpacity }}
        />
      )}

      <style>{`
        @keyframes lightning {
          0%, 90%, 100% { opacity: 0; }
          92%, 94% { opacity: 0.3; }
          93% { opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}
