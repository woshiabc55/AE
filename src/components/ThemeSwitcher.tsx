// ====================================================================
// ThemeSwitcher — 6 主题选择器
// - 内联在 Nav 中的紧凑模式
// - 全屏式弹出模式
// ====================================================================
import { useEffect, useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { THEMES, THEME_KEYS, useTheme, type ThemeId } from './Theme';

export function ThemeSwitcherInline() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="hidden xl:flex items-center gap-1 border-2 border-bone/30 px-1.5 py-1">
      <Palette size={12} className="text-bone/40 ml-1" />
      {THEME_KEYS.map(t => {
        const m = THEMES[t];
        return (
          <button
            key={t}
            onClick={() => setTheme(t)}
            title={`${m.name} / ${m.cn} — ${m.desc}`}
            className={`w-5 h-5 border-2 transition-all hover:scale-110 ${theme === t ? 'border-volt scale-110' : 'border-bone/40'}`}
            style={{ backgroundColor: m.preview.accent }}
          />
        );
      })}
    </div>
  );
}

export function ThemeSwitcherPanel() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
      {THEME_KEYS.map(t => {
        const m = THEMES[t];
        const active = theme === t;
        return (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={`group text-left border-2 p-3 transition-all ${active ? 'border-volt' : 'border-bone/30 hover:border-bone'}`}
            style={{ backgroundColor: m.preview.bg }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-display font-black text-lg leading-none" style={{ color: m.preview.fg }}>{m.name}</span>
              {active && <Check size={12} style={{ color: m.preview.accent }} />}
            </div>
            <div className="flex items-center gap-1 mb-1.5">
              <span className="w-3 h-3" style={{ backgroundColor: m.preview.fg }} />
              <span className="w-3 h-3" style={{ backgroundColor: m.preview.accent }} />
              <span className="w-3 h-3 border" style={{ borderColor: m.preview.fg, backgroundColor: m.preview.bg }} />
            </div>
            <div className="font-mono text-[9px]" style={{ color: m.preview.fg, opacity: 0.6 }}>
              {m.cn} · {m.desc}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function ThemeSwitcherModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] bg-ink/90 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="max-w-2xl w-full bg-ink border-2 border-bone p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-mono text-[10px] text-bone/60">// THEME SWITCHER / 6 主题</div>
            <h2 className="font-display font-black text-3xl mt-1">PICK YOUR <span className="text-volt">THEME</span>.</h2>
          </div>
          <button
            onClick={onClose}
            className="font-mono text-xs px-2 py-1 border-2 border-bone/30 hover:border-bone"
          >
            ESC
          </button>
        </div>
        <ThemeSwitcherPanel />
      </div>
    </div>
  );
}

export function useThemeModal() {
  const [open, setOpen] = useState(false);
  return { open, openModal: () => setOpen(true), closeModal: () => setOpen(false) };
}

export const THEME_LIST: ThemeId[] = THEME_KEYS;
