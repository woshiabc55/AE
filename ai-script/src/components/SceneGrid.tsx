import { useMemo } from 'react';
import { toolsByAct, type Tool } from '../data/catalog';
import Scene from './Scene';
import { useScriptStore } from '../store/useScriptStore';

interface Props {
  actId: string;
}

export default function SceneGrid({ actId }: Props) {
  const all = useMemo(() => toolsByAct(actId), [actId]);
  const query = useScriptStore((s) => s.query);
  const freeOnly = useScriptStore((s) => s.freeOnly);
  const cnOnly = useScriptStore((s) => s.cnOnly);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((t) => {
      if (freeOnly && !t.isFree) return false;
      if (cnOnly && !t.cnFriendly) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.vendor.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [all, query, freeOnly, cnOnly]);

  if (filtered.length === 0) {
    return (
      <div className="max-w-scriptwide mx-auto px-6 py-12">
        <div className="border border-dashed border-gilt-600/40 p-12 text-center">
          <div className="slate text-gilt-300 text-xs mb-2">EMPTY STAGE</div>
          <div className="font-serif italic text-parchment-200/70">
            这一场，灯光关掉之前没有等到合适的演员。
            <br />
            试着把筛选条件放松一些。
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-scriptwide mx-auto px-6 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((tool: Tool, i) => (
          <Scene key={tool.id} tool={tool} index={i} />
        ))}
      </div>
    </div>
  );
}
