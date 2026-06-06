import { useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { useLibraryStore } from '../../store/useLibraryStore'

export function SearchBar({ total }: { total: number }) {
  const query = useLibraryStore(s => s.query)
  const setQuery = useLibraryStore(s => s.setQuery)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="relative">
      <div className="flex items-center gap-3 border border-bone/20 bg-ink/70 px-3 py-2.5 focus-within:border-neon">
        <Search className="h-4 w-4 text-bone/55" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索 标题 / IP / 制作方 / 角色 / 标签"
          className="flex-1 bg-transparent font-mono text-sm text-bone outline-none placeholder:text-bone/35"
        />
        {query && (
          <button onClick={() => setQuery('')} aria-label="清空" className="text-bone/55 hover:text-bone">
            <X className="h-4 w-4" />
          </button>
        )}
        <kbd className="hidden border border-bone/30 px-1.5 font-pixel text-[9px] text-bone/55 md:inline-block">⌘K</kbd>
        <span className="hidden border-l border-bone/20 pl-3 font-mono text-[10px] text-bone/55 md:inline">
          命中 {total.toLocaleString()} 项
        </span>
      </div>
    </div>
  )
}
