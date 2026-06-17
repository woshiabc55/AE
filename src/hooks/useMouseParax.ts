// 鼠标视差 hook - 返回归一化的鼠标位置 (-1 ~ 1)
import { useEffect, useState } from "react"

export function useMouseParax() {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let raf = 0
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -((e.clientY / window.innerHeight) * 2 - 1)
      targetX = x
      targetY = y
    }

    const tick = () => {
      currentX += (targetX - currentX) * 0.06
      currentY += (targetY - currentY) * 0.06
      setPos({ x: currentX, y: currentY })
      raf = requestAnimationFrame(tick)
    }
    tick()

    window.addEventListener("mousemove", onMove)
    return () => {
      window.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return pos
}
