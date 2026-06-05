import { useEffect, useMemo, useRef, useState } from 'react';
import { useOpsStore } from '@/store/useOpsStore';
import { SkillCard } from './SkillCard';
import { Search, CheckSquare, Square, RotateCcw, Download, Filter, X } from 'lucide-react';
import { cn } from '@/lib/cn';

export function SkillMatrix() {
  const activeGroupId = useOpsStore((s) => s.activeGroupId);
  const groups = useOpsStore((s) => s.groups);
  const selectedIds = useOpsStore((s) => s.selectedIds);
  const toggleSelect = useOpsStore((s) => s.toggleSelect);
  const selectAll = useOpsStore((s) => s.selectAll);
  const clearSelection = useOpsStore((s) => s.clearSelection);
  const invertSelection = useOpsStore((s) => s.invertSelection);
  const filterRarity = useOpsStore((s) => s.filterRarity);
  const setFilterRarity = useOpsStore((s) => s.setFilterRarity);
  const searchKeyword = useOpsStore((s) => s.searchKeyword);
  const setSearchKeyword = useOpsStore((s) => s.setSearchKeyword);
  const pushEvent = useOpsStore((s) => s.pushEvent);

  const [openPackId, setOpenPackId] = useState<string | null>(null);
  const [hover, setHover] = useState(false);
  const [marquee, setMarquee] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const group = useMemo(() => groups.find((g) => g.id === activeGroupId)!, [groups, activeGroupId]);

  const filtered = useMemo(() => {
    const kw = searchKeyword.trim().toLowerCase();
    return group.packs.filter((p) => {
      if (filterRarity !== 'ALL' && p.rarity !== filterRarity) return false;
      if (!kw) return true;
      return (
        p.code.toLowerCase().includes(kw) ||
        p.name.toLowerCase().includes(kw) ||
        p.id.toLowerCase().includes(kw) ||
        p.tags.some((t) => t.toLowerCase().includes(kw))
      );
    });
  }, [group, filterRarity, searchKeyword]);

  // 框选
  useEffect(() => {
    if (!marquee) return;
    const container = containerRef.current;
    if (!container) return;
    const cards = container.querySelectorAll<HTMLElement>('[data-id]');
    const box = normBox(marquee);
    cards.forEach((el) => {
      const r = el.getBoundingClientRect();
      const hit = !(r.right < box.left || r.left > box.right || r.bottom < box.top || r.top > box.bottom);
      if (hit) {
        const id = el.dataset.id!;
        if (!selectedIds.has(id)) toggleSelect(id);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marquee]);

  function onMouseDownMatrix(e: React.MouseEvent) {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('[data-id]')) return; // 点在卡片上不开始框选
    setMarquee({ x1: e.clientX, y1: e.clientY, x2: e.clientX, y2: e.clientY });
  }
  function onMouseMoveMatrix(e: React.MouseEvent) {
    if (!marquee) return;
    setMarquee({ ...marquee, x2: e.clientX, y2: e.clientY });
  }
  function onMouseUpMatrix() {
    if (marquee) {
      const dx = Math.abs(marquee.x2 - marquee.x1);
      const dy = Math.abs(marquee.y2 - marquee.y1);
      if (dx < 4 && dy < 4) clearSelection();
      setMarquee(null);
    }
  }

  const exportConfig = () => {
    const sel = Array.from(selectedIds);
    const payload = {
      group: group.code,
      ts: Date.now(),
      selectedIds: sel,
      count: sel.length,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `batch-ops-${group.id}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    pushEvent({
      code: 'EVT-' + String(useOpsStore.getState().events.length + 1).padStart(3, '0'),
      level: 'OK',
      message: `已导出配置 (${sel.length} 项)`,
    });
  };

  const inspectPack = openPackId ? group.packs.find((p) => p.id === openPackId) : null;
  const allFilteredSelected = filtered.length > 0 && filtered.every((p) => selectedIds.has(p.id));

  return (
    <main className="flex-1 flex flex-col min-w-0 relative scanline noise overflow-hidden">
      {/* 顶部工具条 */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-line bg-bg-deep/60 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] tracking-[0.3em] text-line-strong">MATRIX //</span>
          <span className="font-orbitron text-sm font-bold text-amber text-shadow-amber">{group.code}</span>
          <span className="font-display text-sm text-zinc-300">「{group.name}」</span>
        </div>

        <div className="ml-4 flex items-center gap-1.5">
          {(['ALL', 'T2', 'T3', 'T4', 'T5', 'T6'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilterRarity(r)}
              className={cn(
                'h-7 px-2 font-mono text-[10px] tracking-widest border transition-colors',
                filterRarity === r
                  ? 'border-amber bg-amber/10 text-amber'
                  : 'border-line text-line-strong hover:text-cyan hover:border-cyan/40',
              )}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="ml-2 flex-1 max-w-xs relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-line-strong" />
          <input
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="检索代号 / 名称 / 词条…"
            className="w-full h-7 pl-8 pr-7 bg-bg-deep border border-line focus:border-cyan focus:outline-none font-mono text-xs placeholder:text-line-strong"
          />
          {searchKeyword && (
            <button onClick={() => setSearchKeyword('')} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-line-strong hover:text-amber">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={allFilteredSelected ? clearSelection : selectAll}
            className="h-7 px-2.5 flex items-center gap-1.5 border border-line hover:border-cyan/40 font-mono text-[10px] tracking-widest text-zinc-200"
          >
            {allFilteredSelected ? <CheckSquare className="w-3.5 h-3.5 text-amber" /> : <Square className="w-3.5 h-3.5" />}
            {allFilteredSelected ? 'CLEAR' : 'SELECT ALL'}
          </button>
          <button
            onClick={invertSelection}
            className="h-7 w-7 grid place-items-center border border-line hover:border-cyan/40 text-line-strong hover:text-cyan"
            title="反选"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={exportConfig}
            disabled={selectedIds.size === 0}
            className={cn(
              'h-7 px-2.5 flex items-center gap-1.5 border font-mono text-[10px] tracking-widest transition-colors',
              selectedIds.size === 0
                ? 'border-line text-line-strong opacity-40 cursor-not-allowed'
                : 'border-amber/40 text-amber hover:bg-amber/10',
            )}
          >
            <Download className="w-3.5 h-3.5" /> EXPORT
          </button>
        </div>
      </div>

      {/* 蜂窝矩阵 */}
      <div
        ref={containerRef}
        onMouseDown={onMouseDownMatrix}
        onMouseMove={onMouseMoveMatrix}
        onMouseUp={onMouseUpMatrix}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => { setHover(false); setMarquee(null); }}
        className="relative flex-1 overflow-y-auto bg-grid scanline"
      >
        <div className="p-5">
          <div className="flex items-baseline justify-between mb-3">
            <div className="font-mono text-[10px] text-line-strong tracking-widest">
              VISIBLE <span className="text-cyan">{filtered.length}</span> / TOTAL <span className="text-zinc-200">{group.packs.length}</span> · SELECTED{' '}
              <span className="text-amber">{selectedIds.size}</span>
            </div>
            <div className="font-mono text-[9px] text-line-strong tracking-widest">
              <Filter className="inline w-3 h-3 mr-1" />
              DRAG TO BOX-SELECT · CLICK FOR INSPECT
            </div>
          </div>

          <div
            className="grid gap-2.5"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(112px, 1fr))',
            }}
          >
            {filtered.map((p, i) => (
              <SkillCard
                key={p.id}
                index={i}
                pack={p}
                selected={selectedIds.has(p.id)}
                onToggle={toggleSelect}
                onClick={setOpenPackId}
                hover={hover}
              />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full py-20 text-center font-mono text-xs text-line-strong tracking-widest">
                // NO SKILL PACK MATCHED THE QUERY
              </div>
            )}
          </div>
        </div>

        {/* 框选框 */}
        {marquee && (
          <div
            className="absolute pointer-events-none border border-amber/70 bg-amber/5"
            style={{
              left: Math.min(marquee.x1, marquee.x2),
              top: Math.min(marquee.y1, marquee.y2),
              width: Math.abs(marquee.x2 - marquee.x1),
              height: Math.abs(marquee.y2 - marquee.y1),
            }}
          />
        )}
      </div>

      {/* 详情浮层 */}
      {inspectPack && <InspectOverlay pack={inspectPack} onClose={() => setOpenPackId(null)} />}
    </main>
  );
}

function normBox(b: { x1: number; y1: number; x2: number; y2: number }) {
  return {
    left: Math.min(b.x1, b.x2),
    top: Math.min(b.y1, b.y2),
    right: Math.max(b.x1, b.x2),
    bottom: Math.max(b.y1, b.y2),
  };
}

function InspectOverlay({ pack, onClose }: { pack: import('@/data/types').SkillPack; onClose: () => void }) {
  const applyToAll = useOpsStore((s) => s.applyToAll);
  const removePack = useOpsStore((s) => s.removePack);
  return (
    <div className="absolute inset-0 z-30 flex items-stretch justify-end bg-bg-deep/70 backdrop-blur-sm animate-slideIn" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[360px] h-full bg-bg-surface border-l-2 border-amber/60 shadow-amber-glow flex flex-col"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-line">
          <div>
            <div className="font-mono text-[9px] tracking-[0.3em] text-line-strong">SKILL // INSPECTOR</div>
            <div className="font-orbitron text-base font-bold text-amber text-shadow-amber">{pack.code}</div>
          </div>
          <button onClick={onClose} className="w-7 h-7 grid place-items-center border border-line hover:border-amber hover:text-amber text-line-strong">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          {/* 等级大数字 */}
          <div className="relative clip-bevel-md border border-amber/30 bg-gradient-to-br from-amber/5 to-transparent p-4">
            <div className="font-mono text-[9px] tracking-widest text-line-strong">CURRENT LEVEL</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-orbitron text-5xl font-black text-amber text-shadow-amber leading-none">{String(pack.level).padStart(2, '0')}</span>
              <span className="font-mono text-sm text-line-strong">/ 90</span>
            </div>
            <div className="mt-3 h-1.5 bg-bg-deep border border-line-dim overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber to-amber-glow" style={{ width: `${(pack.level / 90) * 100}%` }} />
            </div>
            <div className="mt-2 flex items-center gap-2 font-mono text-[10px]">
              <span className="text-line-strong">RARITY</span>
              <span className={cn('font-bold', `text-rarity-${pack.rarity.toLowerCase()}`)}>{pack.rarity}</span>
              <span className="text-line-strong">COST</span>
              <span className="text-cyan">{pack.cost}</span>
            </div>
          </div>

          {/* 词条 */}
          <div>
            <div className="font-mono text-[9px] tracking-widest text-line-strong mb-2">// TAGS</div>
            <div className="flex flex-wrap gap-1.5">
              {pack.tags.map((t: string) => (
                <span key={t} className="px-1.5 py-0.5 text-[10px] font-mono tracking-wider border border-cyan/40 text-cyan bg-cyan/5">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* 描述 */}
          <div>
            <div className="font-mono text-[9px] tracking-widest text-line-strong mb-2">// DESCRIPTION</div>
            <div className="font-body text-xs leading-relaxed text-zinc-200 border-l-2 border-amber/50 pl-3">
              {pack.description}
            </div>
          </div>

          {/* 状态 */}
          <div className="grid grid-cols-2 gap-2">
            <div className={cn('p-2 border', pack.equipped ? 'border-amber/40 bg-amber/5' : 'border-line')}>
              <div className="font-mono text-[9px] tracking-widest text-line-strong">EQUIPPED</div>
              <div className={cn('font-display font-bold text-sm', pack.equipped ? 'text-amber' : 'text-line-strong')}>
                {pack.equipped ? 'YES' : 'NO'}
              </div>
            </div>
            <div className={cn('p-2 border', pack.locked ? 'border-danger/40 bg-danger/5' : 'border-line')}>
              <div className="font-mono text-[9px] tracking-widest text-line-strong">LOCKED</div>
              <div className={cn('font-display font-bold text-sm', pack.locked ? 'text-danger' : 'text-ok')}>
                {pack.locked ? 'YES' : 'NO'}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-line space-y-2">
          <button
            onClick={() => { applyToAll(pack.id); onClose(); }}
            className="w-full h-10 font-display font-bold tracking-widest text-amber border-2 border-amber/60 bg-amber/10 hover:bg-amber/20 hover:shadow-amber-glow transition-all clip-bevel-sm"
          >
            APPLY TO ALL · 等级 +2
          </button>
          <button
            onClick={() => { removePack(pack.id); onClose(); }}
            className="w-full h-8 font-mono text-[10px] tracking-widest text-danger border border-danger/40 hover:bg-danger/10 clip-bevel-sm"
          >
            REMOVE FROM GROUP
          </button>
        </div>
      </div>
    </div>
  );
}
