import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Undo2, Save, FolderOpen, Trash2, ZoomIn, ZoomOut } from "lucide-react";
import PixelCanvas from "@/components/canvas/PixelCanvas";
import PixelToolPanel from "@/components/panels/PixelToolPanel";
import { useProjectStore } from "@/store/projectStore";
import { PIXEL_SAMPLES } from "@/templates/pixelSamples";
import { cn } from "@/lib/utils";

export default function Draw() {
  const project = useProjectStore((s) => s.project);
  const undo = useProjectStore((s) => s.undo);
  const newBlank = useProjectStore((s) => s.newBlankProject);
  const setPixel = useProjectStore((s) => s.setPixel);
  const resizePixelCanvas = useProjectStore((s) => s.resizePixelCanvas);
  const setPixelZoom = useProjectStore((s) => s.setPixelZoom);
  const zoom = useProjectStore((s) => s.pixelZoom);
  const navigate = useNavigate();

  const [openSamples, setOpenSamples] = useState(false);

  const handleSave = () => {
    try {
      localStorage.setItem("mochi-project", JSON.stringify(project));
      // 简化提示
      const btn = document.getElementById("save-btn");
      if (btn) {
        const old = btn.textContent;
        btn.textContent = "已保存 ✓";
        setTimeout(() => {
          if (btn) btn.textContent = old;
        }, 1200);
      }
    } catch {}
  };

  const loadSample = (id: string) => {
    const s = PIXEL_SAMPLES.find((x) => x.id === id);
    if (!s) return;
    setPixel(s.build());
    setOpenSamples(false);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 px-4 py-3 gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="label-cap">01 · DRAW · 像素</span>
          <span className="text-mist-200 text-sm">/</span>
          <input
            value={project.name}
            onChange={(e) => useProjectStore.getState().setProjectName(e.target.value)}
            className="input w-64"
          />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={undo} className="btn-ghost" title="撤销 ⌘Z">
            <Undo2 className="w-4 h-4" />
          </button>
          <button onClick={handleSave} className="btn-ghost" id="save-btn">
            <Save className="w-4 h-4" /> 保存
          </button>
          <button onClick={() => setOpenSamples((v) => !v)} className="btn-ghost">
            <FolderOpen className="w-4 h-4" /> 示例
          </button>
          <button
            onClick={() => navigate("/layers")}
            className="btn-primary"
            disabled={!project.pixel || project.pixel.data.every((c) => c === 0)}
          >
            下一步：分层 <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {openSamples && (
        <div className="panel p-3 flex items-center gap-3">
          <span className="label-cap">加载示例</span>
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => {
                newBlank();
                setOpenSamples(false);
              }}
              className="btn-ghost text-sm"
            >
              <Trash2 className="w-4 h-4" /> 空白画布
            </button>
            {PIXEL_SAMPLES.map((s) => (
              <button key={s.id} onClick={() => loadSample(s.id)} className="btn-ghost text-sm">
                {s.emoji} {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 min-h-0 grid grid-cols-[auto_1fr_18rem] gap-3">
        <PixelToolPanel />
        <div className="min-h-0 relative">
          <PixelCanvas />
        </div>

        {/* 右侧：示例预览 + 画布设置 */}
        <div className="flex flex-col gap-3 min-h-0">
          <div className="panel p-3 flex flex-col gap-2">
            <div className="label-cap">示例</div>
            <div className="flex flex-col gap-2">
              {PIXEL_SAMPLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => loadSample(s.id)}
                  className="panel-solid p-2 text-left flex items-center gap-2 hover:ring-1 hover:ring-sakura-400/40"
                >
                  <div className="w-10 h-12 rounded bg-ink-800 border border-mist-100/10 overflow-hidden flex items-center justify-center">
                    <PixelPreview build={s.build} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-display text-mist-50">{s.emoji} {s.name}</div>
                    <div className="text-[10px] font-mono text-mist-300 truncate">{s.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="panel p-3 flex flex-col gap-2 text-xs font-mono text-mist-100">
            <div className="label-cap">画布</div>
            <div className="flex items-center gap-1">
              <span className="text-mist-300">W</span>
              <input
                type="number"
                value={project.pixel?.width ?? 64}
                onChange={(e) => {
                  const v = Math.max(8, Math.min(256, parseInt(e.target.value) || 64));
                  if (project.pixel) resizePixelCanvas(v, project.pixel.height);
                }}
                className="input w-16"
              />
              <span className="text-mist-300">H</span>
              <input
                type="number"
                value={project.pixel?.height ?? 96}
                onChange={(e) => {
                  const v = Math.max(8, Math.min(256, parseInt(e.target.value) || 96));
                  if (project.pixel) resizePixelCanvas(project.pixel.width, v);
                }}
                className="input w-16"
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-mist-300">缩放</span>
              <button onClick={() => setPixelZoom(zoom - 1)} className="btn-tool w-7 h-7">
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <div className="font-mono text-mist-50 text-xs w-8 text-center">{zoom}×</div>
              <button onClick={() => setPixelZoom(zoom + 1)} className="btn-tool w-7 h-7">
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="panel p-3 text-xs text-mist-200 leading-relaxed">
            <div className="text-display text-mist-50 mb-1">快捷键</div>
            <div className="font-mono text-[11px] space-y-0.5">
              <div><kbd className="chip">B</kbd> 铅笔 · <kbd className="chip">E</kbd> 橡皮</div>
              <div><kbd className="chip">G</kbd> 油漆桶 · <kbd className="chip">I</kbd> 吸管</div>
              <div><kbd className="chip">L</kbd> 直线 · <kbd className="chip">R</kbd> 矩形</div>
              <div><kbd className="chip">M</kbd> 水平镜像 · <kbd className="chip">⌘Z</kbd> 撤销</div>
            </div>
          </div>
        </div>
      </div>

      <div className="panel p-3 flex items-center gap-4 text-xs font-mono text-mist-300">
        <span>说明：</span>
        <span>绘制时支持水平镜像（中心虚线右侧自动对称），方便画对称角色。</span>
      </div>
    </div>
  );
}

function PixelPreview({ build }: { build: () => any }) {
  const canvas = usePixelPreview(build);
  return canvas ? (
    <canvas
      ref={(el) => {
        if (!el || !canvas) return;
        const ctx = el.getContext("2d")!;
        el.width = canvas.w;
        el.height = canvas.h;
        ctx.imageSmoothingEnabled = false;
        for (let y = 0; y < canvas.h; y++) {
          for (let x = 0; x < canvas.w; x++) {
            const ci = canvas.data[y * canvas.w + x];
            if (ci === 0) continue;
            ctx.fillStyle = canvas.palette[ci] ?? "transparent";
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }}
      className="w-10 h-12"
      style={{ imageRendering: "pixelated" }}
    />
  ) : null;
}

function usePixelPreview(build: () => any) {
  const result = (() => {
    try {
      const p = build();
      return { data: p.data, palette: p.palette, w: p.width, h: p.height };
    } catch {
      return null;
    }
  })();
  return result;
}

// 引用 cn 防止 lint 警告
void cn;
