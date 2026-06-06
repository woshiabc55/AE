import { X, Calendar, Globe2, Tag, Flame, Tv, Film, BookOpen, Library, Drama, Box, ShoppingBag, Music, Gamepad2, Clapperboard } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { WORKS } from '../data/works';
import { WORK_TYPE_LABELS } from '../data/types';

const ICON_MAP = {
  anime: Tv, movie: Film, manga: BookOpen, novel: Library, stage: Drama,
  figure: Box, goods: ShoppingBag, ost: Music, mobile: Gamepad2, live: Clapperboard,
};

export default function WorkDetailDrawer() {
  const open = useAppStore((s) => s.drawerOpen);
  const workId = useAppStore((s) => s.selectedWorkId);
  const close = useAppStore((s) => s.closeDrawer);

  const work = useMemo(() => WORKS.find((w) => w.id === workId) || null, [workId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  const Icon = work ? ICON_MAP[work.type] || Tv : Tv;
  const related = useMemo(
    () => (work ? WORKS.filter((w) => w.ipId === work.ipId && w.id !== work.id).slice(0, 6) : []),
    [work]
  );

  if (!work) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={close}
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 bottom-0 z-50 w-full max-w-md glass-strong overflow-y-auto slide-in-right ${
          open ? '' : 'translate-x-full'
        }`}
        style={{ transition: 'transform 0.35s ease' }}
      >
        {/* 顶部封面 */}
        <div
          className="relative h-48 overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${work.cover}dd 0%, ${work.cover}40 100%)` }}
        >
          <div className="absolute inset-0 bg-grid opacity-40" />
          <button
            onClick={close}
            className="absolute top-3 right-3 w-9 h-9 grid place-items-center bg-black/40 hover:bg-black/60 backdrop-blur border border-white/20 rounded-sm transition"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3">
            <div className="w-14 h-14 rounded-sm bg-black/50 backdrop-blur grid place-items-center border border-white/30">
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-mono text-white/70">{WORK_TYPE_LABELS[work.type]}</div>
              <div className="text-lg font-bold text-white line-clamp-2">{work.title}</div>
            </div>
          </div>
        </div>

        {/* 元数据 */}
        <div className="p-5 space-y-4">
          <div>
            <div className="text-[10px] text-white/40 font-mono tracking-widest mb-1">// SOURCE_IP</div>
            <div className="text-neon-pink font-semibold text-lg">{work.ipName}</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Meta icon={<Calendar className="w-3.5 h-3.5" />} label="发行年份" value={String(work.year)} />
            <Meta icon={<Globe2 className="w-3.5 h-3.5" />} label="地区" value={work.region} />
            <Meta icon={<Tag className="w-3.5 h-3.5" />} label="载体" value={work.platform} />
            <Meta icon={<Flame className="w-3.5 h-3.5" />} label="热度" value={String(work.popularity)} color="text-neon-yellow" />
          </div>

          <div>
            <div className="text-[10px] text-white/40 font-mono tracking-widest mb-2">// DESCRIPTION</div>
            <p className="text-sm text-white/80 leading-relaxed">{work.description}</p>
          </div>

          {work.tags.length > 0 && (
            <div>
              <div className="text-[10px] text-white/40 font-mono tracking-widest mb-2">// TAGS</div>
              <div className="flex flex-wrap gap-1.5">
                {work.tags.map((t) => (
                  <span key={t} className="chip text-neon-cyan">#{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* 热度条 */}
          <div>
            <div className="text-[10px] text-white/40 font-mono tracking-widest mb-1.5">// POPULARITY_INDEX</div>
            <div className="h-2 bg-white/5 rounded overflow-hidden">
              <div className="bar-fill" style={{ width: `${work.popularity}%` }} />
            </div>
            <div className="mt-1 text-right text-xs font-mono text-white/50">{work.popularity}/100</div>
          </div>

          {/* 相关作品 */}
          {related.length > 0 && (
            <div>
              <div className="text-[10px] text-white/40 font-mono tracking-widest mb-2">// SAME_IP_DERIVATIVES</div>
              <div className="space-y-1.5">
                {related.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center gap-2 p-2 rounded-sm bg-white/5 hover:bg-white/10 transition text-sm"
                  >
                    <div
                      className="w-6 h-6 rounded-sm grid place-items-center shrink-0"
                      style={{ background: r.cover }}
                    >
                      <span className="text-[10px] font-mono text-white/90">{WORK_TYPE_LABELS[r.type].slice(0, 1)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{r.title}</div>
                      <div className="text-[10px] text-white/40 font-mono">{r.year} · {r.platform}</div>
                    </div>
                    <span className="text-[10px] font-mono text-neon-yellow">★{r.popularity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-white/10 text-center">
            <div className="text-[10px] text-white/30 font-mono">
              ID: {work.id} // STABLE
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function Meta({ icon, label, value, color = 'text-white' }: { icon: React.ReactNode; label: string; value: string; color?: string }) {
  return (
    <div className="bg-white/5 rounded-sm p-2.5 border border-white/5">
      <div className="text-[10px] text-white/40 font-mono flex items-center gap-1">
        {icon} {label}
      </div>
      <div className={`mt-0.5 font-medium ${color}`}>{value}</div>
    </div>
  );
}
