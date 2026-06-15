import { useState } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import { exportProjectToHtml, downloadHtml } from "@/exporter/package";
import { X, Download, Loader2, FileCode2, Check } from "lucide-react";

export default function ExportDialog() {
  const {
    showExportDialog,
    setShowExportDialog,
    project,
    isExporting,
    setIsExporting,
  } = useProjectStore();
  const [inlineVideo, setInlineVideo] = useState(true);
  const [fileName, setFileName] = useState(project.name);
  const [result, setResult] = useState<{
    html: string;
    fileName: string;
    sizeKb: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!showExportDialog) return null;

  const onExport = async () => {
    setIsExporting(true);
    setError(null);
    try {
      // 取出原始视频文件：必须从 input 重新选择
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "video/*";
      input.style.display = "none";
      document.body.appendChild(input);
      const videoFile: File | null = await new Promise((resolve) => {
        input.onchange = () => {
          resolve(input.files?.[0] || null);
          input.remove();
        };
        input.click();
      });

      if (!videoFile) {
        setIsExporting(false);
        return;
      }

      const r = await exportProjectToHtml(project, videoFile, {
        inlineVideo,
        fileName,
      });
      setResult(r);
    } catch (e: any) {
      setError(e?.message || "导出失败");
    } finally {
      setIsExporting(false);
    }
  };

  const onDownload = () => {
    if (!result) return;
    downloadHtml(result.html, result.fileName);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
      <div className="panel w-[860px] max-w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* 顶栏 */}
        <div className="flex items-center justify-between px-5 h-12 border-b border-line">
          <div className="flex items-center gap-2">
            <FileCode2 size={16} className="text-mint" />
            <h2 className="font-display font-semibold text-fg">导出 HTML</h2>
            <span className="chip">单文件</span>
          </div>
          <button
            className="btn btn-ghost h-7"
            onClick={() => setShowExportDialog(false)}
          >
            <X size={14} />
          </button>
        </div>

        {/* 主体 */}
        <div className="flex-1 grid grid-cols-[1fr_1fr] overflow-hidden">
          {/* 配置 */}
          <div className="p-5 border-r border-line overflow-y-auto">
            <div className="label-cap mb-3">CONFIGURATION</div>

            <div className="mb-4">
              <div className="text-xs text-mute mb-1.5">文件名</div>
              <div className="flex items-center gap-1.5">
                <input
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="input flex-1"
                />
                <span className="text-xs text-dim">.html</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-xs text-mute mb-1.5">视频处理</div>
              <label className="flex items-center gap-2 text-xs text-fg cursor-pointer">
                <input
                  type="checkbox"
                  checked={inlineVideo}
                  onChange={(e) => setInlineVideo(e.target.checked)}
                  className="accent-mint"
                />
                将视频以 base64 内联到 HTML（自包含，1 个文件即可部署）
              </label>
              <p className="text-[10px] text-dim mt-1.5 leading-relaxed">
                单文件版本：复制 / 上传到任何静态服务器或对象存储即可访问。
                若视频较大 (&gt; 200MB)，建议直接分发视频文件 + HTML。
              </p>
            </div>

            <div className="mb-4">
              <div className="text-xs text-mute mb-1.5">摘要</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="panel p-2">
                  <div className="text-dim">章节</div>
                  <div className="text-fg tabular text-base">
                    {project.chapters.length}
                  </div>
                </div>
                <div className="panel p-2">
                  <div className="text-dim">注释</div>
                  <div className="text-fg tabular text-base">
                    {project.annotations.length}
                  </div>
                </div>
                <div className="panel p-2">
                  <div className="text-dim">视频时长</div>
                  <div className="text-fg tabular text-base">
                    {project.video.duration.toFixed(1)}s
                  </div>
                </div>
                <div className="panel p-2">
                  <div className="text-dim">分辨率</div>
                  <div className="text-fg tabular text-base">
                    {project.video.width}×{project.video.height}
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="text-xs text-rose bg-rose/5 border border-rose/20 rounded p-2 mb-3">
                {error}
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={onExport}
                disabled={isExporting}
                className="btn btn-primary"
              >
                {isExporting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : result ? (
                  <Check size={14} />
                ) : (
                  <Download size={14} />
                )}
                {isExporting ? "正在打包…" : result ? "已准备好" : "生成 HTML"}
              </button>
              {result && (
                <button onClick={onDownload} className="btn">
                  <Download size={14} />
                  下载 {result.fileName}
                  <span className="text-dim ml-1">({result.sizeKb} KB)</span>
                </button>
              )}
            </div>
          </div>

          {/* 预览 */}
          <div className="p-5 bg-bg/40 overflow-hidden flex flex-col">
            <div className="label-cap mb-3">PREVIEW · 模拟最终效果</div>
            <div className="flex-1 panel overflow-hidden flex flex-col">
              {/* 模拟头部 */}
              <div className="flex items-center justify-between px-3 h-9 border-b border-line">
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-sm bg-mint" />
                  <span className="font-display font-bold text-xs text-fg">
                    {project.theme.brand}
                  </span>
                  <span className="text-[10px] text-mute">
                    · {project.name}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <div className="chip">对比模式</div>
                  <div className="chip">全屏</div>
                </div>
              </div>
              {/* 模拟主体 */}
              <div className="flex-1 p-2 grid grid-cols-[1fr_120px] gap-2 min-h-0">
                <div className="bg-black rounded border border-line relative flex items-center justify-center">
                  <div className="text-[10px] text-dim">
                    视频预览
                  </div>
                  <div
                    className="absolute top-1 left-1 chip"
                    style={{ borderColor: project.theme.primary, color: project.theme.primary }}
                  >
                    ▶ 0:00 / {project.video.duration.toFixed(0)}s
                  </div>
                  <div
                    className="absolute bottom-1 right-1 chip"
                    style={{ borderColor: project.theme.accent, color: project.theme.accent }}
                  >
                    注释 {project.annotations.length}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 overflow-hidden">
                  <div className="text-[9px] text-dim tracking-widest">
                    CHAPTERS
                  </div>
                  {project.chapters.slice(0, 4).map((c) => (
                    <div
                      key={c.id}
                      className="rounded border border-line bg-panel2 p-1.5"
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-sm"
                        style={{ background: c.color }}
                      />
                      <div className="text-[10px] text-fg truncate">
                        {c.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* 模拟时间轴 */}
              <div className="h-10 border-t border-line relative px-2 flex items-center">
                <div className="h-2 w-full bg-panel2 rounded">
                  {project.chapters.map((c) => (
                    <div
                      key={c.id}
                      className="absolute h-2 rounded"
                      style={{
                        left: `${(c.start / Math.max(0.001, project.video.duration)) * 100}%`,
                        width: `${((c.end - c.start) / Math.max(0.001, project.video.duration)) * 100}%`,
                        background: c.color,
                        opacity: 0.6,
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
