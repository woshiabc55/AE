import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
      <input
        type="text"
        placeholder="搜索应用..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 pl-9 pr-4 rounded-xl bg-white/[0.06] border border-white/[0.08]
          text-white/90 text-sm placeholder:text-white/30
          focus:outline-none focus:border-blue-400/40 focus:bg-white/[0.08]
          transition-all duration-200"
        autoFocus
      />
    </div>
  )
}
