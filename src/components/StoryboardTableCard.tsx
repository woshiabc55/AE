import { useState, useRef, useEffect } from 'react';
import type { StoryboardTable, Tick } from '../store/projectStore';
import { formatTimecode, formatShort } from '../utils/timecode';

interface Props {
  table: StoryboardTable;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdateTick: (tickIndex: number, patch: Partial<Tick>) => void;
  onUpdateTitle: (title: string) => void;
  delayMs?: number;
}

const FIELDS: Array<keyof Pick<Tick, 'image' | 'action' | 'sound' | 'note'>> = [
  'image',
  'action',
  'sound',
  'note',
];

const FIELD_LABELS: Record<string, string> = {
  image: '画面',
  action: '动作/运镜',
  sound: '音效',
  note: '设计要点',
};

export function StoryboardTableCard({
  table,
  index,
  isSelected,
  onSelect,
  onUpdateTick,
  onUpdateTitle,
  delayMs = 0,
}: Props) {
  const [editing, setEditing] = useState<{ tickIdx: number; field: keyof Tick } | null>(null);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const beginEdit = (tickIdx: number, field: keyof Tick) => {
    setEditing({ tickIdx, field });
    setDraft(String(table.ticks[tickIdx - 1][field] || ''));
  };

  const commit = () => {
    if (!editing) return;
    onUpdateTick(editing.tickIdx, { [editing.field]: draft } as Partial<Tick>);
    setEditing(null);
  };

  const cancel = () => setEditing(null);

  return (
    <div
      onClick={onSelect}
      className={[
        'group relative panel grain overflow-hidden animate-fade-up cursor-pointer',
        isSelected ? 'shadow-cell-focus border-amber-glow/50' : 'hover:border-amber-glow/30',
      ].join(' ')}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {/* 顶部胶片孔装饰 */}
      <div className="film-strip h-2.5 opacity-60" />
      {isSelected && (
        <div className="absolute inset-x-0 top-2.5 h-px progress-bar pointer-events-none" />
      )}

      {/* 标题栏 */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-mono text-[10px] tracking-[0.3em] text-amber-glow/80">
            TABLE {String(index).padStart(2, '0')} / 08
          </span>
          <span className="text-bone-300/40">·</span>
          <span className="font-mono text-[11px] text-bone-200/70">
            {formatShort(table.startSec)} – {formatShort(table.endSec)}
          </span>
        </div>
        <span className="font-mono text-[10px] text-bone-300/40">
          16 TICKS · {(table.endSec - table.startSec).toFixed(2)}s
        </span>
      </div>

      <div className="px-4 pb-3">
        <input
          value={table.title}
          onChange={(e) => onUpdateTitle(e.target.value)}
          className="w-full bg-transparent border-b border-transparent hover:border-ink-500
                     focus:border-amber-glow/60 focus:outline-none panel-title text-lg
                     tracking-wide"
        />
      </div>

      <div className="amber-divider mx-4" />

      {/* 16 竖线时间轴 + 单元格 */}
      <div className="px-4 py-3">
        <div className="grid grid-cols-16 gap-0 relative" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
          {table.ticks.map((tk, i) => {
            const isEditing = editing?.tickIdx === tk.index;
            const isOdd = tk.index % 2 === 0;
            return (
              <div
                key={tk.index}
                className="relative flex flex-col items-center"
                title={`${formatTimecode(tk.sec)}`}
              >
                {/* 顶部时间码 */}
                <div className="font-mono text-[9px] text-bone-300/50 mb-1">
                  {String(tk.index).padStart(2, '0')}
                </div>
                {/* 竖线 */}
                <div
                  className={[
                    'w-px h-3 mb-1',
                    isOdd ? 'bg-amber-glow/50' : 'bg-bone-200/40',
                  ].join(' ')}
                />
                {/* 4 字段小方块 */}
                <div className="flex flex-col gap-0.5 w-full">
                  {FIELDS.map((f) => {
                    const v = String(tk[f] || '');
                    const isEditingThis = isEditing && editing.field === f;
                    return (
                      <button
                        key={f}
                        onClick={(e) => {
                          e.stopPropagation();
                          beginEdit(tk.index, f);
                        }}
                        className={[
                          'h-5 px-1 text-left text-[9px] font-mono truncate transition-colors border border-transparent',
                          isEditingThis
                            ? 'border-amber-glow bg-amber-glow/10 text-bone-50'
                            : v
                            ? 'text-bone-100 hover:border-amber-glow/40 hover:bg-ink-700/60'
                            : 'text-bone-300/20 hover:border-ink-500 hover:text-bone-300/50',
                        ].join(' ')}
                        title={v || FIELD_LABELS[f]}
                      >
                        {isEditingThis ? '✎' : v ? v.slice(0, 6) : FIELD_LABELS[f].slice(0, 2)}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        {/* 底部刻度尺 */}
        <div className="mt-3 flex items-center justify-between font-mono text-[9px] text-bone-300/40">
          <span>{formatTimecode(table.startSec)}</span>
          <span className="text-amber-glow/60">|— 16 TICKS —|</span>
          <span>{formatTimecode(table.endSec)}</span>
        </div>
      </div>

      {/* 行内编辑器（覆盖在表格内） */}
      {editing && (
        <div
          className="absolute inset-0 z-20 bg-ink-900/95 backdrop-blur-sm
                     border border-amber-glow/40 rounded-md p-4 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-[0.3em] text-amber-glow/80">
                EDITING
              </span>
              <span className="text-bone-100 text-sm">
                Tick {String(editing.tickIdx).padStart(2, '0')} · {FIELD_LABELS[editing.field]}
              </span>
            </div>
            <div className="flex gap-1.5">
              <button onClick={cancel} className="pill">取消</button>
              <button onClick={commit} className="pill pill-active">保存 ⏎</button>
            </div>
          </div>
          <textarea
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                commit();
              } else if (e.key === 'Escape') {
                cancel();
              }
            }}
            className="flex-1 bg-ink-950 border border-ink-500 rounded p-3 text-sm
                       text-bone-100 focus:outline-none focus:border-amber-glow/60
                       resize-none leading-relaxed"
            placeholder="输入画面 / 动作 / 音效 / 设计要点 …"
          />
          <div className="mt-2 font-mono text-[10px] text-bone-300/40">
            ⌘/Ctrl + ⏎ 保存 · Esc 取消
          </div>
        </div>
      )}
    </div>
  );
}
