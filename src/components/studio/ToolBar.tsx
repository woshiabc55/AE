import {
  Brush,
  Eraser,
  PaintBucket,
  Pipette,
  Bone,
  MousePointer2,
  Grid3x3,
  FlipHorizontal,
  Trash2,
} from "lucide-react";
import { useStudioStore } from "@/stores/studioStore";
import type { Tool } from "@/types";

const tools: Array<{ id: Tool; label: string; icon: typeof Brush }> = [
  { id: "brush", label: "画笔", icon: Brush },
  { id: "eraser", label: "橡皮", icon: Eraser },
  { id: "fill", label: "填充", icon: PaintBucket },
  { id: "picker", label: "吸管", icon: Pipette },
  { id: "skeleton", label: "骨架", icon: Bone },
  { id: "select", label: "选择", icon: MousePointer2 },
];

export default function ToolBar() {
  const {
    tool,
    setTool,
    currentColor,
    setColor,
    palette,
    activeSide,
    setActiveSide,
    showGrid,
    toggleGrid,
    showHalfDivider,
    toggleHalfDivider,
    showSkeleton,
    toggleSkeleton,
    mirrorActiveToOther,
    clearActiveSide,
  } = useStudioStore();

  return (
    <aside className="flex w-16 flex-col items-center gap-3 border-r border-ink-600 bg-ink-800/80 p-2 lg:w-20">
      {/* 工具组 */}
      <div className="flex flex-col gap-1.5">
        {tools.map((t) => {
          const Icon = t.icon;
          const active = tool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              className={`tool-btn ${active ? "tool-btn-active" : ""}`}
              title={t.label}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>

      <div className="h-px w-8 bg-ink-600" />

      {/* 半面切换 */}
      <div className="flex flex-col gap-1">
        <button
          onClick={() => setActiveSide("left")}
          className={`tool-btn h-10 w-10 flex-col gap-0.5 ${
            activeSide === "left" ? "tool-btn-active" : ""
          }`}
          title="编辑左半面"
        >
          <span className="font-pixel text-[8px]">L</span>
        </button>
        <button
          onClick={() => setActiveSide("right")}
          className={`tool-btn h-10 w-10 flex-col gap-0.5 ${
            activeSide === "right" ? "tool-btn-active" : ""
          }`}
          title="编辑右半面"
        >
          <span className="font-pixel text-[8px]">R</span>
        </button>
      </div>

      <div className="h-px w-8 bg-ink-600" />

      {/* 显示开关 */}
      <button
        onClick={toggleGrid}
        className={`tool-btn ${showGrid ? "tool-btn-active" : ""}`}
        title="网格"
      >
        <Grid3x3 className="h-4 w-4" />
      </button>
      <button
        onClick={toggleHalfDivider}
        className={`tool-btn ${showHalfDivider ? "tool-btn-active" : ""}`}
        title="半面分隔线"
      >
        <span className="font-mono text-xs">|</span>
      </button>
      <button
        onClick={toggleSkeleton}
        className={`tool-btn ${showSkeleton ? "tool-btn-active" : ""}`}
        title="骨架"
      >
        <Bone className="h-4 w-4" />
      </button>

      <div className="h-px w-8 bg-ink-600" />

      {/* 操作 */}
      <button
        onClick={mirrorActiveToOther}
        className="tool-btn"
        title="镜像到另一半"
      >
        <FlipHorizontal className="h-4 w-4" />
      </button>
      <button onClick={clearActiveSide} className="tool-btn" title="清空当前半面">
        <Trash2 className="h-4 w-4" />
      </button>

      {/* 调色板 */}
      <div className="mt-2 flex flex-col items-center gap-1">
        <span className="title-pixel text-[7px] text-ink-400">PAL</span>
        <div
          className="h-6 w-6 rounded-bead border-2 border-cream shadow-bead-sm"
          style={{ backgroundColor: palette[currentColor] }}
        />
        <div className="grid grid-cols-2 gap-0.5">
          {palette.slice(1, 25).map((c, i) => {
            const idx = i + 1;
            const active = idx === currentColor;
            return (
              <button
                key={idx}
                onClick={() => setColor(idx)}
                className={`h-4 w-4 rounded border transition-all ${
                  active
                    ? "border-cream scale-110 shadow-glow"
                    : "border-ink-600 hover:scale-110"
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            );
          })}
        </div>
      </div>
    </aside>
  );
}
