import { useEffect, useRef, useState, useCallback } from 'react'
import type { CharacterId, DialogueChoice } from '@/engine/types'
import { characters } from '@/engine/types'

interface DialogueLayerProps {
  character?: CharacterId
  text: string
  choices?: DialogueChoice[]
  isTyping: boolean
  typingSpeed?: number
  onTypingComplete: () => void
  onChoiceSelect: (choice: DialogueChoice) => void
  onAdvance: () => void
}

export default function DialogueLayer({
  character,
  text,
  choices,
  isTyping,
  typingSpeed,
  onTypingComplete,
  onChoiceSelect,
  onAdvance,
}: DialogueLayerProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [charIndex, setCharIndex] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onTypingCompleteRef = useRef(onTypingComplete)
  onTypingCompleteRef.current = onTypingComplete

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setDisplayedText('')
    setCharIndex(0)
  }, [text])

  useEffect(() => {
    if (!isTyping || charIndex >= text.length) {
      if (charIndex >= text.length && isTyping) {
        onTypingCompleteRef.current()
      }
      return
    }

    timerRef.current = setTimeout(() => {
      setDisplayedText(text.slice(0, charIndex + 1))
      setCharIndex((prev) => prev + 1)
    }, typingSpeed || 45)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [charIndex, isTyping, text])

  const handleClick = useCallback(() => {
    if (isTyping) {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      setDisplayedText(text)
      setCharIndex(text.length)
      onTypingCompleteRef.current()
      return
    }
    if (!choices || choices.length === 0) {
      onAdvance()
    }
  }, [isTyping, text, choices, onAdvance])

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  const charInfo = character ? characters[character] : null
  const isNarrator = character === 'narrator' || !character

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col justify-end"
      onClick={handleClick}
    >
      <div className="flex-1" />

      <div className="px-4 pb-6 md:px-8 md:pb-10 safe-bottom">
        {charInfo && !isNarrator && (
          <div className="mb-2 px-4">
            <span
              className="inline-block px-3 py-1 text-sm font-serif tracking-widest rounded-sm"
              style={{
                color: charInfo.color,
                backgroundColor: `${charInfo.color}15`,
                borderLeft: `3px solid ${charInfo.color}`,
              }}
            >
              {charInfo.name}
            </span>
          </div>
        )}

        <div
          className={`relative rounded-sm px-6 py-5 md:px-8 md:py-6 backdrop-blur-md ${
            isNarrator
              ? 'bg-iron-950/70 border border-glaze-50/10'
              : 'bg-iron-950/80 border-l-4'
          }`}
          style={{
            borderLeftColor: charInfo ? charInfo.color : 'transparent',
          }}
        >
          {isNarrator && (
            <div className="absolute top-2 left-4 text-glaze-50/20 text-xs font-serif tracking-widest">
              旁白
            </div>
          )}

          <p
            className={`text-base md:text-lg leading-relaxed ${
              isNarrator ? 'text-glaze-50/70 italic font-serif' : 'text-glaze-50/90 font-sans'
            }`}
          >
            {displayedText}
            {isTyping && charIndex < text.length && (
              <span className="inline-block w-0.5 h-5 ml-1 bg-glaze-50/60 animate-pulse" />
            )}
          </p>

          {!isTyping && !choices?.length && (
            <div className="absolute bottom-3 right-4">
              <span className="text-glaze-50/30 text-xs animate-pulse">▼</span>
            </div>
          )}
        </div>

        {choices && choices.length > 0 && !isTyping && (
          <div className="mt-4 space-y-2">
            {choices.map((choice, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  onChoiceSelect(choice)
                }}
                className="w-full text-left px-5 py-3 md:py-4 rounded-sm border border-glaze-50/10 bg-iron-950/60 backdrop-blur-sm hover:bg-celadon-500/10 hover:border-celadon-400/30 active:bg-celadon-500/20 transition-all duration-300 group"
              >
                <span className="text-celadon-300/60 text-xs font-serif mr-3 group-hover:text-celadon-300 transition-colors">
                  {index + 1}.
                </span>
                <span className="text-glaze-50/80 text-sm md:text-base font-sans group-hover:text-glaze-50 transition-colors">
                  {choice.text}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
