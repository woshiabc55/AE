import { useCallback, useRef } from 'react'

interface UseResizeOptions {
  onResize: (delta: { width: number; height: number }) => void
  minWidth?: number
  minHeight?: number
}

export function useResize({ onResize, minWidth = 300, minHeight = 200 }: UseResizeOptions) {
  const isResizing = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, direction: string) => {
      e.preventDefault()
      e.stopPropagation()
      isResizing.current = true
      lastPos.current = { x: e.clientX, y: e.clientY }

      const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing.current) return
        const dx = e.clientX - lastPos.current.x
        const dy = e.clientY - lastPos.current.y
        lastPos.current = { x: e.clientX, y: e.clientY }

        let width = 0
        let height = 0

        if (direction.includes('e')) width = Math.max(dx, minWidth ? -999 : dx)
        if (direction.includes('w')) width = -Math.max(-dx, minWidth ? -999 : -dx)
        if (direction.includes('s')) height = Math.max(dy, minHeight ? -999 : dy)
        if (direction.includes('n')) height = -Math.max(-dy, minHeight ? -999 : -dy)

        onResize({ width, height })
      }

      const handleMouseUp = () => {
        isResizing.current = false
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [onResize, minWidth, minHeight]
  )

  return { handleMouseDown }
}
