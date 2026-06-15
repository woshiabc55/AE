import { cn } from '@/lib/utils'

type Props = {
  index: string
  label: string
  className?: string
}

export default function SectionLabel({ index, label, className }: Props) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.32em] text-muted',
        className,
      )}
    >
      <span className="inline-block h-px w-8 bg-fg/40" />
      <span className="text-accent">§ {index}</span>
      <span>{label}</span>
    </div>
  )
}
