import { useEffect, useState } from 'react';
import { Download, Copy, Check, X, Heart } from 'lucide-react';
import { useFavorites } from '@/store/favorites';
import { useToast } from '@/store/toast';
import { SOURCE_META, CATEGORY_META, type IconItem } from '@/api/types';
import { asReact, asSvg, asVue, copyText, downloadPng, downloadSvg } from '@/utils/copy';

type Props = {
  icon: IconItem;
  onClose: () => void;
};

type Tab = 'svg' | 'react' | 'vue' | 'html';

export function IconDetailModal({ icon, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('svg');
  const [size, setSize] = useState(48);
  const [copied, setCopied] = useState(false);
  const isFav = useFavorites((s) => s.ids.includes(icon.id));
  const toggle = useFavorites((s) => s.toggle);
  const push = useToast((s) => s.push);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // 不同格式的代码
  const code = {
    svg: asSvg(icon.svg),
    react: asReact(icon.svg, icon.name),
    vue: asVue(icon.svg, icon.name),
    html: `<img src="data:image/svg+xml;utf8,${encodeURIComponent(icon.svg)}" alt="${icon.name}" width="${size}" height="${size}">`,
  }[tab];

  const handleCopy = async () => {
    const ok = await copyText(code);
    if (ok) {
      setCopied(true);
      push(`Copied ${tab.toUpperCase()} snippet`, 'success');
      setTimeout(() => setCopied(false), 1500);
    } else {
      push('Copy failed', 'error');
    }
  };

  const handleDownloadSvg = () => {
    downloadSvg(icon.svg, `${icon.source}_${icon.name}`);
    push('SVG downloaded', 'success');
  };

  const handleDownloadPng = () => {
    downloadPng(icon.svg, `${icon.source}_${icon.name}`, 256).then(
      () => push('PNG downloaded (256px)', 'success'),
      () => push('PNG export failed', 'error'),
    );
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative grid w-full max-w-5xl grid-cols-1 overflow-hidden border border-ink-200/30 bg-ink-400 shadow-2xl md:grid-cols-2"
        style={{ animation: 'modalIn 0.25s cubic-bezier(0.22,1,0.36,1) forwards' }}
      >
        <style>{`@keyframes modalIn { from { transform: scale(0.96); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>

        {/* 左：预览 */}
        <div className="relative flex flex-col border-b border-ink-200/30 bg-ink-400/50 p-8 md:border-b-0 md:border-r">
          <div className="mb-6 flex items-baseline gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-ink-300">
              {SOURCE_META[icon.source].label}
            </span>
            <span className="font-mono text-xs text-ink-300">/</span>
            <span className="font-mono text-xs text-ink-50">{icon.displayName}</span>
          </div>

          {/* 大预览 */}
          <div className="flex flex-1 items-center justify-center">
            <div
              className="text-ink-50 transition-all"
              style={{ width: size * 4, height: size * 4 }}
              dangerouslySetInnerHTML={{
                __html: icon.svg
                  .replace(/width="24"/, `width="${size * 4}"`)
                  .replace(/height="24"/, `height="${size * 4}"`),
              }}
            />
          </div>

          {/* 尺寸切换 */}
          <div className="mt-6 flex items-center gap-2">
            <span className="mr-2 font-mono text-xs text-ink-300">SIZE</span>
            {[16, 24, 32, 48, 64, 96].map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`border px-2 py-1 font-mono text-xs transition-colors ${
                  size === s
                    ? 'border-vermillion bg-vermillion/10 text-ink-50'
                    : 'border-ink-200/30 text-ink-300 hover:border-ink-200/60 hover:text-ink-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* 标签 */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="border border-ink-200/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-300">
              {CATEGORY_META[icon.category].cn}
            </span>
            {icon.tags.slice(0, 3).map((t) => (
              <span key={t} className="font-mono text-[10px] text-ink-300">
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* 右：源码 */}
        <div className="flex flex-col p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink-50">{icon.displayName}</h2>
              <p className="mt-1 font-mono text-xs text-ink-300">
                {icon.name}.{icon.source}
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="close"
              className="border border-ink-200/30 p-1.5 text-ink-300 transition-colors hover:border-vermillion hover:text-ink-50"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>

          {/* Tab */}
          <div className="mb-3 flex border-b border-ink-200/20">
            {(['svg', 'react', 'vue', 'html'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative px-3 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
                  tab === t ? 'text-ink-50' : 'text-ink-300 hover:text-ink-50'
                }`}
              >
                {t}
                {tab === t && <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-vermillion" />}
              </button>
            ))}
          </div>

          {/* 代码面板 */}
          <div className="relative flex-1 overflow-hidden border border-ink-200/20 bg-ink/60">
            <pre className="h-64 overflow-auto p-4 font-mono text-xs leading-relaxed text-ink-50">
              <code>{code}</code>
            </pre>
            <button
              onClick={handleCopy}
              className="absolute right-2 top-2 flex items-center gap-1 border border-ink-200/30 bg-ink-400/60 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-50 transition-colors hover:border-vermillion hover:bg-vermillion hover:text-ink"
            >
              {copied ? <Check size={11} strokeWidth={2} /> : <Copy size={11} strokeWidth={2} />}
              {copied ? 'copied' : 'copy'}
            </button>
          </div>

          {/* 底部操作条 */}
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => {
                toggle(icon.id);
                push(
                  isFav ? `Removed ${icon.displayName}` : `Added ${icon.displayName} to favorites`,
                  'success',
                );
              }}
              className={`flex items-center gap-2 border px-3 py-2 font-mono text-xs transition-colors ${
                isFav
                  ? 'border-vermillion bg-vermillion/10 text-ink-50'
                  : 'border-ink-200/30 text-ink-300 hover:border-ink-200/60 hover:text-ink-50'
              }`}
            >
              <Heart size={12} strokeWidth={1.5} fill={isFav ? 'currentColor' : 'none'} />
              {isFav ? 'saved' : 'save'}
            </button>
            <button
              onClick={handleDownloadSvg}
              className="flex items-center gap-2 border border-ink-200/30 px-3 py-2 font-mono text-xs text-ink-300 transition-colors hover:border-ink-200/60 hover:text-ink-50"
            >
              <Download size={12} strokeWidth={1.5} />
              .svg
            </button>
            <button
              onClick={handleDownloadPng}
              className="flex items-center gap-2 border border-ink-200/30 px-3 py-2 font-mono text-xs text-ink-300 transition-colors hover:border-ink-200/60 hover:text-ink-50"
            >
              <Download size={12} strokeWidth={1.5} />
              .png
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
