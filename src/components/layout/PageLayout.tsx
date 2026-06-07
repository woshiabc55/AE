import { ReactNode } from "react";
import { TopNav } from "./TopNav";
import { SideDock } from "./SideDock";

export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen relative">
      {/* 远山叠层 */}
      <div className="bg-mountain" aria-hidden />
      <TopNav />
      <main className="relative z-10 mx-auto max-w-[1480px] px-6 pb-32">
        {children}
      </main>
      <SideDock />
      <footer className="relative z-10 border-t border-mo-800/20 bg-xuan-100/70">
        <div className="mx-auto max-w-[1480px] px-6 py-8 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="font-xiao tracking-[0.2em] text-mo-900 text-sm">
            燕云长卷 · 宋代北伐剧作工作台
          </div>
          <div className="font-mono text-[10px] tracking-[0.3em] text-mo-600">
            A WORKBENCH FOR HISTORICAL STORYBOARD · 2026
          </div>
          <div className="md:ml-auto font-serif text-xs text-mo-700">
            「高粱河车神与雍熙悲歌」 — 仅用于剧本拆解与教学演示
          </div>
        </div>
      </footer>
    </div>
  );
}
