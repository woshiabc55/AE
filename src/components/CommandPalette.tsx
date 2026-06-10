// 全局命令面板 (⌘K)
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, FileText, Pen, Compass, Library, Settings, ScrollText } from "lucide-react";
import { useAppStore } from "@/store";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const templates = useAppStore((s) => s.templates);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const ql = q.trim().toLowerCase();
    const items: Array<{ id: string; label: string; sub?: string; kind: "template" | "page"; to: string; icon: any }> = [
      { id: "p-home", label: "Discover · 首页", kind: "page", to: "/", icon: Compass },
      { id: "p-lib", label: "Library · 公共模板库", kind: "page", to: "/library", icon: Library },
      { id: "p-stu", label: "Studio · 新建模板", kind: "page", to: "/studio", icon: Pen },
      { id: "p-ws", label: "Workshop · 我的工作台", kind: "page", to: "/workshop", icon: ScrollText },
      { id: "p-set", label: "Settings · 设置", kind: "page", to: "/settings", icon: Settings },
    ];
    if (ql) {
      items.push(
        ...templates
          .filter(
            (t) =>
              t.title.toLowerCase().includes(ql) ||
              t.logline.toLowerCase().includes(ql) ||
              t.tags.some((tg) => tg.toLowerCase().includes(ql))
          )
          .slice(0, 8)
          .map((t) => ({
            id: "t-" + t.id,
            label: t.title,
            sub: t.logline,
            kind: "template" as const,
            to: "/library/" + t.id,
            icon: FileText,
          }))
      );
    } else {
      items.push(
        ...templates
          .slice(0, 5)
          .map((t) => ({
            id: "t-" + t.id,
            label: t.title,
            sub: t.logline,
            kind: "template" as const,
            to: "/library/" + t.id,
            icon: FileText,
          }))
      );
    }
    return items;
  }, [q, templates]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
      onClick={() => setOpen(false)}
    >
      <div className="absolute inset-0 bg-ink-950/85 backdrop-blur" />
      <div
        className="relative w-full max-w-xl panel bg-ink-800 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-ink-600 px-4 py-3">
          <Search size={16} className="text-amber" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索模板、节拍、标签…  ⌘K"
            className="flex-1 bg-transparent outline-none font-mono text-[13px] text-paper-100 placeholder:text-ink-400"
          />
          <span className="label-overline">esc</span>
        </div>
        <div className="max-h-[50vh] overflow-auto">
          {results.length === 0 ? (
            <div className="px-4 py-10 text-center text-ink-300 font-mono text-[12px]">
              没有匹配项
            </div>
          ) : (
            results.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  nav(r.to);
                  setOpen(false);
                  setQ("");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 border-b border-ink-700/60 text-left hover:bg-ink-700/60"
              >
                <r.icon size={14} className="text-amber shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-serif text-[14px] text-paper-100 truncate">
                    {r.label}
                  </div>
                  {r.sub && (
                    <div className="font-mono text-[11px] text-ink-300 truncate">
                      {r.sub}
                    </div>
                  )}
                </div>
                <span className="label-overline shrink-0">
                  {r.kind === "page" ? "page" : "template"}
                </span>
                <ArrowRight size={13} className="text-ink-300" />
              </button>
            ))
          )}
        </div>
        <div className="border-t border-ink-600 px-4 py-2 flex items-center justify-between label-overline text-ink-400">
          <span>{templates.length} 个模板 · {results.length} 条结果</span>
          <span>↑↓ 选择 · ↵ 进入</span>
        </div>
      </div>
    </div>
  );
}
