import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileJson, FileImage, FileVideo, Box, Download, Check } from "lucide-react";
import { useProjectStore } from "@/store/projectStore";
import { exportProjectJson, exportMocLikeJson, exportSvg, exportWebM } from "@/engine/exporter";
import { cn } from "@/lib/utils";

type Format = "moc3" | "json" | "svg" | "webm";

const FORMATS: { id: Format; name: string; desc: string; icon: any; gradient: string; ext: string }[] = [
  {
    id: "moc3",
    name: "moc3 · Live2D",
    desc: "导出 moc3-like 描述，附 PNG 图层与关键帧",
    icon: Box,
    gradient: "from-sakura-400 to-butter-400",
    ext: "moc3.json",
  },
  {
    id: "json",
    name: "JSON 项目",
    desc: "完整项目结构，可重新导入 Mochi Live",
    icon: FileJson,
    gradient: "from-butter-400 to-leaf",
    ext: "mochi.json",
  },
  {
    id: "svg",
    name: "原始 SVG",
    desc: "导出所有形状的矢量源文件",
    icon: FileImage,
    gradient: "from-sky to-sakura-400",
    ext: "svg",
  },
  {
    id: "webm",
    name: "WebM 视频",
    desc: "录制当前动画为视频（5 秒）",
    icon: FileVideo,
    gradient: "from-leaf to-sakura-400",
    ext: "webm",
  },
];

export default function Export() {
  const project = useProjectStore((s) => s.project);
  const navigate = useNavigate();
  const [format, setFormat] = useState<Format>("moc3");
  const [author, setAuthor] = useState("Mochi Live");
  const [fps, setFps] = useState(30);
  const [duration, setDuration] = useState(5);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<Format | null>(null);

  const handleExport = async () => {
    setBusy(true);
    setDone(null);
    try {
      const filename = `${project.name || "project"}_${author}`;
      if (format === "moc3") exportMocLikeJson(project);
      else if (format === "json") exportProjectJson(project);
      else if (format === "svg") exportSvg(project);
      else if (format === "webm") {
        // 使用实时 canvas 录制
        const c = document.createElement("canvas");
        c.width = project.canvasWidth;
        c.height = project.canvasHeight;
        const ctx = c.getContext("2d")!;
        // 简单渲染：把图层依次画上去（不含动画）
        const imgs = await Promise.all(
          project.layers.map(
            (l) =>
              new Promise<HTMLImageElement>((resolve) => {
                const im = new Image();
                im.onload = () => resolve(im);
                im.src = l.pngDataUrl;
              })
          )
        );
        // 录制若干帧
        const draw = () => {
          ctx.clearRect(0, 0, c.width, c.height);
          project.layers.forEach((l, i) => {
            ctx.drawImage(imgs[i], l.offsetX, l.offsetY, l.width, l.height);
          });
        };
        let frame = 0;
        const total = duration * fps;
        const drawFrame = () => {
          draw();
          frame++;
          if (frame < total) requestAnimationFrame(drawFrame);
        };
        await exportWebM(c, duration, fps, `${filename}.webm`);
      }
      setDone(format);
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 px-4 py-3 gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="label-cap">05 · EXPORT</span>
          <span className="text-mist-200 text-sm">/</span>
          <span className="text-display text-mist-50">导出 · 多格式</span>
        </div>
        <button onClick={() => navigate("/animate")} className="btn-ghost">
          <ArrowLeft className="w-4 h-4" /> 上一步
        </button>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {FORMATS.map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                onClick={() => setFormat(f.id)}
                className={cn(
                  "panel p-5 text-left relative overflow-hidden transition-all",
                  format === f.id ? "ring-2 ring-sakura-400 -translate-y-0.5" : "hover:-translate-y-0.5"
                )}
              >
                <div className={cn("absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br opacity-25 blur-2xl", f.gradient)} />
                <div className="relative flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br text-ink-900", f.gradient)}>
                      <Icon className="w-6 h-6" strokeWidth={2.2} />
                    </div>
                    {format === f.id && <Check className="w-5 h-5 text-sakura-400" />}
                  </div>
                  <div>
                    <div className="text-display text-xl text-mist-50">{f.name}</div>
                    <div className="text-xs text-mist-200 mt-1 leading-relaxed">{f.desc}</div>
                  </div>
                  <div className="text-[10px] font-mono text-mist-300">.{(f as any).ext}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="panel p-5 flex flex-col gap-4">
          <div className="text-display text-mist-50">导出设置</div>
          <div className="flex flex-col gap-1">
            <span className="label-cap">文件名</span>
            <input
              value={project.name}
              onChange={(e) => useProjectStore.getState().setProjectName(e.target.value)}
              className="input"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="label-cap">作者</span>
            <input value={author} onChange={(e) => setAuthor(e.target.value)} className="input" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <span className="label-cap">FPS</span>
              <input type="number" value={fps} onChange={(e) => setFps(parseInt(e.target.value))} className="input" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="label-cap">时长 (秒)</span>
              <input type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} className="input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-mist-100/5">
            <div className="text-xs text-mist-200">图层</div>
            <div className="text-xs text-mist-50 text-right font-mono">{project.layers.length}</div>
            <div className="text-xs text-mist-200">节点</div>
            <div className="text-xs text-mist-50 text-right font-mono">{project.nodes.length}</div>
            <div className="text-xs text-mist-200">动画</div>
            <div className="text-xs text-mist-50 text-right font-mono">{project.animations.length}</div>
            <div className="text-xs text-mist-200">总关键帧</div>
            <div className="text-xs text-mist-50 text-right font-mono">
              {project.animations.reduce((acc, a) => acc + a.keyframes.length, 0)}
            </div>
          </div>
          <button onClick={handleExport} disabled={busy} className="btn-primary text-base justify-center">
            <Download className="w-4 h-4" />
            {busy ? "导出中..." : done === format ? "已下载 ✓ 再次导出" : "立即导出"}
          </button>
          {done && (
            <div className="chip text-leaf justify-center">
              <Check className="w-3 h-3" /> 已下载 {format.toUpperCase()} 文件
            </div>
          )}
          <div className="text-[10px] font-mono text-mist-300 mt-2 leading-relaxed">
            * 视频格式通过 Canvas 录制完成；moc3 输出为教学简化版（非官方 Cubism 兼容），包含 Mesh 节点、关键帧与图层引用。
          </div>
        </div>
      </div>
    </div>
  );
}
