import { type HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
  bordered?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', hoverable, bordered = true, children, ...rest }, ref) => {
    const cls = [
      'relative rounded-[8px] bg-ink-900 text-bone-50',
      bordered ? 'border border-ink-700' : '',
      'shadow-reel',
      hoverable
        ? 'transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/70 hover:shadow-spotlight'
        : '',
      'grain card-edges',
      className,
    ]
      .filter(Boolean)
      .join(' ')
    return (
      <div ref={ref} className={cls} {...rest}>
        <div className="relative z-10">{children}</div>
      </div>
    )
  },
)
Card.displayName = 'Card'
