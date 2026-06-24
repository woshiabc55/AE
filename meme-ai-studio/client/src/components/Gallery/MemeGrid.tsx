import type { Meme } from '../../types';
import { Trash2, Flame, Tag, Calendar } from 'lucide-react';

interface MemeGridProps {
  memes: Meme[];
  loading: boolean;
  error: string | null;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export default function MemeGrid({ memes, loading, error, onDelete, onRefresh }: MemeGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-10 h-10 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <span className="text-red-400">{error}</span>
        <button onClick={onRefresh} className="btn-secondary">重试</button>
      </div>
    );
  }

  if (memes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-text-dim">
        <span className="text-5xl">🈳</span>
        <p className="text-lg">还没有梗图，快去上传吧！</p>
        <p className="text-sm">也可以通过 MCP 工具让 AI 帮你批量创建</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {memes.map(meme => (
        <div key={meme.id} className="card group">
          {meme.imageUrl ? (
            <div className="aspect-video rounded-xl overflow-hidden bg-surface mb-3">
              <img
                src={meme.imageUrl}
                alt={meme.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ) : (
            <div className="aspect-video rounded-xl bg-gradient-to-br from-accent/20 to-glow/20 mb-3 flex items-center justify-center text-4xl">
              🎭
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-sm leading-tight line-clamp-2">{meme.title}</h3>
              <button
                onClick={() => onDelete(meme.id)}
                className="text-text-dim hover:text-red-400 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {meme.description && (
              <p className="text-text-dim text-xs line-clamp-2">{meme.description}</p>
            )}

            <div className="flex items-center gap-2 text-xs text-text-dim">
              <Flame size={12} className="text-orange-400" />
              <span className="text-orange-400 font-mono">{meme.hotScore}</span>
              <Calendar size={12} />
              <span>{new Date(meme.createdAt).toLocaleDateString('zh-CN')}</span>
            </div>

            {meme.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {meme.tags.map(tag => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 text-[10px] bg-surface px-2 py-0.5 rounded-full text-text-dim"
                  >
                    <Tag size={8} />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}