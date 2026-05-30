import { launchPlatforms, launchSteps, recommendedPlan } from '@/data/concept';
import { Check, X, ExternalLink, ChevronRight } from 'lucide-react';

export default function LaunchPlan() {
  return (
    <div className="min-h-screen grid-bg relative">
      <div className="crop-mark crop-mark-tl" />
      <div className="crop-mark crop-mark-tr" />
      <div className="crop-mark crop-mark-bl" />
      <div className="crop-mark crop-mark-br" />

      <header className="border-b border-[#1a1a1a] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="text-[#606060] hover:text-[#1a1a1a] transition-colors text-sm font-mono-cn">
              ← 首页
            </a>
            <div className="w-px h-5 bg-[#d0d0d0]" />
            <h1 className="text-lg font-black">上线方案</h1>
            <span className="font-mono-cn text-[10px] text-[#909090] border border-[#d0d0d0] px-2 py-0.5">
              LAUNCH PLAN v1.0
            </span>
          </div>
          <div className="font-mono-cn text-[10px] text-[#909090]">
            5大平台对比 · 5阶段上线流程
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl font-black">上线</span>
          <span className="text-3xl font-black qblue-accent">方案</span>
        </div>
        <p className="text-sm text-[#606060] max-w-3xl leading-relaxed">
          基于本项目纯静态前端（React+Vite）的技术特征，以及国内用户访问需求，
          以下为完整的部署平台对比分析和推荐上线方案。
        </p>

        <div className="paper-card corner-bracket p-0 overflow-hidden">
          <div className="border-b border-[#1a3a6b] bg-[#1a3a6b] px-5 py-3 flex items-center gap-2">
            <span className="text-white text-sm font-bold">⭐ 推荐方案</span>
            <span className="font-mono-cn text-[10px] text-[#a8c8e8]">RECOMMENDED</span>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-black mb-2">首选：{recommendedPlan.primary}</h3>
                <p className="text-sm text-[#606060] leading-relaxed">{recommendedPlan.reason}</p>
              </div>
              <div>
                <h3 className="text-lg font-black mb-2">备选：{recommendedPlan.secondary}</h3>
                <p className="text-sm text-[#606060] leading-relaxed">{recommendedPlan.secondaryReason}</p>
              </div>
            </div>
            <div className="border-t border-dashed border-[#d0d0d0] pt-4 grid grid-cols-3 gap-4">
              <div>
                <span className="font-mono-cn text-[10px] text-[#909090]">域名</span>
                <p className="text-sm font-mono-cn mt-1">{recommendedPlan.domain}</p>
              </div>
              <div>
                <span className="font-mono-cn text-[10px] text-[#909090]">预估月费</span>
                <p className="text-sm font-bold text-[#1a3a6b] mt-1">{recommendedPlan.estimatedCost}</p>
              </div>
              <div>
                <span className="font-mono-cn text-[10px] text-[#909090]">SLA</span>
                <p className="text-sm font-mono-cn mt-1">{recommendedPlan.sla}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#1a3a6b]" />
            <span className="font-mono-cn text-xs tracking-wider text-[#606060]">
              平台对比 / PLATFORM COMPARISON
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs paper-card overflow-hidden">
              <thead>
                <tr className="bg-[#1a3a6b] text-white">
                  <th className="text-left px-4 py-3 font-mono-cn font-medium">平台</th>
                  <th className="text-left px-4 py-3 font-mono-cn font-medium">免费带宽</th>
                  <th className="text-left px-4 py-3 font-mono-cn font-medium">构建额度</th>
                  <th className="text-left px-4 py-3 font-mono-cn font-medium">国内访问</th>
                  <th className="text-left px-4 py-3 font-mono-cn font-medium">SSL</th>
                  <th className="text-left px-4 py-3 font-mono-cn font-medium">定价</th>
                  <th className="text-left px-4 py-3 font-mono-cn font-medium">部署命令</th>
                </tr>
              </thead>
              <tbody>
                {launchPlatforms.map((p, i) => (
                  <tr key={p.name} className={i % 2 === 0 ? 'bg-white' : 'bg-[#faf8f5]'}>
                    <td className="px-4 py-3 font-bold whitespace-nowrap">
                      <span className="mr-1">{p.logo}</span>
                      {p.name}
                    </td>
                    <td className="px-4 py-3 font-mono-cn">{p.bandwidth}</td>
                    <td className="px-4 py-3 font-mono-cn">{p.buildTime}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 ${p.cnAccess.startsWith('优秀') || p.cnAccess.startsWith('极佳') ? 'text-green-700' : p.cnAccess.startsWith('较差') ? 'text-red-600' : 'text-[#909060]'}`}>
                        {p.cnAccess.startsWith('优秀') || p.cnAccess.startsWith('极佳') ? <Check size={10} /> : p.cnAccess.startsWith('较差') ? <X size={10} /> : '○'}
                        {p.cnAccess.split('—')[0]}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono-cn">{p.ssl}</td>
                    <td className="px-4 py-3 font-mono-cn">{p.pricing}</td>
                    <td className="px-4 py-3 font-mono-cn text-[10px]">{p.deployCmd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#1a3a6b]" />
            <span className="font-mono-cn text-xs tracking-wider text-[#606060]">
              平台详情 / PLATFORM DETAILS
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {launchPlatforms.map((p, i) => (
              <div
                key={p.name}
                className="paper-card corner-bracket p-0 overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="border-b border-[#1a1a1a] px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{p.logo}</span>
                    <h3 className="text-sm font-bold">{p.name}</h3>
                    <span className="param-highlight">{p.tier}</span>
                  </div>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1a3a6b] hover:underline"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
                <div className="px-5 py-4 space-y-3">
                  <div>
                    <span className="font-mono-cn text-[10px] text-[#1a3a6b] font-medium">✓ 优势</span>
                    <ul className="mt-1 space-y-1">
                      {p.pros.map((pro) => (
                        <li key={pro} className="text-xs text-[#1a1a1a] flex items-start gap-1.5">
                          <span className="text-green-600 mt-0.5">·</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-mono-cn text-[10px] text-[#909060] font-medium">✗ 劣势</span>
                    <ul className="mt-1 space-y-1">
                      {p.cons.map((con) => (
                        <li key={con} className="text-xs text-[#606060] flex items-start gap-1.5">
                          <span className="text-red-400 mt-0.5">·</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border-t border-dashed border-[#d0d0d0] pt-3">
                    <span className="font-mono-cn text-[10px] text-[#909090]">最适合：</span>
                    <p className="text-xs mt-1">{p.bestFor}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#1a3a6b]" />
            <span className="font-mono-cn text-xs tracking-wider text-[#606060]">
              上线流程 / LAUNCH WORKFLOW
            </span>
          </div>

          <div className="space-y-4">
            {launchSteps.map((step, i) => (
              <div
                key={step.phase}
                className="paper-card p-0 overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="border-b border-[#1a1a1a] px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 flex items-center justify-center bg-[#1a3a6b] text-white text-xs font-mono-cn font-bold">
                      {i + 1}
                    </span>
                    <div>
                      <span className="font-mono-cn text-[10px] text-[#909090]">{step.phase}</span>
                      <h3 className="text-sm font-bold">{step.title}</h3>
                    </div>
                  </div>
                  <span className="param-highlight">{step.duration}</span>
                </div>
                <div className="px-5 py-4">
                  <ol className="space-y-2">
                    {step.steps.map((s, si) => (
                      <li key={si} className="text-xs text-[#1a1a1a] flex items-start gap-2">
                        <ChevronRight size={10} className="text-[#1a3a6b] mt-0.5 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>

          <div className="paper-card p-5 mt-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold">总预估时间</span>
            </div>
            <div className="grid grid-cols-5 gap-3 text-center">
              {launchSteps.map((step, i) => (
                <div key={step.phase} className="space-y-1">
                  <div className="w-8 h-8 mx-auto flex items-center justify-center bg-[#1a3a6b] text-white text-xs font-mono-cn font-bold rounded">
                    {i + 1}
                  </div>
                  <span className="text-[10px] font-mono-cn text-[#606060]">{step.duration}</span>
                </div>
              ))}
            </div>
            <div className="text-center mt-4 pt-4 border-t border-dashed border-[#d0d0d0]">
              <span className="font-mono-cn text-xs text-[#909090]">合计</span>
              <span className="text-lg font-black qblue-accent ml-2">约 1-2 天</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#d0d0d0] mt-16 py-6">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between font-mono-cn text-[10px] text-[#909090]">
          <span>瓷器设计·青花瓷 LAUNCH PLAN</span>
          <span>Cloudflare Pages · 0元/月</span>
        </div>
      </footer>
    </div>
  );
}
