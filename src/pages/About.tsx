import { Database, Cpu, Heart, Globe2, Mail, Sparkles } from 'lucide-react';

export default function About() {
  return (
    <div className="container py-12 max-w-4xl">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-neon-cyan font-mono text-xs mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>// ABOUT_THIS_PROJECT</span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-gradient-neon">
          关于 NEON.FRAME
        </h1>
        <p className="text-white/60 mt-3 leading-relaxed">
          一份为 ACG 爱好者、游戏玩家和 IP 研究者打造的开源、现代化的游戏 IP 衍生作品资料库。
          我们希望用更结构化、更易检索的方式，把散落在各平台的游戏 IP 衍生作品聚合到一处。
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <InfoCard
          icon={<Database className="w-5 h-5" />}
          color="text-neon-cyan"
          title="数据规模"
          desc="覆盖 350+ 主流游戏 IP，聚合 4000+ 款衍生作品条目，涵盖动画、漫画、电影、小说、舞台剧、手办、周边、音乐、真人影视等 10 大类型。"
        />
        <InfoCard
          icon={<Cpu className="w-5 h-5" />}
          color="text-neon-pink"
          title="技术栈"
          desc="React 18 + TypeScript + Vite + TailwindCSS + Zustand，静态数据 + 客户端筛选。所有内容以单页应用形式分发，无后端依赖。"
        />
        <InfoCard
          icon={<Globe2 className="w-5 h-5" />}
          color="text-neon-violet"
          title="覆盖范围"
          desc="横跨日本、美国、中国、韩国、欧洲等地区，从 1985 年的早期游戏到 2026 年的最新作品，纵贯 40 余年游戏文化史。"
        />
        <InfoCard
          icon={<Heart className="w-5 h-5" />}
          color="text-neon-yellow"
          title="设计理念"
          desc="Cyber/Synthwave 暗黑 + 霓虹辉光，契合游戏 IP 的科技感与 ACG 圈层审美；桌面优先，移动端自适应。"
        />
      </div>

      <div className="mt-10 card-neon p-6">
        <div className="text-[10px] text-white/40 font-mono mb-2">// CHANGELOG</div>
        <ul className="space-y-2 text-sm text-white/70">
          <li className="flex gap-2">
            <span className="text-neon-cyan font-mono shrink-0">2026.06.08</span>
            <span>数据库 v2.0 发布：扩展至 4000+ 款衍生作品，新增 50+ 头部 IP 真实作品注入。</span>
          </li>
          <li className="flex gap-2">
            <span className="text-neon-pink font-mono shrink-0">2026.05.15</span>
            <span>新增数据看板：类型分布、地区分布、年份趋势、Top 10 IP。</span>
          </li>
          <li className="flex gap-2">
            <span className="text-neon-violet font-mono shrink-0">2026.04.02</span>
            <span>浏览页：多维筛选 + 网格/列表视图 + 详情抽屉。</span>
          </li>
          <li className="flex gap-2">
            <span className="text-neon-yellow font-mono shrink-0">2026.02.20</span>
            <span>数据库 v1.0 正式上线，初版 2000+ 款衍生作品。</span>
          </li>
        </ul>
      </div>

      <div className="mt-10 card-neon p-6 text-center">
        <Mail className="w-6 h-6 mx-auto text-neon-cyan mb-3" />
        <h3 className="font-display text-xl font-bold text-white/90">联系 & 贡献</h3>
        <p className="text-sm text-white/60 mt-2">
          数据如有错漏，欢迎指正；希望贡献新 IP 或新衍生作品条目，请发送至
          <span className="text-neon-cyan mx-1">hello@neon-frame.dev</span>
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="chip text-neon-cyan">v2.0.0</span>
          <span className="chip text-neon-pink">OPEN_SOURCE</span>
          <span className="chip text-neon-violet">MIT_LIKE</span>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, desc, color }: { icon: React.ReactNode; title: string; desc: string; color: string }) {
  return (
    <div className="card-neon p-5">
      <div className={`w-10 h-10 rounded-sm grid place-items-center bg-white/5 ${color} mb-3`}>
        {icon}
      </div>
      <div className="font-semibold text-lg text-white/90 mb-1">{title}</div>
      <p className="text-sm text-white/60 leading-relaxed">{desc}</p>
    </div>
  );
}
