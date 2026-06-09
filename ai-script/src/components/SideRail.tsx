import { useEffect, useState } from 'react';
import { ACTS } from '../data/catalog';

// 左侧固定场记编号
export default function SideRail() {
  const [activeId, setActiveId] = useState('cover');

  useEffect(() => {
    const ids = ['cover', 'prologue', ...ACTS.map((a) => a.id), 'fin'];
    const observer = new IntersectionObserver(
      (entries) => {
        // 找出当前最靠近视口中心的可见区段
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const id = (visible[0].target as HTMLElement).id;
          if (id) setActiveId(id);
        }
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <aside className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-3 pointer-events-none">
      {/* 装订线 */}
      <div className="w-px h-24 bg-gradient-to-b from-transparent via-gilt-600 to-transparent" />
      <div className="slate text-[9px] text-gilt-400 vertical-rl">
        A SCREENPLAY OF TOOLS
      </div>
      <div className="slate text-[9px] text-parchment-100/60 vertical-rl">
        86 SCENES · 8 ACTS
      </div>
      <div className="w-px flex-1 max-h-32 bg-gradient-to-b from-gilt-600 via-gilt-600/50 to-transparent" />
      <div className="slate text-[8px] text-gilt-300/80">
        {activeId.toUpperCase().slice(0, 6)}
      </div>
    </aside>
  );
}
