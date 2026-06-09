import { useEffect, useState } from 'react';
import type { Shot } from '@/data/types';

interface PromptPanelProps {
  shot: Shot;
  visible: boolean;
  onClose: () => void;
}

/**
 * AIGC 提示词面板：浮层显示当前镜的中英提示词、声音、转场、视觉
 */
export function PromptPanel({ shot, visible, onClose }: PromptPanelProps) {
  const [show, setShow] = useState(visible);
  useEffect(() => {
    if (visible) setShow(true);
    else {
      const id = setTimeout(() => setShow(false), 400);
      return () => clearTimeout(id);
    }
  }, [visible]);

  if (!show) return null;

  return (
    <div
      className={`absolute top-0 right-0 bottom-0 w-full md:w-[460px] z-30 pointer-events-auto transition-all duration-400 ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="h-full bg-ink/95 backdrop-blur-md border-l border-gold/20 flex flex-col">
        <div className="px-6 py-5 border-b border-gold/15 flex items-center justify-between">
          <div>
            <div className="text-gold/50 text-[10px] shot-num tracking-widest">AIGC PROMPT</div>
            <div className="text-paper serif-display text-lg mt-1">
              镜 {String(shot.id).padStart(2, '0')}.{shot.sub}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-paper/60 hover:text-kiln transition-colors p-2"
            aria-label="关闭"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <Section title="画面 · SCENE" body={shot.prompt} accent />
          {shot.dialogue && (
            <Section title="对白 · DIALOGUE" body={`「${shot.dialogue}」`} gold />
          )}
          <Section title="声音 · SOUND" body={shot.voice} />
          <Section title="转场 · TRANSITION" body={shot.transition} />
          <Section title="视觉 · VFX" body={shot.vfx} />
          <Section title="情绪 · MOOD" body={shot.mood.toUpperCase()} small />

          <div className="pt-4 border-t border-gold/10">
            <div className="text-gold/40 text-[10px] shot-num tracking-widest mb-2">MOTIF TAGS</div>
            <div className="flex flex-wrap gap-1.5">
              {shot.motif.map((m) => (
                <span
                  key={m}
                  className="px-2 py-0.5 text-[10px] shot-num tracking-wider border border-gold/20 text-gold/70"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, body, accent, gold, small }: { title: string; body: string; accent?: boolean; gold?: boolean; small?: boolean }) {
  return (
    <div>
      <div className="text-gold/40 text-[10px] shot-num tracking-widest mb-1.5">{title}</div>
      <div
        className={`serif-display leading-relaxed ${
          small ? 'text-xs shot-num' : 'text-sm md:text-base'
        } ${
          gold ? 'text-gold' : accent ? 'text-paper' : 'text-paper/80'
        }`}
      >
        {body}
      </div>
    </div>
  );
}
