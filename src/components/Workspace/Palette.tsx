// 调色板

import { useToolStore } from "@/store/useToolStore";
import { BEAD_PALETTE } from "@/utils/colors";
import { cn } from "@/lib/utils";
import { Pipette } from "lucide-react";

export function Palette() {
  const color = useToolStore((s) => s.color);
  const setColor = useToolStore((s) => s.setColor);

  return (
    <div className="p-3 space-y-3">
      {/* 当前色 + 自定义 */}
      <div className="flex items-center gap-2">
        <div
          className="w-10 h-10 rounded-lg border-2 border-ink-500 shadow-bead"
          style={{ backgroundColor: color }}
        />
        <div className="flex-1">
          <div className="text-[10px] text-ink-300 font-mono mb-1">当前颜色</div>
          <div className="flex items-center gap-1">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="flex-1 bg-ink-900 border border-ink-600 rounded px-2 py-1 text-xs font-mono text-ink-100 focus:outline-none focus:border-ember-500"
            />
          </div>
        </div>
      </div>

      {/* 色卡网格 */}
      <div>
        <div className="flex items-center gap-1 text-[10px] text-ink-300 font-mono mb-2">
          <Pipette size={12} />
          <span>拼豆色卡 · 48 色</span>
        </div>
        <div className="grid grid-cols-6 gap-1.5">
          {BEAD_PALETTE.map((bead) => (
            <button
              key={bead.hex}
              title={bead.name}
              onClick={() => setColor(bead.hex)}
              className={cn(
                "aspect-square rounded-md border-2 transition-all duration-100 shadow-bead hover:scale-110",
                color.toLowerCase() === bead.hex.toLowerCase()
                  ? "border-ember-400 scale-110 ring-2 ring-ember-500/40"
                  : "border-ink-700 hover:border-ink-400",
              )}
              style={{ backgroundColor: bead.hex }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
