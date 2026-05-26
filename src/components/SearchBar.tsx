import { useState, useCallback } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { useSearchStore } from '@/store/searchStore'
import { type Platform, PLATFORM_CONFIG } from '@/types'
import { cn } from '@/lib/utils'

const PLATFORMS: Platform[] = ['jd', 'tb', 'pdd']

export default function SearchBar() {
  const { keyword, setKeyword, platforms, togglePlatform, isSearching, search } = useSearchStore()
  const [isFocused, setIsFocused] = useState(false)

  const handleSearch = useCallback(() => {
    if (!keyword.trim() || isSearching) return
    search()
  }, [keyword, isSearching, search])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') handleSearch()
    },
    [handleSearch],
  )

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div
        className={cn(
          'relative rounded-2xl border-2 transition-all duration-300',
          isFocused
            ? 'border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.3),0_0_60px_rgba(34,211,238,0.1)]'
            : 'border-slate-700 shadow-[0_0_15px_rgba(34,211,238,0.05)]',
        )}
        style={{ backgroundColor: '#0F172A' }}
      >
        <div className="flex items-center gap-3 p-2 sm:p-3">
          <div className="flex-1 flex items-center gap-3 px-3">
            {isSearching ? (
              <Loader2 className="h-5 w-5 shrink-0 animate-spin text-cyan-400" />
            ) : (
              <Search className="h-5 w-5 shrink-0 text-slate-500" />
            )}
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="搜索商品，如：iPhone 16 Pro Max"
              disabled={isSearching}
              className="w-full bg-transparent py-3 text-base sm:text-lg text-slate-100 placeholder-slate-500 outline-none disabled:opacity-50"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={!keyword.trim() || isSearching}
            className={cn(
              'shrink-0 flex items-center gap-2 rounded-xl px-5 sm:px-7 py-3 text-sm sm:text-base font-semibold transition-all duration-300',
              keyword.trim() && !isSearching
                ? 'bg-cyan-500 text-slate-900 hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] active:scale-95'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed',
            )}
          >
            <Search className="h-4 w-4" />
            <span>{isSearching ? '搜索中...' : '搜索'}</span>
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-3">
        <span className="text-xs sm:text-sm text-slate-500">选择平台</span>
        <div className="flex items-center gap-2">
          {PLATFORMS.map((p) => {
            const config = PLATFORM_CONFIG[p]
            const isActive = platforms.includes(p)
            return (
              <button
                key={p}
                onClick={() => togglePlatform(p)}
                className={cn(
                  'relative flex items-center gap-1.5 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-200 border',
                  isActive
                    ? 'border-transparent hover:brightness-110 active:scale-95'
                    : 'border-slate-700 bg-slate-800/50 text-slate-500 hover:border-slate-600 hover:text-slate-400',
                )}
                style={
                  isActive
                    ? {
                        backgroundColor: config.bgColor,
                        color: config.color,
                        borderColor: config.color,
                        boxShadow: `0 0 12px ${config.bgColor}`,
                      }
                    : undefined
                }
              >
                <span
                  className="h-2 w-2 rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? config.color : '#475569',
                  }}
                />
                {config.name}
              </button>
            )
          })}
        </div>
      </div>

      {isFocused && (
        <div className="mt-3 text-center">
          <span className="text-xs text-slate-600">
            按 Enter 快速搜索
          </span>
        </div>
      )}
    </div>
  )
}
