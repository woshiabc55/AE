import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'ghost' | 'outline' | 'alert'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: Variant
  iconRight?: ReactNode
  iconLeft?: ReactNode
  size?: 'md' | 'lg'
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-accent text-bg hover:bg-fg hover:text-bg border border-transparent',
  ghost:
    'bg-transparent text-fg hover:bg-fg hover:text-bg border border-transparent',
  outline:
    'bg-transparent text-fg border border-fg/40 hover:border-accent hover:text-accent',
  alert:
    'bg-alert text-bg hover:bg-fg border border-transparent',
}

const sizeStyles = {
  md: 'h-11 px-5 text-[12px]',
  lg: 'h-14 px-7 text-[13px]',
} as const

export default function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      className={cn(
        'group inline-flex items-center gap-3 rounded-none font-mono uppercase tracking-[0.18em] font-medium transition-all duration-200 will-change-transform',
        'hover:-translate-y-[1px] active:translate-y-0',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {iconLeft && <span className="shrink-0">{iconLeft}</span>}
      <span>{children}</span>
      {iconRight && (
        <span className="shrink-0 transition-transform duration-200 group-hover:translate-x-1">
          {iconRight}
        </span>
      )}
    </button>
  )
}
