import { useEffect, useRef, useState } from 'react'

/** 自定义墨滴光标：跟随鼠标，悬停在按钮/链接上变红 */
export const InkCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [hover, setHover] = useState(false)
  const [press, setPress] = useState(false)
  const lastRef = useRef(0)
  const dropRef = useRef<{ x: number; y: number; id: number; t: number }[]>([])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
      const target = e.target as HTMLElement
      setHover(
        !!target.closest('button, a, [role="button"], .card-paper, input'),
      )
      const now = performance.now()
      if (now - lastRef.current > 80) {
        lastRef.current = now
        const id = now
        dropRef.current.push({ x: e.clientX, y: e.clientY, id, t: now })
        // 限制数量
        if (dropRef.current.length > 8) dropRef.current.shift()
        setTimeout(() => {
          dropRef.current = dropRef.current.filter((d) => d.id !== id)
          forceRender()
        }, 1200)
        forceRender()
      }
    }
    const onDown = () => setPress(true)
    const onUp = () => setPress(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  // 强制重渲染以更新墨滴（轻量）
  const [, setTick] = useState(0)
  const forceRender = () => setTick((n) => n + 1)

  return (
    <div className="fixed inset-0 pointer-events-none z-[60]">
      {/* 落点墨滴 */}
      {dropRef.current.map((d) => (
        <span
          key={d.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 ink-drop"
          style={{ left: d.x, top: d.y }}
        >
          <span
            className="block rounded-full"
            style={{
              width: 6,
              height: 6,
              background: hover ? '#A22B1F' : '#1B1A18',
              filter: 'blur(1px)',
            }}
          />
        </span>
      ))}

      {/* 主光标 */}
      <span
        className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-150"
        style={{
          left: pos.x,
          top: pos.y,
          transform: `translate(-50%, -50%) scale(${press ? 0.7 : hover ? 1.2 : 1})`,
        }}
      >
        <span
          className="block rounded-full"
          style={{
            width: hover ? 28 : 14,
            height: hover ? 28 : 14,
            background: hover ? 'rgba(162,43,31,0.18)' : 'rgba(201,161,74,0.12)',
            border: `1px solid ${hover ? '#A22B1F' : '#C9A14A'}`,
            transition: 'all 0.2s ease',
          }}
        />
      </span>
    </div>
  )
}
