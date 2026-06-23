// 绘制工具栏

import { memo } from "react";
import {
  Brush,
  Eraser,
  PaintBucket,
  Pipette,
  FlipHorizontal,
  Trash2,
  Grid3x3,
} from "lucide-react";
import { useToolStore } from "@/store/useToolStore";
import { useArtworkStore } from "@/store/useArtworkStore";
import type { DrawTool } from "@/types";
import { PixelButton } from "@/components/common/PixelButton";
import { cn } from "@/lib/utils";

const TOOLS: Array<{ id: DrawTool; icon: typeof Brush; label: string }> = [
  { id: "brush", icon: Brush, label: "画笔" },
  { id: "eraser", icon: Eraser, label: "橡皮" },
  { id: "fill", icon: PaintBucket, label: "填充" },
  { id: "picker", icon: Pipette, label: "吸管" },
];

export const Toolbar = memo(function Toolbar() {
  const tool = useToolStore((s) => s.tool);
  const setTool = useToolStore((s) => s.setTool);
  const brushSize = useToolStore((s) => s.brushSize);
  const setBrushSize = useToolStore((s) => s.setBrushSize);
  const mirror = useToolStore((s) => s.mirror);
  const toggleMirror = useToolStore((s) => s.toggleMirror);

  const clearGrid = useArtworkStore((s) => s.clearGrid);
  const gridSize = useArtworkStore((s) => s.gridSize);
  const setGridSize = useArtworkStore((s) => s.setGridSize);

  return (
    <div className="p-3 space-y-3">
      {/* 工具组 */}
      <div>
        <div className="text-[10px] text-ink-300 font-mono mb-2 uppercase tracking-wider">
          工具
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {TOOLS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setTool(id)}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 rounded-lg border transition-all duration-150",
                tool === id
                  ? "bg-ember-500/20 border-ember-500 text-ember-400 shadow-glow"
                  : "bg-ink-700 border-ink-600 text-ink-200 hover:bg-ink-600 hover:text-ink-100",
              )}
            >
              <Icon size={18} />
              <span className="text-[10px] font-mono">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 笔刷大小 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-ink-300 font-mono uppercase tracking-wider">
            笔刷
          </span>
          <span className="text-[10px] text-ember-400 font-mono">{brushSize}px</span>
        </div>
        <input
          type="range"
          min={1}
          max={4}
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-full accent-ember-500"
        />
      </div>

      {/* 镜像开关 */}
      <button
        onClick={toggleMirror}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all duration-150",
          mirror
            ? "bg-mint-500/15 border-mint-500 text-mint-400"
            : "bg-ink-700 border-ink-600 text-ink-300",
        )}
      >
        <span className="flex items-center gap-2 font-mono text-xs">
          <FlipHorizontal size={16} />
          半面镜像
        </span>
        <span
          className={cn(
            "w-9 h-5 rounded-full relative transition-colors",
            mirror ? "bg-mint-500" : "bg-ink-500",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform",
              mirror ? "translate-x-4" : "translate-x-0.5",
            )}
          />
        </span>
      </button>

      {/* 网格尺寸 */}
      <div>
        <div className="flex items-center gap-1 text-[10px] text-ink-300 font-mono mb-2 uppercase tracking-wider">
          <Grid3x3 size={12} />
          <span>网格尺寸</span>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {[16, 24, 32, 48].map((size) => (
            <button
              key={size}
              onClick={() => setGridSize(size)}
              className={cn(
                "py-1.5 rounded text-xs font-mono border transition-all",
                gridSize === size
                  ? "bg-ember-500/20 border-ember-500 text-ember-400"
                  : "bg-ink-700 border-ink-600 text-ink-300 hover:bg-ink-600",
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* 清空 */}
      <PixelButton
        variant="danger"
        size="sm"
        className="w-full"
        onClick={() => {
          if (confirm("确定清空所有拼豆？此操作不可撤销。")) clearGrid();
        }}
      >
        <span className="flex items-center justify-center gap-1.5">
          <Trash2 size={14} />
          清空画布
        </span>
      </PixelButton>
    </div>
  );
});
