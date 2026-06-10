import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, RefreshCw, Eye, EyeOff, Download, Layers as LayersIcon, Scissors } from "lucide-react";
import { useProjectStore } from "@/store/projectStore";
import { splitIntoLayers } from "@/engine/layer/splitter";
import { splitPixelIntoLayers } from "@/engine/layer/pixelSplitter";
import { projectToSvg } from "@/engine/svg/svg";
import { downloadBlob } from "@/engine/exporter";
import { PixelPreviewImage } from "@/components/canvas/PixelPreviewImage";
import { cn } from "@/lib/utils";

export default function Layers() {
  const project = useProjectStore((s) => s.project);
  const setLayers = useProjectStore((s) => s.setLayers);
  const updateLayer = useProjectStore((s) => s.updateLayer);
  const navigate = useNavigate();

  const [splitting, setSplitting] = useState(false);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleSplit = async () => {
    setSplitting(true);
    try {
      const layers =
        project.sourceMode === "pixel"
          ? await splitPixelIntoLayers(project)
          : await splitIntoLayers(project);
      setLayers(layers);
      if (layers[0]) setSelectedLayerId(layers[0].id);
    } finally {
      setSplitting(false);
    }
  };

  // 自动运行一次如果已有形状/像素
  useEffect(() => {
    if (project.layers.length === 0) {
      if (project.sourceMode === "svg" && project.groups.length > 0) {
        handleSplit();
      } else if (project.sourceMode === "pixel" && project.pixel) {
        // 像素模式：只要有像素就切
        const hasPx = project.pixel.data.some((c) => c !== 0);
        if (hasPx) handleSplit();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id]);

  const fullSvg = projectToSvg(project);

  const handleDownload = (id: string) => {
    const layer = project.layers.find((l) => l.id === id);
    if (!layer) return;
    fetch(layer.pngDataUrl).then((r) => r.blob()).then((b) => downloadBlob(b, `${layer.name}.png`));
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 px-4 py-3 gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="label-cap">02 · SPLIT</span>
          <span className="text-mist-200 text-sm">/</span>
          <span className="text-display text-mist-50">转格式 · 分图层</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/draw")} className="btn-ghost">
            <ArrowLeft className="w-4 h-4" /> 上一步
          </button>
          <button onClick={handleSplit} disabled={splitting} className="btn-butter">
            <RefreshCw className={cn("w-4 h-4", splitting && "animate-spin")} />
            {splitting ? "分层中..." : "重新分层"}
          </button>
          <button
            onClick={() => navigate("/mesh")}
            disabled={project.layers.length === 0}
            className="btn-primary"
          >
            下一步：生成网格 <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-[22rem_1fr] gap-3">
        {/* Layer List */}
        <div className="panel p-3 flex flex-col gap-2 min-h-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LayersIcon className="w-4 h-4 text-butter-400" />
              <span className="text-display text-mist-50">图层列表</span>
            </div>
            <span className="chip">{project.layers.length}</span>
          </div>
          {project.layers.length === 0 && (
            <div className="text-center text-mist-300 text-xs py-8 px-3">
              {splitting
                ? "正在将 SVG 转格式并按分组切分..."
                : "没有可分层的 SVG。回到绘制页面画一些形状或加载模板。"}
            </div>
          )}
          <div className="flex-1 overflow-y-auto flex flex-col gap-1.5">
            {project.layers.map((l, i) => (
              <button
                key={l.id}
                onClick={() => setSelectedLayerId(l.id)}
                className={cn(
                  "panel-solid p-2 text-left flex items-center gap-2 transition-all",
                  selectedLayerId === l.id ? "ring-1 ring-sakura-400" : "hover:ring-1 hover:ring-sakura-400/40"
                )}
              >
                <div className="w-12 h-16 rounded-md bg-ink-800 border border-mist-100/5 overflow-hidden flex items-center justify-center">
                  <img src={l.pngDataUrl} className="max-w-full max-h-full" alt="" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-display text-mist-50 truncate">{l.name}</div>
                  <div className="text-[10px] font-mono text-mist-300 mt-0.5">
                    {l.width} × {l.height}
                  </div>
                  <div className="flex items-center gap-1 mt-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateLayer(l.id, { visible: !l.visible });
                      }}
                      className="w-5 h-5 flex items-center justify-center text-mist-300 hover:text-mist-50"
                    >
                      {l.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(l.id);
                      }}
                      className="w-5 h-5 flex items-center justify-center text-mist-300 hover:text-butter-300"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                    <div className="flex-1" />
                    <div className="font-mono text-[10px] text-sakura-300">#{i.toString().padStart(2, "0")}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="grid grid-cols-2 gap-3 min-h-0">
          <div className="panel p-3 flex flex-col gap-2 min-h-0">
            <div className="flex items-center justify-between">
              <div className="text-display text-mist-50">
                {project.sourceMode === "pixel" ? "原始像素" : "原始 SVG"}
              </div>
              <span className="chip">{project.sourceMode === "pixel" ? "pixel" : "vector"}</span>
            </div>
            <div className="flex-1 rounded-xl bg-grid-light bg-ink-900 overflow-hidden flex items-center justify-center p-4" style={{ backgroundSize: "16px 16px" }}>
              {project.sourceMode === "pixel" ? (
                <div
                  className="bg-ink-50 shadow-2xl"
                  style={{ filter: "drop-shadow(0 6px 18px rgba(7,10,20,0.5))" }}
                >
                  <PixelPreviewImage
                    pixel={project.pixel}
                    className="block"
                  />
                </div>
              ) : (
                <div
                  className="max-w-full max-h-full"
                  style={{ filter: "drop-shadow(0 6px 18px rgba(7,10,20,0.5))" }}
                  dangerouslySetInnerHTML={{ __html: fullSvg }}
                />
              )}
            </div>
            <div className="text-[10px] font-mono text-mist-300 flex justify-between">
              {project.sourceMode === "pixel" ? (
                <>
                  <span>palette: {project.pixel?.palette.filter((c) => c !== "#00000000").length ?? 0}</span>
                  <span>size: {project.pixel?.width ?? 0}×{project.pixel?.height ?? 0}</span>
                  <span>px: {project.pixel?.data.filter((c) => c !== 0).length ?? 0}</span>
                </>
              ) : (
                <>
                  <span>groups: {project.groups.length}</span>
                  <span>shapes: {project.shapes.length}</span>
                  <span>{project.canvasWidth} × {project.canvasHeight}</span>
                </>
              )}
            </div>
          </div>

          <div className="panel p-3 flex flex-col gap-2 min-h-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-sakura-400" />
                <div className="text-display text-mist-50">分图预览</div>
              </div>
              <span className="chip text-sakura-300">PNG · 透明</span>
            </div>
            <div ref={canvasRef} className="flex-1 rounded-xl bg-grid-light bg-ink-900 overflow-auto p-4" style={{ backgroundSize: "16px 16px" }}>
              {project.layers.length === 0 ? (
                <div className="h-full flex items-center justify-center text-mist-300 text-sm">
                  还没有图层，点击"重新分层"
                </div>
              ) : (
                <div className="space-y-3">
                  {project.layers
                    .filter((l) => l.visible)
                    .map((l) => (
                      <div
                        key={l.id}
                        className={cn(
                          "relative rounded-lg p-2 border",
                          selectedLayerId === l.id ? "border-sakura-400 bg-sakura-400/5" : "border-mist-100/5 bg-ink-800/40"
                        )}
                      >
                        <div className="absolute -top-2 left-3 px-1.5 py-0.5 rounded text-[10px] font-mono bg-ink-700 text-mist-100">
                          {l.name} · {l.width}×{l.height}
                        </div>
                        <div className="flex items-center justify-center min-h-[80px]">
                          <img src={l.pngDataUrl} className="max-h-40" alt={l.name} />
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="panel p-3 flex items-center gap-4 text-xs font-mono text-mist-300">
        <span>说明：</span>
        <span>每个 SVG <code className="text-sakura-300">&lt;g&gt;</code> 分组会作为独立图层导出为 PNG；</span>
        <span>通过裁剪到非透明包围盒，最大化保留有效像素。</span>
      </div>
    </div>
  );
}
