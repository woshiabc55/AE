import { Hexagon } from 'lucide-react'

export function Footer() {
  return (
    <footer className="relative mt-16 border-t border-bone/10">
      <div className="mx-auto max-w-[1600px] px-4 py-8 md:px-8">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div>
            <div className="flex items-center gap-2">
              <Hexagon className="h-4 w-4 text-neon" />
              <span className="font-pixel text-xs glow-text">IP-CODEX</span>
            </div>
            <p className="mt-2 max-w-md text-xs leading-relaxed text-bone/55">
              收录截至 2026 年 6 月 8 日的全球游戏 IP 衍生作品。资料以公开可查的官方/授权信息为基础整理，欢迎收藏、对比、补全。
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8 font-mono text-[11px]">
            <div>
              <div className="label-pixel mb-2 opacity-70">关于</div>
              <ul className="space-y-1 text-bone/65">
                <li>数据说明</li>
                <li>收录标准</li>
                <li>更新日志</li>
              </ul>
            </div>
            <div>
              <div className="label-pixel mb-2 opacity-70">工具</div>
              <ul className="space-y-1 text-bone/65">
                <li>导出 JSON</li>
                <li>本地收藏</li>
                <li>对比模式</li>
              </ul>
            </div>
            <div>
              <div className="label-pixel mb-2 opacity-70">声明</div>
              <ul className="space-y-1 text-bone/65">
                <li>非商用资料库</li>
                <li>版权归原作者</li>
                <li>联系 / 反馈</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="divider-dotted mt-8 pt-4 text-center text-[10px] tracking-widest text-bone/35">
          © 2026 IP-CODEX · BUILD 2026.06.08 · 像素不死，典藏不止
        </div>
      </div>
    </footer>
  )
}
