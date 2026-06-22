// 图层面板

import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Merge,
  Layers,
} from "lucide-react";
import { useArtworkStore } from "@/store/useArtworkStore";
import { cn } from "@/lib/utils";

export function LayerPanel() {
  const layers = useArtworkStore((s) => s.layers);
  const activeLayerId = useArtworkStore((s) => s.activeLayerId);
  const addLayer = useArtworkStore((s) => s.addLayer);
  const removeLayer = useArtworkStore((s) => s.removeLayer);
  const setLayerVisible = useArtworkStore((s) => s.setLayerVisible);
  const setLayerLocked = useArtworkStore((s) => s.setLayerLocked);
  const setLayerName = useArtworkStore((s) => s.setLayerName);
  const setActiveLayer = useArtworkStore((s) => s.setActiveLayer);
  const moveLayerUp = useArtworkStore((s) => s.moveLayerUp);
  const moveLayerDown = useArtworkStore((s) => s.moveLayerDown);
  const mergeLayerDown = useArtworkStore((s) => s.mergeLayerDown);
  const duplicateLayer = useArtworkStore((s) => s.duplicateLayer);

  // 列表从上到下 = layers 数组从后往前（顶层在上）
  const displayLayers = [...layers].reverse();

  return (
    <div className="p-3 space-y-3">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] text-ink-300 font-mono uppercase tracking-wider">
          <Layers size={12} />
          <span>图层 ({layers.length})</span>
        </div>
        <button
          onClick={() => addLayer()}
          className="p-1 rounded hover:bg-ink-700 text-ink-400 hover:text-ember-400 transition-colors"
          title="新建图层"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* 图层列表 */}
      <div className="space-y-1 max-h-80 overflow-auto">
        {displayLayers.map((layer) => {
          const isActive = layer.id === activeLayerId;
          const pixelCount = Object.keys(layer.pixels).length;

          return (
            <div
              key={layer.id}
              onClick={() => setActiveLayer(layer.id)}
              className={cn(
                "flex items-center gap-1.5 px-2 py-2 rounded-lg border transition-all cursor-pointer group",
                isActive
                  ? "bg-ember-500/15 border-ember-500/50"
                  : "bg-ink-900/40 border-ink-600/30 hover:border-ink-500",
              )}
            >
              {/* 缩略色块 */}
              <div
                className="w-7 h-7 rounded border border-ink-600 flex-shrink-0 grid grid-cols-2 grid-rows-2 gap-px p-0.5"
                style={{ backgroundColor: "#0f0a1a" }}
              >
                {(() => {
                  const colors = Object.values(layer.pixels).slice(0, 4);
                  while (colors.length < 4) colors.push("transparent");
                  return colors.map((c, i) => (
                    <div
                      key={i}
                      className="rounded-sm"
                      style={{ backgroundColor: c }}
                    />
                  ));
                })()}
              </div>

              {/* 名称 */}
              <input
                value={layer.name}
                onChange={(e) => setLayerName(layer.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "flex-1 min-w-0 bg-transparent text-xs font-mono px-1 py-0.5 rounded focus:outline-none focus:bg-ink-900/80",
                  isActive ? "text-ink-100" : "text-ink-300",
                )}
              />

              {/* 像素数 */}
              <span className="text-[9px] text-ink-500 font-mono flex-shrink-0">
                {pixelCount}
              </span>

              {/* 操作按钮 (hover 显示) */}
              <div className="hidden group-hover:flex items-center gap-0.5 flex-shrink-0">
                {/* 上移 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveLayerUp(layer.id);
                  }}
                  className="p-0.5 rounded hover:bg-ink-600 text-ink-400 hover:text-ink-200"
                  title="上移"
                >
                  <ArrowUp size={10} />
                </button>
                {/* 下移 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveLayerDown(layer.id);
                  }}
                  className="p-0.5 rounded hover:bg-ink-600 text-ink-400 hover:text-ink-200"
                  title="下移"
                >
                  <ArrowDown size={10} />
                </button>
                {/* 复制 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateLayer(layer.id);
                  }}
                  className="p-0.5 rounded hover:bg-ink-600 text-ink-400 hover:text-mint-400"
                  title="复制图层"
                >
                  <Copy size={10} />
                </button>
                {/* 向下合并 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    mergeLayerDown(layer.id);
                  }}
                  className="p-0.5 rounded hover:bg-ink-600 text-ink-400 hover:text-sun-400"
                  title="向下合并"
                  disabled={layer.id === layers[0]?.id}
                >
                  <Merge size={10} />
                </button>
                {/* 删除 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (layers.length <= 1) return;
                    removeLayer(layer.id);
                  }}
                  className="p-0.5 rounded hover:bg-red-600/30 text-ink-400 hover:text-red-400"
                  title="删除图层"
                  disabled={layers.length <= 1}
                >
                  <Trash2 size={10} />
                </button>
              </div>

              {/* 可见性 / 锁定 — 始终显示 */}
              <div className="flex items-center gap-0.5 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLayerVisible(layer.id, !layer.visible);
                  }}
                  className="p-0.5 rounded hover:bg-ink-600 transition-colors"
                  title={layer.visible ? "隐藏" : "显示"}
                >
                  {layer.visible ? (
                    <Eye size={11} className="text-ink-300" />
                  ) : (
                    <EyeOff size={11} className="text-ink-500" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLayerLocked(layer.id, !layer.locked);
                  }}
                  className="p-0.5 rounded hover:bg-ink-600 transition-colors"
                  title={layer.locked ? "解锁" : "锁定"}
                >
                  {layer.locked ? (
                    <Lock size={11} className="text-sun-400" />
                  ) : (
                    <Unlock size={11} className="text-ink-500" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 当前图层提示 */}
      <div className="bg-ink-900/40 rounded-lg p-2.5 border border-ink-600/30">
        <div className="text-[10px] text-ink-300 font-mono leading-relaxed">
          {(() => {
            const active = layers.find((l) => l.id === activeLayerId);
            if (!active) return "无活动图层";
            const status = [];
            if (active.locked) status.push("已锁定");
            if (!active.visible) status.push("已隐藏");
            return `当前：${active.name}${status.length ? " · " + status.join("，") : ""}`;
          })()}
        </div>
        <div className="text-[10px] text-ink-400 font-mono mt-1">
          点击图层切换活跃 · 绘制仅影响活跃图层
        </div>
      </div>
    </div>
  );
}