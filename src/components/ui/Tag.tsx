import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  children: ReactNode
  className?: string
  tone?: 'default' | 'accent' | 'alert'
}

const toneStyles = {
  default: 'border-fg/20 text-fg/80',
  accent: 'border-accent/60 text-accent bg-accent/5',
  alert: 'border-alert/60 text-alert bg-alert/5',
}

export default function Tag({ children, className, tone = 'default' }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.18em] border',
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
