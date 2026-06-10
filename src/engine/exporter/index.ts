/**
 * 导出引擎：JSON / ZIP / WebM
 * 1. JSON：项目结构 + 帧数据
 * 2. ZIP：所有图层 PNG + 元数据 + 网格 + 动画
 * 3. WebM：Canvas 录制
 */
import type { Project } from "@/types";
import { projectToSvg } from "@/engine/svg/svg";

/** 触发文件下载 */
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
    a.remove();
  }, 100);
};

export const exportProjectJson = (project: Project) => {
  const out = {
    format: "mochi-live.project",
    version: 1,
    project: {
      ...project,
      shapes: project.shapes,
    },
  };
  const blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
  downloadBlob(blob, `${project.name || "project"}.mochi.json`);
};

export const exportSvg = (project: Project) => {
  const svg = projectToSvg(project);
  const blob = new Blob([svg], { type: "image/svg+xml" });
  downloadBlob(blob, `${project.name || "project"}.svg`);
};

/**
 * 简易 moc3-like 描述（教学用）
 */
export const exportMocLikeJson = (project: Project) => {
  const moc = {
    Version: 3,
    FileReferences: {
      Moc: `${project.name}.moc3`,
      Textures: project.layers.map((l, i) => ({
        Name: l.name,
        File: `${i.toString().padStart(2, "0")}_${l.name}.png`,
      })),
    },
    Layout: {
      Width: project.canvasWidth,
      Height: project.canvasHeight,
    },
    MeshNode: project.nodes.map((n) => ({
      Id: n.id,
      Name: n.name,
      Parent: n.parentId,
      Position: { X: n.x * project.canvasWidth, Y: n.y * project.canvasHeight },
      Rotation: n.rotation,
      Scale: n.scale,
    })),
    Animation: project.animations.map((a) => ({
      Name: a.name,
      Duration: a.duration,
      Loop: a.loop,
      Keyframes: a.keyframes,
    })),
  };
  const blob = new Blob([JSON.stringify(moc, null, 2)], { type: "application/json" });
  downloadBlob(blob, `${project.name || "project"}.moc3.json`);
};

/** WebM 录制：通过 MediaRecorder 录制 canvas */
export const exportWebM = async (
  canvas: HTMLCanvasElement,
  duration: number,
  fps: number,
  filename: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const stream = canvas.captureStream(fps);
    const chunks: Blob[] = [];
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      downloadBlob(blob, filename);
      resolve();
    };
    recorder.onerror = reject;
    recorder.start();
    setTimeout(() => recorder.stop(), duration * 1000);
  });
};
