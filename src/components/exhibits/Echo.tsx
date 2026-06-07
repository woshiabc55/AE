import { useEffect, useRef, useState } from 'react'

const TILES = 22

export function Echo() {
  const ref = useRef<HTMLDivElement>(null)
  const [speed, setSpeed] = useState(0)
  const zRef = useRef(0)
  const raf = useRef(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const w = window.innerWidth
      setSpeed((e.clientX - w / 2) / (w / 2))
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    let last = performance.now()
    const loop = (t: number) => {
      const dt = (t - last) / 1000
      last = t
      zRef.current += dt * 60 * (0.6 + Math.abs(speed) * 1.6) * (speed >= 0 ? 1 : -1)
      if (ref.current) {
        ref.current.style.setProperty('--z', `${zRef.current % 1000}px`)
        ref.current.style.setProperty('--speed', `${speed.toFixed(3)}`)
      }
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf.current)
  }, [speed])

  return (
    <div className="relative h-full w-full overflow-hidden bg-polar" ref={ref}>
      {/* mirrored corridor using perspective */}
      <div
        className="absolute inset-0"
        style={{
          perspective: '600px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(0deg) translateZ(0)',
            width: '60vw',
            height: '70vh',
          }}
        >
          {/* floor */}
          <div
            className="absolute inset-0"
            style={{
              transform: 'rotateX(70deg) translateZ(-200px)',
              backgroundImage: 'linear-gradient(rgba(212,175,55,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.25) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
              transformOrigin: '50% 100%',
              animation: 'floorSlide 1.6s linear infinite',
            }}
          />
          {/* left wall */}
          <div
            className="absolute inset-0"
            style={{
              transform: 'rotateY(90deg) translateZ(-30vw)',
              transformOrigin: '0% 50%',
              background: 'linear-gradient(90deg, rgba(123,44,191,0.18), transparent 70%)',
            }}
          />
          {/* right wall */}
          <div
            className="absolute inset-0"
            style={{
              transform: 'rotateY(-90deg) translateZ(-30vw)',
              transformOrigin: '100% 50%',
              background: 'linear-gradient(270deg, rgba(91,192,235,0.18), transparent 70%)',
            }}
          />
          {/* ceiling */}
          <div
            className="absolute inset-0"
            style={{
              transform: 'rotateX(-70deg) translateZ(-200px)',
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.18), transparent 60%)',
              transformOrigin: '50% 0%',
            }}
          />
          {/* echo tile markers */}
          {Array.from({ length: TILES }).map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded bord-gilt-50"
              style={{
                width: `${20 + i * 6}vw`,
                height: `${14 + i * 4}vh`,
                transform: `translate(-50%, -50%) translateZ(${-i * 90 - 200}px)`,
                borderColor: `rgba(212,175,55,${0.6 - i * 0.025})`,
                boxShadow: `0 0 ${20 - i}px rgba(212,175,55,${0.4 - i * 0.015}) inset`,
                background: `radial-gradient(ellipse at center, rgba(212,175,55,${0.1 - i * 0.004}), transparent 70%)`,
              }}
            />
          ))}
          {/* pulse lights */}
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={`l${i}`}
              className="absolute h-2 w-2 rounded-full"
              style={{
                left: i % 2 ? '8%' : '92%',
                top: `${10 + i * 6}%`,
                background: i % 3 === 0 ? '#5BC0EB' : i % 3 === 1 ? '#7B2CBF' : '#D4AF37',
                transform: `translateZ(${-300 - i * 40}px)`,
                boxShadow: '0 0 16px currentColor',
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute left-6 top-24 md:left-12 md:top-28 z-10 max-w-md">
        <div className="section-meta">
          <span className="num">06</span>
          <span>ECHO HALL · 回声廊</span>
        </div>
        <h2 className="font-display section-title mt-3 gilt-text">
          无限<br />镜像<br />长廊
        </h2>
        <p className="font-han section-sub mt-5">
          鼠标 X 坐标控制推进方向与速度。
          在长廊中行走，两侧壁面回响你留下的轨迹。
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="tag-pill">SPEED · {speed.toFixed(2)}</span>
          <span className="tag-pill">TILES · {TILES}</span>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 z-10 font-mono text-[0.6rem] tracking-[0.3em] text-paper/40">
        ← 鼠标向左 · 鼠标向右 →
      </div>
    </div>
  )
}
