import { useEffect } from 'react';
import { X, Film, Trash2, ArrowUpRight, StickyNote, ScrollText } from 'lucide-react';
import { useScriptStore, selectReelAnnotationCount } from '../store/useScriptStore';
import { TOOLS, ACTS, type Tool } from '../data/catalog';

// 工具 id → Tool 映射
const TOOL_MAP: Record<string, Tool> = Object.fromEntries(
  TOOLS.map((t) => [t.id, t])
);

const ACT_MAP: Record<string, (typeof ACTS)[number]> = Object.fromEntries(
  ACTS.map((a) => [a.id, a])
);

export default function ReelPanel() {
  const open = useScriptStore((s) => s.reelOpen);
  const setOpen = useScriptStore((s) => s.setReelOpen);
  const reel = useScriptStore((s) => s.reel);
  const removeFromReel = useScriptStore((s) => s.removeFromReel);
  const clearReel = useScriptStore((s) => s.clearReel);
  const annotations = useScriptStore((s) => s.annotations);
  const setHighlight = useScriptStore((s) => s.setHighlightReelId);
  const annotationCount = useScriptStore(selectReelAnnotationCount);

  // ESC 关闭
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  // 打开时锁定 body 滚动
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  function goToScene(id: string) {
    setHighlight(id);
    setOpen(false);
    requestAnimationFrame(() => {
      const el = document.getElementById(`scene-${id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  return (
    <>
      {/* 背景遮罩 */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-carbon-900/70 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!open}
      />

      {/* 侧栏 */}
      <aside
        role="dialog"
        aria-label="我的片集合"
        className={`fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[440px] bg-carbon-900 border-l border-gilt-600/40 shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* 装订线 */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-clapper-500/40 to-transparent" />

        {/* 头部 */}
        <header className="px-5 py-4 border-b border-gilt-600/40 flex items-center justify-between">
          <div>
            <div className="slate text-[10px] text-clapper-500 mb-1">
              MY REEL · COLLECTION
            </div>
            <div className="font-display text-2xl text-parchment-50">
              我的片集合
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-gilt-300 hover:text-parchment-100 p-1"
            aria-label="关闭片集合"
          >
            <X size={18} />
          </button>
        </header>

        {/* 统计条 */}
        <div className="px-5 py-2 border-b border-gilt-600/30 flex items-center gap-4 text-[10px] slate text-gilt-300">
          <div className="flex items-center gap-1">
            <Film size={10} />
            {reel.length} SCENES
          </div>
          <div className="flex items-center gap-1">
            <StickyNote size={10} />
            {annotationCount} NOTED
          </div>
          {reel.length > 0 && (
            <button
              onClick={() => {
                if (confirm('确认清空整个片集合？')) clearReel();
              }}
              className="ml-auto flex items-center gap-1 text-gilt-300 hover:text-clapper-500"
            >
              <Trash2 size={10} />
              CLEAR
            </button>
          )}
        </div>

        {/* 列表 */}
        <div className="flex-1 overflow-y-auto px-3 py-3">
          {reel.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6 py-12">
              <ScrollText size={36} className="text-gilt-600 mb-4" />
              <div className="slate text-gilt-300 text-xs mb-2">
                EMPTY REEL
              </div>
              <div className="font-serif italic text-parchment-200/70 text-base">
                卷盘空转，灯还没亮。
                <br />
                到喜欢的场次，按下 <span className="text-clapper-500">Reel</span>。
              </div>
            </div>
          ) : (
            <ul className="space-y-2">
              {reel.map((id, idx) => {
                const tool = TOOL_MAP[id];
                if (!tool) return null;
                const act = ACT_MAP[tool.actId];
                const note = annotations[id];
                return (
                  <li
                    key={id}
                    className="group border border-gilt-600/40 hover:border-clapper-500 bg-carbon-800/40 transition-colors"
                  >
                    <div className="flex items-start gap-2 p-3">
                      <div className="slate text-[9px] text-clapper-500 w-12 shrink-0 pt-0.5">
                        #{(idx + 1).toString().padStart(2, '0')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="slate text-[9px] text-gilt-300 mb-0.5">
                          {act?.roman ?? '?'} · {act?.title ?? '?'} · {tool.id}
                        </div>
                        <button
                          onClick={() => goToScene(id)}
                          className="font-display text-lg text-parchment-50 hover:text-clapper-500 text-left leading-tight"
                        >
                          {tool.name}
                          <span className="font-serif italic text-gilt-300 text-sm ml-1">
                            · {tool.vendor}
                          </span>
                        </button>
                        {note && (
                          <div className="mt-2 font-serif italic text-[12px] text-parchment-200/80 border-l-2 border-clapper-500/60 pl-2 leading-snug">
                            ✎ {note}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {tool.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="slate text-[8px] px-1 py-0.5 border border-gilt-600/40 text-gilt-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <button
                          onClick={() => goToScene(id)}
                          className="text-gilt-300 hover:text-clapper-500 p-1"
                          title="跳转"
                        >
                          <ArrowUpRight size={12} />
                        </button>
                        <button
                          onClick={() => removeFromReel(id)}
                          className="text-gilt-300 hover:text-clapper-500 p-1"
                          title="移除"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* 底部 */}
        <footer className="px-5 py-3 border-t border-gilt-600/40 flex items-center justify-between">
          <div className="slate text-[9px] text-gilt-300/70">
            数据存于本地浏览器 · 不上传
          </div>
          <a
            href="#fin"
            onClick={() => setOpen(false)}
            className="slate text-[10px] text-gilt-300 hover:text-clapper-500"
          >
            终幕 →
          </a>
        </footer>
      </aside>
    </>
  );
}
