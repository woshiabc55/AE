import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Grid2x2, LayoutList, Rows, RefreshCw, Download, Sparkles, ZoomIn, ZoomOut } from "lucide-react";
import { useProjectStore } from "@/store/projectStore";
import { buildAtlas } from "@/engine/atlas/packer";
import { downloadBlob } from "@/engine/exporter";
import { cn } from "@/lib/utils";

type PackMode = "shelf" | "grid" | "strip";

const MODES: { id: PackMode; name: string; desc: string; icon: any }[] = [
  { id: "shelf", name: "Shelf 货架", desc: "按高度分行，效率最高", icon: Rows },
  { id: "grid", name: "Grid 网格", desc: "等分网格，直观", icon: Grid2x2 },
  { id: "strip", name: "Strip 长条", desc: "单行排列，便于调试", icon: LayoutList },
];

export default function Atlas() {
  const project = useProjectStore((s) => s.project);
  const setAtlas = useProjectStore((s) => s.setAtlas);
  const navigate = useNavigate();

  const [mode, setMode] = useState<PackMode>("shelf");
  const [padding, setPadding] = useState(4);
  const [pot, setPot] = useState(true);
  const [busy, setBusy] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // 自动生成
  useEffect(() => {
    if (project.atlas === null && project.layers.length > 0) {
      handleBuild();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id]);

  const handleBuild = async () => {
    setBusy(true);
    try {
      const result = await buildAtlas(
        { layers: project.layers, padding, powerOfTwo: pot },
        mode
      );
      setAtlas(result);
      if (result.slots[0]) setSelectedSlot(result.slots[0].layerId);
    } finally {
      setBusy(false);
    }
  };

  const handleDownloadAtlas = () => {
    if (!project.atlas) return;
    fetch(project.atlas.pngDataUrl)
      .then((r) => r.blob())
      .then((b) => downloadBlob(b, `${project.name || "atlas"}.png`));
  };

  const handleDownloadJson = () => {
    if (!project.atlas) return;
    const payload = {
      format: "mochi-live.atlas",
      version: 1,
      atlas: {
        width: project.atlas.width,
        height: project.atlas.height,
        mode: project.atlas.mode,
        efficiency: project.atlas.efficiency,
        slots: project.atlas.slots.map((s) => ({
          layerId: s.layerId,
          layerName: project.layers.find((l) => l.id === s.layerId)?.name ?? "",
          x: s.x,
          y: s.y,
          width: s.width,
          height: s.height,
          uv: [s.u0, s.v0, s.u1, s.v1],
        })),
      },
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    downloadBlob(blob, `${project.name || "atlas"}.mochi.atlas.json`);
  };

  const atlas = project.atlas;
  const selectedLayer = selectedSlot ? project.layers.find((l) => l.id === selectedSlot) : null;
  const selectedSlotData = selectedSlot && atlas ? atlas.slots.find((s) => s.layerId === selectedSlot) : null;

  return (
    <div className="flex-1 flex flex-col min-h-0 px-4 py-3 gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="label-cap">04 · ATLAS</span>
          <span className="text-mist-200 text-sm">/</span>
          <span className="text-display text-mist-50">像素展开 · 贴图打包</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/mesh")} className="btn-ghost">
            <ArrowLeft className="w-4 h-4" /> 上一步
          </button>
          <button onClick={handleBuild} disabled={busy} className="btn-butter">
            <RefreshCw className={cn("w-4 h-4", busy && "animate-spin")} />
            {busy ? "打包中..." : "重新打包"}
          </button>
          <button
            onClick={() => navigate("/animate")}
            disabled={!atlas || atlas.slots.length === 0}
            className="btn-primary"
          >
            下一步：套用动画 <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-[20rem_1fr_18rem] gap-3">
        {/* 左侧：模式与图层列表 */}
        <div className="flex flex-col gap-3 min-h-0">
          <div className="panel p-3 flex flex-col gap-2">
            <div className="label-cap">打包模式</div>
            <div className="flex flex-col gap-1.5">
              {MODES.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={cn(
                      "panel-solid p-2.5 text-left flex items-center gap-2 transition-all",
                      mode === m.id ? "ring-1 ring-sakura-400" : "hover:ring-1 hover:ring-sakura-400/40"
                    )}
                  >
                    <Icon className="w-4 h-4 text-sakura-300" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-display text-mist-50">{m.name}</div>
                      <div className="text-[10px] font-mono text-mist-300">{m.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="h-px bg-mist-100/5 my-1" />
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center justify-between text-xs font-mono text-mist-100">
                <span>间距 padding</span>
                <span className="text-sakura-300">{padding}px</span>
              </label>
              <input
                type="range"
                min={0}
                max={32}
                value={padding}
                onChange={(e) => setPadding(parseInt(e.target.value))}
                className="accent-sakura-400"
              />
              <label className="flex items-center justify-between text-xs font-mono text-mist-100 mt-1">
                <span>强制 2 的幂 (POT)</span>
                <button
                  onClick={() => setPot((p) => !p)}
                  className={cn(
                    "w-9 h-5 rounded-full transition-colors relative",
                    pot ? "bg-sakura-400" : "bg-ink-600"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 w-4 h-4 rounded-full bg-mist-50 transition-transform",
                      pot ? "translate-x-[18px]" : "translate-x-0.5"
                    )}
                  />
                </button>
              </label>
            </div>
          </div>

          <div className="panel p-3 flex flex-col gap-2 flex-1 min-h-0">
            <div className="flex items-center justify-between">
              <div className="label-cap">slot 列表</div>
              <span className="chip">{atlas?.slots.length ?? 0}</span>
            </div>
            <div className="flex-1 overflow-y-auto -mx-1 px-1 flex flex-col gap-1">
              {atlas?.slots.length === 0 && (
                <div className="text-center text-mist-300 text-xs py-6">
                  {busy ? "打包中..." : "先在上一步切分图层"}
                </div>
              )}
              {atlas?.slots.map((s, i) => {
                const layer = project.layers.find((l) => l.id === s.layerId);
                return (
                  <button
                    key={s.layerId}
                    onClick={() => setSelectedSlot(s.layerId)}
                    className={cn(
                      "panel-solid p-2 text-left flex items-center gap-2",
                      selectedSlot === s.layerId ? "ring-1 ring-sakura-400" : "hover:ring-1 hover:ring-sakura-400/40"
                    )}
                  >
                    <div
                      className="w-10 h-10 rounded-md bg-ink-800 border border-mist-100/5 overflow-hidden flex items-center justify-center"
                      style={{
                        backgroundImage: `url(${atlas.pngDataUrl})`,
                        backgroundSize: `${atlas.width}px ${atlas.height}px`,
                        backgroundPosition: `-${s.x}px -${s.y}px`,
                        backgroundRepeat: "no-repeat",
                        width: Math.min(40, s.width * 0.5),
                        height: Math.min(40, s.height * 0.5),
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-display text-mist-50 truncate">{layer?.name ?? s.layerId}</div>
                      <div className="text-[10px] font-mono text-mist-300">
                        {s.width} × {s.height}
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-sakura-300">#{i.toString().padStart(2, "0")}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 中央：atlas 预览 */}
        <div className="panel p-3 flex flex-col gap-2 min-h-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sakura-400" />
              <div className="text-display text-mist-50">Texture Atlas</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="chip">
                <span className="text-mist-300">size</span>
                <span className="text-mist-50">{atlas?.width ?? 0}×{atlas?.height ?? 0}</span>
              </div>
              <div className="chip">
                <span className="text-mist-300">eff</span>
                <span className="text-sakura-300">{((atlas?.efficiency ?? 0) * 100).toFixed(1)}%</span>
              </div>
              <button onClick={() => setZoom((z) => Math.max(0.2, z - 0.2))} className="btn-tool">
                <ZoomOut className="w-4 h-4" />
              </button>
              <div className="font-mono text-[10px] text-mist-300 w-10 text-center">{(zoom * 100).toFixed(0)}%</div>
              <button onClick={() => setZoom((z) => Math.min(4, z + 0.2))} className="btn-tool">
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div
            className="flex-1 overflow-auto rounded-xl bg-ink-900 p-6 flex items-center justify-center"
            style={{
              backgroundImage:
                "linear-gradient(rgba(154,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(154,163,184,0.08) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          >
            {atlas ? (
              <div
                className="relative bg-ink-50 shadow-2xl rounded-md"
                style={{
                  width: atlas.width * zoom,
                  height: atlas.height * zoom,
                  backgroundImage: `url(${atlas.pngDataUrl})`,
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                  imageRendering: zoom > 2 ? "pixelated" : "auto",
                }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const px = (e.clientX - rect.left) / zoom;
                  const py = (e.clientY - rect.top) / zoom;
                  const hit = atlas.slots.find(
                    (s) => px >= s.x && px <= s.x + s.width && py >= s.y && py <= s.y + s.height
                  );
                  if (hit) setSelectedSlot(hit.layerId);
                }}
              >
                {atlas.slots.map((s) => (
                  <div
                    key={s.layerId}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSlot(s.layerId);
                    }}
                    className={cn(
                      "absolute border-2 transition-colors cursor-pointer",
                      selectedSlot === s.layerId ? "border-sakura-400" : "border-sakura-400/30 hover:border-sakura-300"
                    )}
                    style={{
                      left: s.x * zoom,
                      top: s.y * zoom,
                      width: s.width * zoom,
                      height: s.height * zoom,
                    }}
                  >
                    {selectedSlot === s.layerId && (
                      <div className="absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[10px] font-mono bg-sakura-400 text-ink-900 whitespace-nowrap">
                        {project.layers.find((l) => l.id === s.layerId)?.name ?? s.layerId}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-mist-300 text-sm">{busy ? "打包中..." : "等待生成 atlas"}</div>
            )}
          </div>
        </div>

        {/* 右侧：导出与详情 */}
        <div className="flex flex-col gap-3 min-h-0">
          <div className="panel p-3 flex flex-col gap-2">
            <div className="text-display text-mist-50">导出</div>
            <button onClick={handleDownloadAtlas} disabled={!atlas} className="btn-primary text-sm justify-center">
              <Download className="w-4 h-4" /> 下载 atlas.png
            </button>
            <button onClick={handleDownloadJson} disabled={!atlas} className="btn-ghost text-sm justify-center">
              <Download className="w-4 h-4" /> 下载 atlas.json (UV)
            </button>
            <div className="text-[10px] font-mono text-mist-300 leading-relaxed mt-1">
              JSON 包含每图层在 atlas 上的像素区域和归一化 UV 坐标，可被 Three.js / PixiJS / Live2D 直接消费。
            </div>
          </div>

          <div className="panel p-3 flex flex-col gap-2 flex-1 min-h-0">
            <div className="text-display text-mist-50">slot 详情</div>
            {selectedSlotData && selectedLayer ? (
              <div className="flex flex-col gap-2 text-xs font-mono text-mist-100">
                <div className="flex flex-col gap-1">
                  <span className="label-cap">name</span>
                  <div className="text-mist-50">{selectedLayer.name}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="label-cap">pixel</span>
                    <div className="text-sakura-300">
                      {selectedSlotData.x}, {selectedSlotData.y}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="label-cap">size</span>
                    <div className="text-butter-300">
                      {selectedSlotData.width} × {selectedSlotData.height}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="label-cap">uv (0~1)</span>
                  <div className="text-mist-200 text-[11px] leading-relaxed">
                    u0: {selectedSlotData.u0.toFixed(4)}
                    <br />
                    v0: {selectedSlotData.v0.toFixed(4)}
                    <br />
                    u1: {selectedSlotData.u1.toFixed(4)}
                    <br />
                    v1: {selectedSlotData.v1.toFixed(4)}
                  </div>
                </div>
                <div className="mt-1">
                  <div className="label-cap mb-1">preview</div>
                  <div
                    className="rounded-lg border border-mist-100/10 bg-ink-900"
                    style={{
                      backgroundImage: `url(${project.atlas?.pngDataUrl})`,
                      backgroundSize: `${project.atlas?.width}px ${project.atlas?.height}px`,
                      backgroundPosition: `-${selectedSlotData.x}px -${selectedSlotData.y}px`,
                      backgroundRepeat: "no-repeat",
                      width: "100%",
                      height: "100px",
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-mist-300 text-xs py-2">点击 atlas 中的格子查看详情</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
