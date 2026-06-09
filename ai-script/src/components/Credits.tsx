import { STATS, ACTS } from '../data/catalog';
import { Film } from 'lucide-react';

export default function Credits() {
  return (
    <section id="fin" className="relative max-w-scriptwide mx-auto px-6 py-32">
      <div className="act-rule mb-16" />

      <div className="text-center mb-16">
        <div className="slate text-gilt-300 text-[10px] mb-3">FIN · 终幕</div>
        <h2 className="font-display text-5xl md:text-6xl text-parchment-50 leading-tight">
          灯光暗下，
          <br />
          <span className="italic text-clapper-500">片尾字幕</span>
        </h2>
      </div>

      {/* 统计 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        <div className="border border-gilt-600/40 p-5 text-center">
          <div className="font-display text-4xl text-clapper-500">{STATS.total}</div>
          <div className="label mt-2">SCENES</div>
        </div>
        <div className="border border-gilt-600/40 p-5 text-center">
          <div className="font-display text-4xl text-clapper-500">{STATS.acts}</div>
          <div className="label mt-2">ACTS</div>
        </div>
        <div className="border border-gilt-600/40 p-5 text-center">
          <div className="font-display text-4xl text-clapper-500">{STATS.free}</div>
          <div className="label mt-2">FREE LAYER</div>
        </div>
        <div className="border border-gilt-600/40 p-5 text-center">
          <div className="font-display text-4xl text-clapper-500">{STATS.cnFriendly}</div>
          <div className="label mt-2">CN FRIENDLY</div>
        </div>
      </div>

      {/* 鸣谢 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-serif">
        <div>
          <div className="label mb-3">Directed & Curated by</div>
          <div className="text-parchment-100 text-lg">The Reader's Studio</div>
          <div className="text-parchment-200/60 text-sm mt-1">
            一群在深夜里被工具反复拯救的人。
          </div>
        </div>
        <div>
          <div className="label mb-3">Original Score by</div>
          <div className="text-parchment-100 text-lg">没有配乐</div>
          <div className="text-parchment-200/60 text-sm mt-1">
            你可以打开 Suno，输入 "minimal piano, hopeful"。
          </div>
        </div>
        <div>
          <div className="label mb-3">Data Sources</div>
          <div className="text-parchment-100 text-sm space-y-1">
            <div>· 官方文档与定价页</div>
            <div>· 第三方测评与社区共识</div>
            <div>· 编辑部实地使用记录</div>
          </div>
        </div>
        <div>
          <div className="label mb-3">Disclaimer</div>
          <div className="text-parchment-200/70 text-sm leading-relaxed">
            本剧本不构成投资建议。信息以各工具官方页面为准。
            工具会过时，但愿你写下的分镜不会。
          </div>
        </div>
      </div>

      {/* 滚动字幕 */}
      <div className="mt-20 border-y border-gilt-600/40 py-8 overflow-hidden">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {[...ACTS, ...ACTS].map((act, i) => (
            <div key={i} className="flex items-center gap-3">
              <Film size={14} className="text-clapper-500" />
              <div className="slate text-parchment-100 text-xs">
                {act.roman} · {act.title} · {act.subtitle}
              </div>
              <div className="text-gilt-600">·</div>
            </div>
          ))}
        </div>
      </div>

      {/* 版本号 */}
      <div className="mt-12 text-center">
        <div className="slate text-gilt-300 text-[10px]">
          END OF REEL · v0.1.0 · LAST UPDATED MMXXVI · 86 SCENES · 8 ACTS
        </div>
        <div className="mt-4 font-display italic text-parchment-200/60 text-lg">
          "工具是镜头，剧本在你心里。"
        </div>
        <div className="mt-8">
          <a href="#cover" className="btn-hard gilt">
            ↑ 返回封面
          </a>
        </div>
      </div>
    </section>
  );
}
