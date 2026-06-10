import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

type Variant = 'primary' | 'ghost' | 'outline' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
}

const base =
  'inline-flex items-center justify-center gap-2 font-mono-ui tracking-wide rounded-[6px] border-hairline transition-all duration-200 select-none disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap'

const variants: Record<Variant, string> = {
  primary:
    'bg-amber-500 text-ink-950 border-amber-400 hover:bg-amber-400 hover:border-amber-300 hover:shadow-spotlight',
  ghost:
    'bg-transparent text-bone-50 border-transparent hover:bg-ink-800 hover:text-amber-400',
  outline:
    'bg-transparent text-bone-50 border-ink-700 hover:border-amber-500 hover:text-amber-400 lamp-btn',
  danger:
    'bg-transparent text-curtain-400 border-curtain-500/60 hover:bg-curtain-500 hover:text-bone-50 hover:border-curtain-500',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[12px]',
  md: 'h-10 px-4 text-[13px]',
  lg: 'h-12 px-6 text-[14px]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'outline',
      size = 'md',
      loading,
      iconLeft,
      iconRight,
      className = '',
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...rest}
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          iconLeft
        )}
        <span>{children}</span>
        {iconRight}
      </button>
    )
  },
)
Button.displayName = 'Button'
