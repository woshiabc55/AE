import { Clapperboard, Sparkles } from 'lucide-react'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <Clapperboard className="w-6 h-6 text-amber-500" strokeWidth={1.5} />
        <Sparkles className="w-3 h-3 text-amber-300 absolute -top-1 -right-1 animate-flicker" />
      </div>
      <div className="leading-none">
        <div className="font-display text-[20px] text-bone-50 tracking-wide">
          幕启 <span className="text-amber-500">MUSE</span>
        </div>
        <div className="text-[9px] font-mono-ui text-bone-400 tracking-[0.3em] uppercase">
          Prompt · Forge
        </div>
      </div>
    </div>
  )
}
