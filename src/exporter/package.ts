import { buildExportHtml } from "./template";
import { fileToDataURL, loadVideoFile } from "@/engine/video";
import type { Project } from "@/types";

export type ExportOptions = {
  inlineVideo: boolean;
  fileName?: string;
};

export async function exportProjectToHtml(
  project: Project,
  videoFile: File | null,
  opts: ExportOptions
): Promise<{ html: string; fileName: string; sizeKb: number }> {
  let videoDataUrl = "";
  let videoMime = "video/mp4";
  if (opts.inlineVideo) {
    if (videoFile) {
      videoDataUrl = await fileToDataURL(videoFile);
      videoMime = videoFile.type || "video/mp4";
    } else if (project.video.src.startsWith("data:")) {
      videoDataUrl = project.video.src;
      videoMime = project.video.mime || "video/mp4";
    } else {
      // 重新加载 objectURL 不行（blob: URL 仅在当前会话有效）
      throw new Error("缺少视频文件，请重新选择视频。");
    }
  } else {
    // 不内联：使用占位 dataURL 标记，导出后会附带视频文件链接
    // 实际我们仍然使用 videoFile 的 dataURL，但给一个下载 zip 的 fallback
    if (videoFile) {
      videoDataUrl = await fileToDataURL(videoFile);
      videoMime = videoFile.type || "video/mp4";
    } else if (project.video.src.startsWith("data:")) {
      videoDataUrl = project.video.src;
      videoMime = project.video.mime || "video/mp4";
    } else {
      throw new Error("请先选择视频文件。");
    }
  }

  const html = buildExportHtml({
    project,
    videoDataUrl,
    videoMime,
  });
  const sizeKb = Math.round(html.length / 1024);
  const safeName = (opts.fileName || project.name || "rigreel-export")
    .replace(/[\\/:*?"<>|]/g, "_");
  return { html, fileName: `${safeName}.html`, sizeKb };
}

export function downloadHtml(html: string, fileName: string) {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export { loadVideoFile };
