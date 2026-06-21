import { useEffect, useRef } from "react";
import type { UnfoldedMask } from "@/engine/maskUnfolder";
import { renderUnfoldedMask } from "@/engine/maskUnfolder";

interface Props {
  mask: UnfoldedMask | null;
  gridSize: number;
  cellSize?: number;
}

export default function MaskHeatmap({ mask, gridSize, cellSize = 18 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx || !mask) return;
    renderUnfoldedMask(ctx, mask, cellSize, gridSize);
  }, [mask, gridSize, cellSize]);

  if (!mask) {
    return (
      <div className="panel flex h-full items-center justify-center p-4">
        <span className="font-mono text-xs text-ink-400">
          暂无骨架蒙版数据
        </span>
      </div>
    );
  }

  return (
    <div className="panel h-full overflow-auto p-3">
      <h3 className="title-pixel mb-2">MASK HEATMAP</h3>
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          className="rounded-bead"
          style={{ imageRendering: "pixelated" }}
        />
      </div>
      <div className="mt-3 space-y-1">
        <div className="font-mono text-[10px] text-ink-400">
          关节影响统计：
        </div>
        {mask.jointStats.map((s, i) => (
          <div
            key={s.jointId}
            className="flex items-center gap-2 font-mono text-[10px]"
          >
            <span
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-ink-300">J{i + 1}</span>
            <span className="text-ink-500">|</span>
            <span className="text-volt">{s.beadCount}</span>
            <span className="text-ink-500">豆</span>
            <span className="text-ink-500">|</span>
            <span className="text-mint">
              {(s.avgWeight * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
