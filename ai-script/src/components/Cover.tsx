import { ChevronDown } from 'lucide-react';
import TableOfContents from './TableOfContents';
import { STATS } from '../data/catalog';

export default function Cover() {
  return (
    <section id="cover" className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
      {/* 装饰：场记板 */}
      <div className="absolute top-20 right-6 md:right-16 opacity-80 select-none pointer-events-none">
        <div className="relative w-48 h-28 rotate-3">
          <div className="absolute inset-0 bg-carbon-800 border border-gilt-600/60 shadow-2xl">
            {/* 黑白条纹 */}
            <div className="absolute top-0 left-0 right-0 h-4 grid grid-cols-12">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className={i % 2 === 0 ? 'bg-parchment-50' : 'bg-carbon-900'} />
              ))}
            </div>
            <div className="absolute top-6 left-3 right-3 bottom-3 flex flex-col justify-between text-carbon-900 font-mono">
              <div>
                <div className="text-[8px] tracking-widest opacity-60">SCENE</div>
                <div className="text-lg font-bold leading-none">01</div>
              </div>
              <div>
                <div className="text-[8px] tracking-widest opacity-60">TAKE</div>
                <div className="text-lg font-bold leading-none">A · I</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 装订线 */}
      <div className="absolute left-0 top-0 bottom-0 w-1 binding-line opacity-40 hidden md:block" />

      <div className="max-w-scriptwide w-full text-center relative z-10">
        {/* 顶部小字 */}
        <div className="flex items-center justify-center gap-3 mb-8 text-gilt-300">
          <div className="h-px w-12 bg-gilt-600" />
          <div className="slate text-[10px]">A SCREENPLAY OF TOOLS · MMXXVI</div>
          <div className="h-px w-12 bg-gilt-600" />
        </div>

        {/* 副标 */}
        <div className="slate text-gilt-400 text-[10px] mb-6 tracking-[0.5em]">
          A WORK IN EIGHT ACTS
        </div>

        {/* 剧名 */}
        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-parchment-50 leading-[0.95] text-balance">
          AI 工具
          <br />
          <span className="italic text-clapper-500">剧本</span>
        </h1>

        {/* 英文小标 */}
        <div className="mt-8 font-serif italic text-parchment-200/70 text-lg md:text-xl max-w-xl mx-auto text-pretty">
          当语言长出光，当代码长出场景，
          <br />
          这部关于 86 件工具的剧本缓缓开演。
        </div>

        {/* 制作信息 */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto text-left border-y border-gilt-600/40 py-6">
          <div>
            <div className="label">Produced by</div>
            <div className="font-serif text-parchment-100 mt-1">The Reader's Studio</div>
          </div>
          <div>
            <div className="label">Directed by</div>
            <div className="font-serif text-parchment-100 mt-1">The Catalog</div>
          </div>
          <div>
            <div className="label">Runtime</div>
            <div className="font-serif text-parchment-100 mt-1">
              {STATS.acts} Acts · {STATS.total} Scenes
            </div>
          </div>
          <div>
            <div className="label">Language</div>
            <div className="font-serif text-parchment-100 mt-1">CN / EN / 莫尔斯</div>
          </div>
        </div>

        {/* 滚动提示 */}
        <div className="mt-16 flex flex-col items-center gap-2 text-gilt-300">
          <div className="slate text-[10px]">SCROLL TO BEGIN</div>
          <ChevronDown size={16} className="animate-bounce" />
        </div>
      </div>

      {/* 目录 */}
      <TableOfContents />
    </section>
  );
}
