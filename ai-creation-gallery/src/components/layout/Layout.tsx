import { Outlet, Link } from "react-router-dom";
import { Hexagon, Github, Sparkles } from "lucide-react";
import Navbar from "./Navbar";
import DetailDrawer from "@/components/detail/DetailDrawer";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="relative mt-24 border-t border-white/8">
        <div className="container grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="relative grid h-9 w-9 place-items-center">
                <Hexagon className="absolute inset-0 h-9 w-9 text-magenta" strokeWidth={1.4} />
                <span className="font-display text-sm font-black text-cyan">CC</span>
              </span>
              <div className="leading-tight">
                <p className="font-display text-sm font-bold tracking-widest text-white">
                  CYBER CURATORIUM
                </p>
                <p className="font-mono text-[10px] tracking-[0.3em] text-white/40">
                  AI 二创聚合馆
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/45">
              聚合抖音热门 AI 二创作品的策展画廊，按角色卡牌、场景壁纸、物品设计三大维度系统化收录，让分散的灵感得以一站汇聚。
            </p>
          </div>

          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-cyan-soft/70">
              馆藏导航
            </p>
            <ul className="space-y-2.5 text-sm text-white/55">
              <li><Link to="/cards" className="transition-colors hover:text-magenta-soft">角色卡牌</Link></li>
              <li><Link to="/scenes" className="transition-colors hover:text-magenta-soft">场景壁纸</Link></li>
              <li><Link to="/items" className="transition-colors hover:text-magenta-soft">物品设计</Link></li>
              <li><Link to="/search" className="transition-colors hover:text-magenta-soft">全馆搜索</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-cyan-soft/70">
              关于本馆
            </p>
            <ul className="space-y-2.5 text-sm text-white/55">
              <li className="inline-flex items-center gap-1.5"><Sparkles size={13} className="text-magenta" /> 作品图由 AI 实时生成</li>
              <li className="inline-flex items-center gap-1.5"><Github size={13} className="text-cyan" /> 纯前端独立项目</li>
              <li className="text-white/35">数据为策展演示用</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/8 py-5">
          <p className="container text-center font-mono text-xs text-white/30">
            © {new Date().getFullYear()} Cyber Curatorium · 灵感来自抖音 AI 二创社区
          </p>
        </div>
      </footer>

      <DetailDrawer />
    </div>
  );
}
