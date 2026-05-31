import { useCallback, useRef } from 'react'

interface UseDragOptions {
  onMove: (delta: { x: number; y: number }) => void
  onStart?: () => void
  onEnd?: () => void
}

export function useDrag({ onMove, onStart, onEnd }: UseDragOptions) {
  const isDragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      isDragging.current = true
      lastPos.current = { x: e.clientX, y: e.clientY }
      onStart?.()

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return
        const delta = {
          x: e.clientX - lastPos.current.x,
          y: e.clientY - lastPos.current.y,
        }
        lastPos.current = { x: e.clientX, y: e.clientY }
        onMove(delta)
      }

      const handleMouseUp = () => {
        isDragging.current = false
        onEnd?.()
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [onMove, onStart, onEnd]
  )

  return { handleMouseDown }
}
