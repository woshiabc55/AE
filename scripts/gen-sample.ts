// 生成一个示例导出 HTML（带内嵌的小型视频作为 dataURL 验证整链路）。
// 运行: pnpm tsx scripts/gen-sample.ts
import { buildExportHtml } from "../src/exporter/template";
import { writeFileSync, mkdirSync } from "fs";
import { DEFAULT_THEME } from "../src/types";
import type { Project } from "../src/types";

const project: Project = {
  id: "demo",
  name: "Demo · 角色绑定演示",
  video: { src: "", duration: 30, width: 1280, height: 720, fps: 30 },
  chapters: [
    { id: "c1", title: "整段", start: 0, end: 30, color: "#7CFFB2" },
    { id: "c2", title: "手臂 IK", start: 4, end: 14, color: "#FFC857" },
    { id: "c3", title: "面部 ARKit", start: 16, end: 26, color: "#FF5DA2" },
  ],
  annotations: [
    { id: "a1", kind: "bone", label: "L_Shoulder", x: 0.42, y: 0.36, t: 5.2, color: "#7CFFB2" },
    { id: "a2", kind: "bone", label: "L_Hand_IK", x: 0.36, y: 0.55, t: 7.8, color: "#7CFFB2" },
    { id: "a3", kind: "facial", control: "brow_l", x: 0.45, y: 0.22, t: 18.0 },
    { id: "a4", kind: "facial", control: "mouth_l", x: 0.51, y: 0.61, t: 22.4 },
    { id: "a5", kind: "facial", control: "jaw", x: 0.5, y: 0.68, t: 24.0 },
  ],
  theme: { ...DEFAULT_THEME, brand: "RigReel · Demo" },
  updatedAt: Date.now(),
};

// 极简占位 dataURL（8x8 黑帧），让 HTML 自包含能直接打开
const placeholder = "data:video/mp4;base64,";

const html = buildExportHtml({
  project,
  videoDataUrl: placeholder,
  videoMime: "video/mp4",
});

mkdirSync("public", { recursive: true });
writeFileSync("public/sample-export.html", html);
console.log("Wrote public/sample-export.html ·", (html.length / 1024).toFixed(1), "KB");
