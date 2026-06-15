import type { Project } from "@/types";
import { RUNTIME_JS } from "./runtime";

export const RUNTIME_CSS = `
:root {
  --rr-primary: #7CFFB2;
  --rr-accent: #FF5DA2;
  --rr-bg: #0B0D10;
  --rr-panel: #14171C;
  --rr-panel2: #1A1E25;
  --rr-line: #252A33;
  --rr-fg: #E6E9EF;
  --rr-mute: #8B93A7;
  --rr-dim: #5B6478;
}
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; height: 100%; background: var(--rr-bg); color: var(--rr-fg); font-family: "Inter", system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
body::before { content:""; position: fixed; inset: 0; pointer-events: none; background-image: linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px); background-size: 28px 28px; mask-image: radial-gradient(circle at 50% 30%, #000 0%, transparent 75%); }
#rr-root { position: relative; z-index: 1; min-height: 100%; display: flex; flex-direction: column; }
.rr-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 28px; border-bottom: 1px solid var(--rr-line); background: rgba(11,13,16,0.7); backdrop-filter: blur(8px); }
.rr-brand { display: flex; align-items: center; gap: 10px; }
.rr-logo { width: 22px; height: 22px; border-radius: 4px; background: var(--rr-primary); position: relative; }
.rr-logo::after { content:""; position: absolute; inset: 5px; border: 1.5px solid var(--rr-bg); border-radius: 2px; }
.rr-title { font-weight: 700; font-size: 15px; letter-spacing: 0.02em; color: var(--rr-fg); }
.rr-project-title { font-size: 12px; color: var(--rr-mute); }
.rr-header-right { display: flex; gap: 8px; }
.rr-btn { display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 12px; font-size: 12px; font-weight: 500; border-radius: 4px; border: 1px solid var(--rr-line); background: var(--rr-panel); color: var(--rr-fg); cursor: pointer; transition: all 160ms ease; }
.rr-btn:hover { border-color: var(--rr-primary); color: var(--rr-primary); }
.rr-btn.active { background: var(--rr-primary); color: var(--rr-bg); border-color: var(--rr-primary); }

.rr-main { display: grid; grid-template-columns: 1fr 320px; gap: 20px; padding: 24px 28px; flex: 1; min-height: 0; }
.rr-stage { background: #000; border: 1px solid var(--rr-line); border-radius: 8px; overflow: hidden; position: relative; min-height: 380px; }
.rr-stage-inner { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
.rr-video { width: 100%; max-height: 100%; display: block; background: #000; }
.rr-ann-layer { position: absolute; inset: 0; pointer-events: none; }
.rr-ann { position: absolute; transform: translate(-50%, -50%); }
.rr-ann-tip { position: absolute; top: 26px; left: 50%; transform: translateX(-50%); padding: 4px 8px; background: rgba(11,13,16,0.85); color: var(--rr-fg); font-size: 11px; border: 1px solid var(--rr-line); border-radius: 4px; white-space: nowrap; }
.rr-bone-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--rr-primary); box-shadow: 0 0 0 4px rgba(124,255,178,0.18); margin-left: -5px; margin-top: -5px; }
.rr-ann-svg { position: absolute; inset: -50% -50% -50% -50%; width: 200%; height: 200%; pointer-events: none; }

.rr-side { display: flex; flex-direction: column; gap: 16px; overflow: auto; }
.rr-block { background: var(--rr-panel); border: 1px solid var(--rr-line); border-radius: 6px; padding: 14px; }
.rr-block-title { font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--rr-dim); font-weight: 700; margin-bottom: 10px; }
.rr-chapter-list, .rr-ann-list { display: flex; flex-direction: column; gap: 6px; }
.rr-ch-row, .rr-ann-row { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 4px; background: var(--rr-panel2); border: 1px solid var(--rr-line); cursor: pointer; transition: border-color 160ms ease; }
.rr-ch-row:hover, .rr-ann-row:hover { border-color: var(--rr-primary); }
.rr-ch-dot, .rr-ann-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.rr-ch-text { flex: 1; min-width: 0; }
.rr-ch-name { font-size: 12px; color: var(--rr-fg); font-weight: 500; }
.rr-ch-time { font-size: 10px; color: var(--rr-mute); font-family: "JetBrains Mono", monospace; }

.rr-timeline { position: relative; height: 56px; margin: 0 28px; background: var(--rr-panel); border: 1px solid var(--rr-line); border-radius: 6px; overflow: hidden; cursor: pointer; }
.rr-ruler { position: absolute; top: 0; left: 0; right: 0; height: 18px; border-bottom: 1px solid var(--rr-line); }
.rr-tick { position: absolute; top: 0; height: 6px; border-left: 1px solid var(--rr-line); }
.rr-tick-label { position: absolute; top: 0; left: 4px; font-size: 9px; color: var(--rr-dim); font-family: "JetBrains Mono", monospace; white-space: nowrap; }
.rr-track { position: absolute; top: 18px; left: 0; right: 0; bottom: 0; }
.rr-ch-bar { position: absolute; top: 6px; bottom: 6px; border-radius: 3px; opacity: 0.85; overflow: hidden; cursor: pointer; }
.rr-ch-bar-label { position: absolute; top: 50%; left: 8px; transform: translateY(-50%); font-size: 10px; color: var(--rr-bg); font-weight: 700; text-shadow: 0 1px 0 rgba(255,255,255,0.2); white-space: nowrap; pointer-events: none; }
.rr-playhead { position: absolute; top: 0; bottom: 0; width: 2px; background: var(--rr-primary); box-shadow: 0 0 12px var(--rr-primary); pointer-events: auto; cursor: ew-resize; }

.rr-controls { display: flex; align-items: center; gap: 16px; padding: 14px 28px; border-top: 1px solid var(--rr-line); background: rgba(11,13,16,0.7); }
.rr-play { width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--rr-primary); background: transparent; color: var(--rr-primary); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; }
.rr-play:hover { background: var(--rr-primary); color: var(--rr-bg); }
.rr-time { font-family: "JetBrains Mono", monospace; font-size: 12px; color: var(--rr-mute); }
.rr-speed { background: var(--rr-panel); color: var(--rr-fg); border: 1px solid var(--rr-line); border-radius: 4px; padding: 4px 8px; font-size: 12px; margin-left: auto; }

.rr-watermark { position: fixed; bottom: 14px; right: 18px; font-size: 10px; color: var(--rr-dim); letter-spacing: 0.1em; text-transform: uppercase; pointer-events: none; }

@media (max-width: 1024px) {
  .rr-main { grid-template-columns: 1fr; }
  .rr-side { order: 2; }
}
`;

export function buildExportHtml(opts: {
  project: Project;
  videoDataUrl: string;
  videoMime: string;
}): string {
  const { project, videoDataUrl, videoMime } = opts;
  const safeProject = {
    ...project,
    video: { ...project.video, src: "" },
  };
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${escapeHtml(project.name)} · RigReel</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
<style>
${RUNTIME_CSS}
</style>
</head>
<body>
<div id="rr-root"></div>
<script>
window.__RR_DATA__ = ${JSON.stringify({ project: safeProject, videoDataUrl, videoMime })};
</script>
<script>
${RUNTIME_JS}
</script>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
