import { type ButtonHTMLAttributes } from 'react'

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  size?: 'sm' | 'md'
}

export function Chip({
  active,
  size = 'md',
  className = '',
  children,
  ...rest
}: ChipProps) {
  const sz = size === 'sm' ? 'h-7 px-2.5 text-[11px]' : 'h-8 px-3 text-[12px]'
  return (
    <button
      type="button"
      className={[
        'inline-flex items-center gap-1.5 font-mono-ui rounded-[4px] border-hairline transition-colors',
        sz,
        active
          ? 'bg-amber-500/10 text-amber-400 border-amber-500/60'
          : 'bg-ink-900 text-bone-200 border-ink-700 hover:border-ink-600 hover:text-bone-50',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </button>
  )
}
