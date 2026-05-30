import { useCallback, useEffect, useRef } from 'react'
import { useGameStore } from '@/engine/gameStore'
import { dialogueScript } from '@/engine/dialogueScript'
import type { DialogueChoice } from '@/engine/types'
import { useAudio } from '@/engine/audioManager'

import BackgroundLayer from '@/components/game/layers/BackgroundLayer'
import CharacterLayer from '@/components/game/layers/CharacterLayer'
import DialogueLayer from '@/components/game/layers/DialogueLayer'
import UILayer from '@/components/game/layers/UILayer'

export default function GameContainer() {
  const currentLineId = useGameStore((s) => s.currentLineId)
  const currentScene = useGameStore((s) => s.currentScene)
  const visibleCharacters = useGameStore((s) => s.visibleCharacters)
  const currentExpression = useGameStore((s) => s.currentExpression)
  const isTyping = useGameStore((s) => s.isTyping)
  const currentParticleConfig = useGameStore((s) => s.currentParticleConfig)
  const currentAtmosphere = useGameStore((s) => s.currentAtmosphere)
  const currentLight = useGameStore((s) => s.currentLight)
  const currentCamera = useGameStore((s) => s.currentCamera)
  const setLine = useGameStore((s) => s.setLine)
  const setTyping = useGameStore((s) => s.setTyping)
  const setVar = useGameStore((s) => s.setVar)
  const pushHistory = useGameStore((s) => s.pushHistory)
  const applyLine = useGameStore((s) => s.applyLine)
  const { playBgm, playSfx } = useAudio()
  const prevBgmRef = useRef<string | null>(null)

  const currentLine = dialogueScript[currentLineId]

  useEffect(() => {
    if (!currentLine) return
    if (currentLine.bgm && currentLine.bgm !== prevBgmRef.current) {
      playBgm(currentLine.bgm)
      prevBgmRef.current = currentLine.bgm
    }
    if (currentLine.sfx) {
      const timer = setTimeout(() => playSfx(currentLine.sfx!), 300)
      return () => clearTimeout(timer)
    }
  }, [currentLine, playBgm, playSfx])

  useEffect(() => {
    if (!currentLine) return
    applyLine(currentLine)
  }, [currentLine, applyLine])

  useEffect(() => {
    setTyping(true)
  }, [currentLineId, setTyping])

  const handleTypingComplete = useCallback(() => {
    setTyping(false)
  }, [setTyping])

  const handleAdvance = useCallback(() => {
    if (!currentLine) return
    if (currentLine.choices && currentLine.choices.length > 0) return

    const nextId = currentLine.next
    if (nextId && dialogueScript[nextId]) {
      pushHistory(currentLine.character, currentLine.text)
      setLine(nextId)
    }
  }, [currentLine, setLine, pushHistory])

  const handleChoiceSelect = useCallback(
    (choice: DialogueChoice) => {
      if (choice.setVar) {
        setVar(choice.setVar.key, choice.setVar.value)
      }
      pushHistory(currentLine.character, currentLine.text)
      setLine(choice.next)
    },
    [currentLine, setLine, setVar, pushHistory]
  )

  if (!currentLine) {
    return (
      <div className="w-full h-screen bg-iron-950 flex items-center justify-center">
        <p className="text-glaze-50/40 font-serif tracking-widest">故事已终</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-iron-950 select-none">
      <BackgroundLayer
        scene={currentScene}
        transition={currentLine.transition}
        particleConfig={currentParticleConfig}
        atmosphere={currentAtmosphere}
        light={currentLight}
        camera={currentCamera}
      />

      <CharacterLayer
        visibleCharacters={visibleCharacters}
        expressions={currentExpression}
        characterAnims={currentLine.characterAnims}
      />

      <DialogueLayer
        character={currentLine.character}
        text={currentLine.text}
        choices={currentLine.choices}
        isTyping={isTyping}
        typingSpeed={currentLine.typingSpeed}
        onTypingComplete={handleTypingComplete}
        onChoiceSelect={handleChoiceSelect}
        onAdvance={handleAdvance}
      />

      <UILayer />
    </div>
  )
}
