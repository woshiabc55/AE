import { useEffect, useState } from 'react'
import type { SceneId } from '@/engine/types'
import { sceneInfo } from '@/engine/types'
import KilnFireCanvas from '@/components/canvas/KilnFireCanvas'
import CrackCanvas from '@/components/canvas/CrackCanvas'
import ShardCanvas from '@/components/canvas/ShardCanvas'

interface BackgroundLayerProps {
  scene: SceneId
  transition?: 'fade' | 'dissolve' | 'slide_left' | 'slide_right' | 'crack' | 'shard'
}

export default function BackgroundLayer({ scene, transition = 'fade' }: BackgroundLayerProps) {
  const [currentScene, setCurrentScene] = useState(scene)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    if (scene === currentScene) return

    setIsTransitioning(true)
    setOpacity(0)

    const timer = setTimeout(() => {
      setCurrentScene(scene)
      setOpacity(1)
      setIsTransitioning(false)
    }, transition === 'crack' || transition === 'shard' ? 1200 : 600)

    return () => clearTimeout(timer)
  }, [scene, currentScene, transition])

  const info = sceneInfo[currentScene]

  const renderSceneEffect = () => {
    switch (currentScene) {
      case 'kiln_night':
      case 'kiln_day':
      case 'ancient_kiln_exterior':
      case 'ancient_kiln_interior':
      case 'joint_firing':
        return <KilnFireCanvas intensity={0.5} colorScheme={currentScene.includes('ancient') || currentScene === 'kiln_night' ? 'warm' : 'mixed'} />
      case 'crack_closeup':
        return <CrackCanvas progress={isTransitioning ? 0 : 1} />
      case 'shard_closeup':
      case 'creek':
        return <ShardCanvas progress={isTransitioning ? 0 : 1} />
      case 'storm_night':
        return <KilnFireCanvas intensity={0.8} colorScheme="warm" />
      case 'summer_camp':
        return <KilnFireCanvas intensity={0.3} colorScheme="mixed" />
      case 'resonance':
        return <KilnFireCanvas intensity={0.6} colorScheme="mixed" />
      default:
        return null
    }
  }

  return (
    <div className="absolute inset-0 z-0">
      <div
        className={`absolute inset-0 bg-gradient-to-b ${info.bgStyle} transition-opacity duration-500`}
        style={{ opacity }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ opacity }}
      >
        {renderSceneEffect()}
      </div>

      {currentScene === 'storm_night' && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 bg-glaze-50/5"
            style={{
              animation: 'lightning 4s infinite',
            }}
          />
        </div>
      )}

      {currentScene === 'crack_closeup' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 rounded-full bg-gold-400/5 animate-glow" />
        </div>
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
