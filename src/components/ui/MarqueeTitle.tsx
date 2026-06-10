import { useEffect, useState } from 'react'

interface MarqueeTitleProps {
  text: string
  className?: string
  /** 每个字符延迟（ms） */
  delay?: number
  /** 入场时字符级动画 */
  stagger?: boolean
}

export function MarqueeTitle({
  text,
  className = '',
  delay = 30,
  stagger = false,
}: MarqueeTitleProps) {
  const [show, setShow] = useState(!stagger)
  useEffect(() => {
    if (!stagger) return
    const t = setTimeout(() => setShow(true), 30)
    return () => clearTimeout(t)
  }, [stagger])

  if (!stagger) {
    return <span className={className}>{text}</span>
  }

  return (
    <span className={className} aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <span
          key={i}
          className="char-in"
          style={{ animationDelay: show ? `${i * delay}ms` : '0ms' }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </span>
  )
}
