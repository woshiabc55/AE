import { NavLink, useNavigate } from "react-router-dom";
import { Boxes, LayoutGrid, FileJson, Beaker } from "lucide-react";
import { useStudioStore } from "@/stores/studioStore";

const tabs = [
  { to: "/studio", label: "工作台", icon: LayoutGrid },
  { to: "/library", label: "模块库", icon: Boxes },
  { to: "/export", label: "导出预览", icon: FileJson },
];

export default function TopNav() {
  const navigate = useNavigate();
  const projectName = useStudioStore((s) => s.projectName);
  const dirty = useStudioStore((s) => s.dirty);
  const saveProject = useStudioStore((s) => s.saveProject);
  const undo = useStudioStore((s) => s.undo);
  const redo = useStudioStore((s) => s.redo);
  const historyIndex = useStudioStore((s) => s.historyIndex);
  const history = useStudioStore((s) => s.history);

  return (
    <header className="relative z-20 flex h-14 items-center justify-between border-b border-ink-600 bg-ink-800/95 px-4 backdrop-blur">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-bead bg-mint shadow-glow">
          <Beaker className="h-4 w-4 text-ink-900" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-pixel text-[9px] text-mint">GIDER</span>
          <span className="font-mono text-[10px] text-ink-400">
            BEAD STUDIO
          </span>
        </div>
        <div className="ml-4 hidden items-center gap-2 md:flex">
          <span className="font-mono text-xs text-ink-400">/</span>
          <span className="font-mono text-xs text-cream">{projectName}</span>
          {dirty && (
            <span className="h-2 w-2 animate-blink rounded-full bg-coral" />
          )}
        </div>
      </div>

      {/* Tabs */}
      <nav className="flex items-center gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-bead px-3 py-2 font-mono text-xs uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-ink-700 text-volt shadow-bead-sm"
                    : "text-ink-400 hover:bg-ink-700/50 hover:text-cream"
                }`
              }
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={undo}
          disabled={historyIndex < 0}
          className="tool-btn h-8 w-8"
          title="撤销"
        >
          <span className="font-mono text-xs">↶</span>
        </button>
        <button
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          className="tool-btn h-8 w-8"
          title="重做"
        >
          <span className="font-mono text-xs">↷</span>
        </button>
        <button
          onClick={async () => {
            await saveProject();
            navigate("/library");
          }}
          className="btn-bead btn-bead-primary h-8 px-3 py-1 text-xs"
        >
          保存
        </button>
      </div>
    </header>
  );
}
