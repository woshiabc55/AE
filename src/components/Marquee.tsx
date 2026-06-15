import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  children: ReactNode
  className?: string
  speed?: 'normal' | 'slow'
  reverse?: boolean
  pauseOnHover?: boolean
}

export default function Marquee({
  children,
  className,
  speed = 'normal',
  reverse = false,
  pauseOnHover = true,
}: Props) {
  return (
    <div
      className={cn(
        'marquee-mask flex overflow-hidden',
        pauseOnHover && 'group',
        className,
      )}
    >
      <div
        className={cn(
          'flex shrink-0 items-center gap-12 pr-12',
          speed === 'slow' ? 'animate-marquee-slow' : 'animate-marquee',
          reverse && '[animation-direction:reverse]',
          pauseOnHover && 'group-hover:[animation-play-state:paused]',
        )}
      >
        {children}
      </div>
      <div
        aria-hidden
        className={cn(
          'flex shrink-0 items-center gap-12 pr-12',
          speed === 'slow' ? 'animate-marquee-slow' : 'animate-marquee',
          reverse && '[animation-direction:reverse]',
          pauseOnHover && 'group-hover:[animation-play-state:paused]',
        )}
      >
        {children}
      </div>
    </div>
  )
}
