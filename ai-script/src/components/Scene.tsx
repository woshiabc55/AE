import {
  ArrowUpRight,
  Sparkles,
  Globe,
  CheckCircle2,
  Calendar,
  Star,
  StickyNote,
  X,
  Trash2,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Tool } from '../data/catalog';
import { useScriptStore } from '../store/useScriptStore';
import { cn } from '../utils/cn';

export default function Scene({ tool, index }: { tool: Tool; index: number }) {
  const inReel = useScriptStore((s) => s.inReel(tool.id));
  const toggleReel = useScriptStore((s) => s.toggleReel);
  const annotation = useScriptStore((s) => s.annotations[tool.id] ?? '');
  const setAnnotation = useScriptStore((s) => s.setAnnotation);
  const removeAnnotation = useScriptStore((s) => s.removeAnnotation);
  const annotatingFor = useScriptStore((s) => s.annotatingFor);
  const setAnnotatingFor = useScriptStore((s) => s.setAnnotatingFor);
  const highlightReelId = useScriptStore((s) => s.highlightReelId);
  const setHighlightReelId = useScriptStore((s) => s.setHighlightReelId);

  const isEditing = annotatingFor === tool.id;
  const [draft, setDraft] = useState(annotation);
  const draftRef = useRef<HTMLTextAreaElement>(null);

  // 同步外部 annotation 变化到 draft
  useEffect(() => {
    if (!isEditing) setDraft(annotation);
  }, [annotation, isEditing]);

  // 打开编辑时聚焦
  useEffect(() => {
    if (isEditing) {
      setDraft(annotation);
      requestAnimationFrame(() => draftRef.current?.focus());
    }
  }, [isEditing, annotation]);

  // 从 Reel 跳转过来时高亮 1.5s
  useEffect(() => {
    if (highlightReelId === tool.id) {
      const t = setTimeout(() => setHighlightReelId(null), 1600);
      return () => clearTimeout(t);
    }
  }, [highlightReelId, tool.id, setHighlightReelId]);

  function saveNote() {
    setAnnotation(tool.id, draft);
    if (!draft.trim()) setAnnotatingFor(null);
  }

  const highlighted = highlightReelId === tool.id;

  return (
    <article
      id={`scene-${tool.id}`}
      className={cn(
        'group relative border bg-carbon-800/40 transition-all duration-300',
        highlighted
          ? 'border-clapper-500 shadow-[0_0_0_2px_rgba(200,52,27,0.35)]'
          : 'border-gilt-600/40 hover:border-clapper-500'
      )}
      style={{ animation: `fadeUp 0.6s ${index * 0.05}s ease-out backwards` }}
    >
      {/* 左侧场记条 */}
      <div
        className={cn(
          'absolute left-0 top-0 bottom-0 w-1 transition-colors',
          inReel ? 'bg-clapper-500' : 'bg-gilt-600/60 group-hover:bg-clapper-500'
        )}
      />

      {/* 右侧边注 (margin note) — 仅当存在标注时显示 */}
      {annotation.trim() && !isEditing && (
        <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full flex-col items-start pl-4 pointer-events-none">
          <div className="slate text-[8px] text-clapper-500 mb-1">NOTE</div>
          <div className="font-serif italic text-[12px] text-parchment-200/85 max-w-[180px] leading-snug border-l-2 border-clapper-500/60 pl-2">
            {annotation}
          </div>
        </div>
      )}

      <div className="p-6 pl-8">
        {/* 顶部：场记编号 + 厂牌 + 操作 */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="slate text-[10px] text-clapper-500 mb-1">
              SCENE · {tool.id}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display text-2xl md:text-3xl text-parchment-50 leading-tight">
                {tool.name}
              </h3>
              <span className="text-parchment-300/50">·</span>
              <span className="font-serif italic text-gilt-300 text-sm">
                {tool.vendor}
              </span>
              {inReel && (
                <span
                  className="slate text-[8px] px-1.5 py-0.5 border border-clapper-500 text-clapper-500"
                  title="在片集合中"
                >
                  ★ IN REEL
                </span>
              )}
              {annotation.trim() && (
                <span
                  className="slate text-[8px] px-1.5 py-0.5 border border-gilt-300 text-gilt-300"
                  title="有标注"
                >
                  ✎ NOTED
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className="slate text-[9px] text-gilt-300 flex items-center gap-1">
              <Calendar size={9} />
              {tool.year}
            </div>
            {tool.isFree && (
              <div className="slate text-[9px] text-gilt-300 flex items-center gap-1">
                <Sparkles size={9} />
                FREE
              </div>
            )}
            {tool.cnFriendly && (
              <div className="slate text-[9px] text-gilt-300 flex items-center gap-1">
                <Globe size={9} />
                CN
              </div>
            )}
          </div>
        </div>

        {/* 对白 */}
        <div className="font-serif italic text-parchment-200 text-base md:text-lg my-4 pl-4 border-l border-gilt-600/60">
          {tool.tagline}
        </div>

        {/* 体例说明 */}
        <p className="font-serif text-parchment-100/80 text-[15px] leading-relaxed mb-4">
          {tool.description}
        </p>

        {/* 能力清单 */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-4">
          {tool.capabilities.map((cap) => (
            <div key={cap} className="flex items-center gap-2 text-sm">
              <CheckCircle2 size={12} className="text-gilt-300 shrink-0" />
              <span className="font-serif text-parchment-100/80">{cap}</span>
            </div>
          ))}
        </div>

        {/* 标签 */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tool.tags.map((tag) => (
            <span
              key={tag}
              className="slate text-[9px] px-1.5 py-0.5 border border-gilt-600/40 text-gilt-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 标注编辑器 */}
        {isEditing && (
          <div className="mt-4 border-l-2 border-clapper-500 bg-carbon-700/40 p-3 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <div className="slate text-[10px] text-clapper-500">
                ✎ MARGINALIA · 边注
              </div>
              <button
                onClick={() => setAnnotatingFor(null)}
                className="text-gilt-300 hover:text-parchment-100"
                aria-label="关闭标注"
              >
                <X size={14} />
              </button>
            </div>
            <textarea
              ref={draftRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={saveNote}
              placeholder="写下你对这个工具的笔记、印象、使用场景…"
              rows={3}
              className="w-full bg-carbon-900/60 border border-gilt-600/40 focus:border-clapper-500 outline-none p-2 font-serif italic text-sm text-parchment-100 placeholder:text-gilt-300/40 resize-none"
            />
            <div className="flex items-center justify-between mt-2">
              <div className="slate text-[9px] text-gilt-300/70">
                {draft.length} 字符 · 自动保存于失焦
              </div>
              <div className="flex items-center gap-2">
                {annotation && (
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      removeAnnotation(tool.id);
                      setDraft('');
                      setAnnotatingFor(null);
                    }}
                    className="slate text-[9px] text-gilt-300 hover:text-clapper-500 flex items-center gap-1"
                  >
                    <Trash2 size={10} />
                    删除
                  </button>
                )}
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    saveNote();
                    setAnnotatingFor(null);
                  }}
                  className="btn-hard !py-1 !px-2 !text-[9px]"
                >
                  完成
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 底部：操作栏 */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-gilt-600/30">
          <div>
            <div className="label">Pricing</div>
            <div className="font-mono text-xs text-parchment-100 mt-0.5">
              {tool.pricing}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                isEditing ? saveNote() : setAnnotatingFor(tool.id)
              }
              className={cn(
                'btn-hard !py-1.5 !px-2.5 !text-[10px]',
                annotation.trim() && 'gilt'
              )}
              title={annotation.trim() ? '编辑标注' : '添加标注'}
            >
              <StickyNote size={11} />
              {annotation.trim() ? 'Noted' : 'Note'}
            </button>
            <button
              onClick={() => toggleReel(tool.id)}
              className={cn(
                'btn-hard !py-1.5 !px-2.5 !text-[10px]',
                inReel && '!bg-clapper-500 !border-clapper-500 !text-parchment-50'
              )}
              title={inReel ? '从片集合移出' : '加入片集合'}
            >
              <Star
                size={11}
                fill={inReel ? 'currentColor' : 'none'}
              />
              {inReel ? 'Saved' : 'Reel'}
            </button>
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hard"
            >
              Visit
              <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
