import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/** A refined magnetic cursor with a gilt ring and a soft trailing dot. */
export function Cursor() {
  const ringX = useMotionValue(-100)
  const ringY = useMotionValue(-100)
  const dotX = useSpring(ringX, { stiffness: 600, damping: 40, mass: 0.4 })
  const dotY = useSpring(ringY, { stiffness: 900, damping: 50, mass: 0.3 })
  const [hover, setHover] = useState(false)
  const [down, setDown] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(max-width: 768px)').matches) return

    const move = (e: MouseEvent) => {
      ringX.set(e.clientX)
      ringY.set(e.clientY)
      const el = e.target as HTMLElement
      const interactive = !!el?.closest('a, button, [data-cursor="hover"]')
      setHover(interactive)
    }
    const md = () => setDown(true)
    const mu = () => setDown(false)

    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', md)
    window.addEventListener('mouseup', mu)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', md)
      window.removeEventListener('mouseup', mu)
    }
  }, [ringX, ringY])

  return (
    <div ref={ref} className="pointer-events-none fixed inset-0 z-[10000] hidden md:block">
      <motion.div
        aria-hidden
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          scale: down ? 0.8 : hover ? 2.1 : 1,
          rotate: hover ? 45 : 0,
          borderColor: hover ? 'rgba(212,175,55,0.95)' : 'rgba(232,228,216,0.55)',
          backgroundColor: hover ? 'rgba(212,175,55,0.08)' : 'rgba(232,228,216,0)',
        }}
        transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        className="absolute h-7 w-7 rounded-full border"
      />
      <motion.div
        aria-hidden
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        className="absolute h-1.5 w-1.5 rounded-full bg-gilt"
      />
    </div>
  )
}
