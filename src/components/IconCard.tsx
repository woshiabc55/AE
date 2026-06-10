import { useFavorites } from '@/store/favorites';
import { useToast } from '@/store/toast';
import { Copy } from 'lucide-react';
import { SOURCE_META, type IconItem } from '@/api/types';
import { copyText } from '@/utils/copy';

type Props = {
  icon: IconItem;
  onClick: () => void;
  index?: number;
};

export function IconCard({ icon, onClick, index = 0 }: Props) {
  const isFav = useFavorites((s) => s.ids.includes(icon.id));
  const toggle = useFavorites((s) => s.toggle);
  const push = useToast((s) => s.push);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await copyText(icon.svg);
    if (ok) push(`Copied ${icon.displayName} SVG`, 'success');
    else push('Copy failed', 'error');
  };

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggle(icon.id);
    push(
      isFav ? `Removed ${icon.displayName} from favorites` : `Added ${icon.displayName} to favorites`,
      'success',
    );
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      style={{ animationDelay: `${Math.min(index, 30) * 8}ms` }}
      className="icon-grid-cell group relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center border border-ink-200/20 bg-ink-400/30 p-4 text-ink-50 transition-all hover:border-vermillion hover:bg-ink-400/60 animate-fade-up opacity-0 [animation-fill-mode:forwards] focus-visible:border-vermillion"
    >
      <span className="absolute left-2 top-2 font-mono text-[9px] uppercase tracking-widest text-ink-300/60">
        {SOURCE_META[icon.source].short}
      </span>

      <button
        onClick={handleFav}
        aria-label="toggle favorite"
        className={`absolute right-2 top-2 flex h-5 w-5 items-center justify-center transition-all ${
          isFav ? 'text-vermillion opacity-100' : 'text-ink-300 opacity-0 group-hover:opacity-100'
        }`}
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z" />
        </svg>
      </button>

      <div
        className="mb-2 flex h-12 w-12 items-center justify-center text-ink-50 transition-transform group-hover:scale-110"
        dangerouslySetInnerHTML={{ __html: icon.svg }}
      />

      <span className="line-clamp-1 w-full text-center font-mono text-[10px] text-ink-300 group-hover:text-ink-50">
        {icon.displayName}
      </span>

      <button
        onClick={handleCopy}
        title="Copy SVG"
        className="absolute bottom-2 right-2 flex h-6 w-6 translate-y-1 items-center justify-center bg-vermillion text-ink opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"
      >
        <Copy size={12} strokeWidth={2.5} />
      </button>
    </div>
  );
}
