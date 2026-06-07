import { Link, NavLink } from "react-router-dom";
import { ScrollText, Film, Users, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/", label: "拆解", icon: ScrollText, hint: "剧本拆解台" },
  { to: "/storyboard", label: "分镜", icon: Film, hint: "分镜表" },
  { to: "/cast", label: "人物", icon: Users, hint: "角色设计" },
  { to: "/fx", label: "特效", icon: Sparkles, hint: "特殊效果" },
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-40">
      <div className="border-b border-mo-800/20 bg-xuan-100/85 backdrop-blur">
        <div className="mx-auto max-w-[1480px] px-6 py-3 flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="seal text-[11px]">燕云</span>
            <div className="leading-tight">
              <div className="font-xiao text-xl tracking-[0.2em] text-mo-900">
                燕云长卷
              </div>
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-mo-600">
                Song · Northern Expeditions · Workbench
              </div>
            </div>
          </Link>
          <nav className="ml-auto flex items-center gap-1">
            {ITEMS.map((it) => {
              const Icon = it.icon;
              return (
                <NavLink
                  key={it.to}
                  to={it.to}
                  end={it.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center gap-2 px-3 py-2 rounded-sm border border-transparent transition-colors",
                      isActive
                        ? "bg-mo-900 text-xuan-100"
                        : "text-mo-800 hover:bg-mo-900/10",
                    )
                  }
                >
                  <Icon className="size-4" />
                  <span className="font-xiao tracking-[0.18em] text-sm">
                    {it.label}
                  </span>
                  <span className="hidden lg:inline font-mono text-[10px] tracking-[0.2em] opacity-70 ml-1">
                    {it.hint}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
      {/* 烽烟装饰 */}
      <div className="relative h-3 overflow-hidden bg-gradient-to-b from-xuan-100 to-transparent">
        <div className="absolute left-[10%] bottom-0 smoke-puff animate-smoke" />
        <div
          className="absolute left-[35%] bottom-0 smoke-puff animate-smoke"
          style={{ animationDelay: "1.2s" }}
        />
        <div
          className="absolute left-[60%] bottom-0 smoke-puff animate-smoke"
          style={{ animationDelay: "2.4s" }}
        />
        <div
          className="absolute left-[82%] bottom-0 smoke-puff animate-smoke"
          style={{ animationDelay: "3.6s" }}
        />
      </div>
    </header>
  );
}
