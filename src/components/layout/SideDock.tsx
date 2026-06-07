import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ACTS } from "@/data/acts";
import { CAST } from "@/data/cast";
import { FX } from "@/data/fx";
import { SHOTS } from "@/data/shots";
import { cn } from "@/lib/utils";
import { Compass, Film, ScrollText, Sparkles, Users } from "lucide-react";

type Tab = "acts" | "shots" | "cast" | "fx";

const TABS: { id: Tab; label: string; icon: typeof Compass }[] = [
  { id: "acts", label: "幕", icon: ScrollText },
  { id: "shots", label: "镜", icon: Film },
  { id: "cast", label: "人", icon: Users },
  { id: "fx", label: "效", icon: Sparkles },
];

export function SideDock() {
  const [open, setOpen] = useState(true);
  const [tab, setTab] = useState<Tab>("acts");
  const location = useLocation();

  useEffect(() => {
    // 路由切换时根据页面自动切 tab
    if (location.pathname.startsWith("/storyboard")) setTab("shots");
    else if (location.pathname.startsWith("/cast")) setTab("cast");
    else if (location.pathname.startsWith("/fx")) setTab("fx");
    else setTab("acts");
  }, [location.pathname]);

  return (
    <aside
      className={cn(
        "fixed right-4 top-32 z-30 transition-all",
        open ? "w-64" : "w-12",
      )}
    >
      <div className="card-paper rounded-sm overflow-hidden">
        <button
          aria-label="切换跳转侧栏"
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between px-3 py-2 border-b border-mo-800/20 hover:bg-mo-900/5"
        >
          <span className="flex items-center gap-2 font-xiao text-sm tracking-[0.2em] text-mo-900">
            <Compass className="size-4" />
            {open && "跳转卷轴"}
          </span>
          {open && (
            <span className="font-mono text-[10px] tracking-[0.2em] text-mo-600">
              {open ? "⇥ 收起" : "⇤ 展开"}
            </span>
          )}
        </button>
        {open && (
          <>
            <div className="flex border-b border-mo-800/20">
              {TABS.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={cn(
                      "flex-1 flex flex-col items-center gap-1 py-2 transition-colors",
                      tab === t.id
                        ? "bg-mo-900 text-xuan-100"
                        : "text-mo-800 hover:bg-mo-900/10",
                    )}
                  >
                    <Icon className="size-4" />
                    <span className="font-xiao text-xs tracking-[0.2em]">
                      {t.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <ul className="max-h-[60vh] overflow-y-auto p-2">
              {tab === "acts" &&
                ACTS.map((a) => (
                  <li key={a.id}>
                    <a
                      href={`/#${a.id}`}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-mo-900/5 group"
                    >
                      <span className="font-mono text-[10px] text-mo-600 w-8">
                        {String(a.index).padStart(2, "0")}
                      </span>
                      <span className="font-serif text-sm text-mo-900 group-hover:text-zhu-500 truncate">
                        {a.subtitle}
                      </span>
                    </a>
                  </li>
                ))}
              {tab === "shots" &&
                SHOTS.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`/storyboard#${s.id}`}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-mo-900/5 group"
                    >
                      <span className="font-mono text-[10px] text-mo-600 w-12">
                        {s.number}
                      </span>
                      <span className="font-serif text-xs text-mo-900 group-hover:text-zhu-500 truncate">
                        {s.summary}
                      </span>
                    </a>
                  </li>
                ))}
              {tab === "cast" &&
                CAST.map((c) => (
                  <li key={c.id}>
                    <a
                      href={`/cast#${c.id}`}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-mo-900/5 group"
                    >
                      <span
                        className={cn(
                          "size-2 rounded-full",
                          c.faction === "宋"
                            ? "bg-zhu-500"
                            : c.faction === "辽"
                              ? "bg-qi-500"
                              : "bg-jin-400",
                        )}
                      />
                      <span className="font-serif text-sm text-mo-900 group-hover:text-zhu-500 truncate">
                        {c.name}
                      </span>
                    </a>
                  </li>
                ))}
              {tab === "fx" &&
                FX.map((f) => (
                  <li key={f.id}>
                    <a
                      href={`/fx#${f.id}`}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-mo-900/5 group"
                    >
                      <span className="font-mono text-[10px] text-mo-600 w-10 uppercase">
                        {f.tech}
                      </span>
                      <span className="font-serif text-sm text-mo-900 group-hover:text-zhu-500 truncate">
                        {f.name}
                      </span>
                    </a>
                  </li>
                ))}
            </ul>
            <div className="px-3 py-2 border-t border-mo-800/20 flex items-center justify-between text-[10px] font-mono tracking-[0.2em] text-mo-600">
              <span>5 ACTS · 24 SHOTS</span>
              <Link to="/fx" className="link-ink">
                全部 →
              </Link>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
