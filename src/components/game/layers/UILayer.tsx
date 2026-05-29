import { useGameStore } from '@/engine/gameStore'
import { characters } from '@/engine/types'

export default function UILayer() {
  const { showMenu, showHistory, history, chapter, setMenu, setHistory, reset } = useGameStore()

  const chapterNames: Record<string, string> = {
    intro: '窑火引',
    ancient: '古线·章氏兄弟',
    modern: '今线·张氏兄弟',
    resonance: '双线共振',
  }

  return (
    <div className="absolute inset-0 z-30 pointer-events-none">
      <div className="absolute top-0 left-0 right-0 p-3 md:p-4 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3">
          <span className="text-gold-400/60 text-xs font-serif tracking-widest">
            {chapterNames[chapter] || '窑火引'}
          </span>
        </div>
        <button
          onClick={() => setMenu(!showMenu)}
          className="w-8 h-8 flex items-center justify-center text-glaze-50/40 hover:text-glaze-50/80 transition-colors"
          aria-label="菜单"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <rect y="3" width="20" height="1.5" rx="0.75" />
            <rect y="9" width="20" height="1.5" rx="0.75" />
            <rect y="15" width="20" height="1.5" rx="0.75" />
          </svg>
        </button>
      </div>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-auto">
        <button
          onClick={() => setHistory(true)}
          className="text-glaze-50/20 hover:text-glaze-50/50 text-xs font-serif tracking-widest transition-colors px-3 py-1"
        >
          历史记录
        </button>
      </div>

      {showMenu && (
        <div
          className="absolute inset-0 bg-iron-950/90 backdrop-blur-sm flex items-center justify-center pointer-events-auto"
          onClick={() => setMenu(false)}
        >
          <div
            className="bg-iron-950/95 border border-glaze-50/10 rounded-sm p-8 min-w-[280px] md:min-w-[360px] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-glaze-50/80 font-serif text-lg tracking-widest text-center mb-6">
              菜单
            </h3>

            <button
              onClick={() => { reset(); setMenu(false) }}
              className="w-full py-3 text-glaze-50/60 hover:text-glaze-50 border border-glaze-50/10 hover:border-celadon-400/30 rounded-sm transition-all text-sm font-serif tracking-widest"
            >
              重新开始
            </button>

            <button
              onClick={() => setMenu(false)}
              className="w-full py-3 text-glaze-50/60 hover:text-glaze-50 border border-glaze-50/10 hover:border-celadon-400/30 rounded-sm transition-all text-sm font-serif tracking-widest"
            >
              返回游戏
            </button>

            <div className="pt-4 border-t border-glaze-50/5">
              <p className="text-glaze-50/20 text-xs text-center font-serif tracking-widest">
                裂痕生光，慢火传灯
              </p>
            </div>
          </div>
        </div>
      )}

      {showHistory && (
        <div
          className="absolute inset-0 bg-iron-950/90 backdrop-blur-sm flex flex-col pointer-events-auto"
          onClick={() => setHistory(false)}
        >
          <div
            className="flex-1 overflow-y-auto p-6 max-w-2xl mx-auto w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-glaze-50/80 font-serif text-lg tracking-widest text-center mb-6">
              历史记录
            </h3>
            <div className="space-y-3">
              {history.map((entry, i) => {
                const charInfo = entry.character ? characters[entry.character] : null
                return (
                  <div key={i} className="text-sm">
                    {charInfo && (
                      <span className="font-serif tracking-wider mr-2" style={{ color: charInfo.color }}>
                        {charInfo.name}
                      </span>
                    )}
                    <span className="text-glaze-50/50">{entry.text}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="p-4 text-center pointer-events-auto">
            <button
              onClick={() => setHistory(false)}
              className="text-glaze-50/40 hover:text-glaze-50/80 text-sm font-serif tracking-widest transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
