import { usePresentationStore } from '@/store/presentation'
import { useCallback, useRef, useState, useEffect } from 'react'
import type { SlideElement } from '@/types'

function SlideElementView({
  element,
  slideId,
  isSelected,
}: {
  element: SlideElement
  slideId: string
  isSelected: boolean
}) {
  const { selectElement, updateElementContent, updateElementPosition } =
    usePresentationStore()
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      selectElement(element.id)
      setIsDragging(true)
      setDragStart({ x: e.clientX - element.x, y: e.clientY - element.y })
    },
    [element.id, element.x, element.y, selectElement]
  )

  useEffect(() => {
    if (!isDragging) return
    const handleMove = (e: MouseEvent) => {
      const newX = Math.max(0, e.clientX - dragStart.x)
      const newY = Math.max(0, e.clientY - dragStart.y)
      updateElementPosition(slideId, element.id, newX, newY)
    }
    const handleUp = () => setIsDragging(false)
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }
  }, [isDragging, dragStart, slideId, element.id, updateElementPosition])

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (element.type === 'text') setEditing(true)
    },
    [element.type]
  )

  if (element.type === 'shape') {
    return (
      <div
        className={`absolute cursor-move ${isSelected ? 'ring-2 ring-[#9F1239] ring-offset-1' : ''}`}
        style={{
          left: element.x,
          top: element.y,
          width: element.width,
          height: element.height,
          backgroundColor: element.format.bgColor || '#52B788',
          borderRadius: element.format.borderRadius,
        }}
        onMouseDown={handleMouseDown}
        onClick={(e) => e.stopPropagation()}
      />
    )
  }

  return (
    <div
      className={`absolute cursor-move ${isSelected ? 'ring-2 ring-[#9F1239] ring-offset-1' : 'hover:ring-1 hover:ring-[#9F1239]/30'}`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        fontSize: element.format.fontSize,
        fontWeight: element.format.bold ? 'bold' : 'normal',
        fontStyle: element.format.italic ? 'italic' : 'normal',
        color: element.format.color,
        textAlign: element.format.align,
        backgroundColor: element.format.bgColor || 'transparent',
        borderRadius: element.format.borderRadius,
        lineHeight: 1.3,
        display: 'flex',
        alignItems: 'center',
        padding: '4px 8px',
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onClick={(e) => e.stopPropagation()}
    >
      {editing ? (
        <input
          ref={inputRef}
          type="text"
          value={element.content}
          onChange={(e) => updateElementContent(slideId, element.id, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Escape') setEditing(false)
          }}
          onBlur={() => setEditing(false)}
          className="w-full bg-transparent border-none outline-none"
          style={{
            fontSize: 'inherit',
            fontWeight: 'inherit',
            fontStyle: 'inherit',
            color: 'inherit',
            textAlign: 'inherit',
          }}
        />
      ) : (
        <span className="w-full truncate">{element.content}</span>
      )}
    </div>
  )
}

export default function SlideCanvas() {
  const { presentation, getActiveSlide, selectElement } = usePresentationStore()
  const slide = getActiveSlide()

  if (!slide) return null

  return (
    <div
      className="flex-1 overflow-auto bg-[#e8ede8] flex items-center justify-center p-8"
      onClick={() => selectElement(null)}
    >
      <div
        className="relative shadow-2xl rounded-lg overflow-hidden"
        style={{
          width: 740,
          height: 463,
          backgroundColor: slide.background,
        }}
      >
        {slide.elements.map((el) => (
          <SlideElementView
            key={el.id}
            element={el}
            slideId={slide.id}
            isSelected={presentation.activeSlideIndex === presentation.activeSlideIndex && usePresentationStore.getState().selectedElementId === el.id}
          />
        ))}
      </div>
    </div>
  )
}
