/**
 * 像素源 → 图层切分引擎
 * 思路：每个调色板索引（颜色族）对应一个图层
 *   1. 对每个 palette index（>0），生成 alpha 蒙板
 *   2. 将蒙板栅格化为 PNG
 *   3. 计算包围盒
 *   4. 输出 Layer 数组
 */
import type { Layer, Project } from "@/types";
import { uid } from "@/store/projectStore";
import { guessNodeName } from "@/engine/layer/splitter";

const LAYER_NAME_MAP: Record<number, string> = {
  1: "line", // 描边
  2: "skin", // 皮肤
  3: "hair", // 头发
  4: "accent", // 点缀黄
  5: "leaf",
  6: "eye",
  7: "flame",
  8: "purple",
  9: "white",
  10: "blush",
  11: "shadow",
};

export const splitPixelIntoLayers = async (project: Project): Promise<Layer[]> => {
  const { pixel } = project;
  if (!pixel) return [];

  const { width: W, height: H, palette, data } = pixel;
  const scale = 4; // 像素 ×4 输出，让蒙板更清晰
  const canvas = document.createElement("canvas");
  canvas.width = W * scale;
  canvas.height = H * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;

  // 收集所有出现过的 palette 索引
  const used = new Set<number>();
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== 0) used.add(data[i]);
  }

  const layers: Layer[] = [];
  let z = 0;
  for (const ci of Array.from(used).sort((a, b) => a - b)) {
    const color = palette[ci];
    if (!color) continue;

    // 绘制该颜色的 alpha 蒙板
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (data[y * W + x] === ci) {
          ctx.fillStyle = color;
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }
    }

    // 计算包围盒
    let minX = W, minY = H, maxX = -1, maxY = -1;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (data[y * W + x] === ci) {
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (maxX < 0) continue;

    const cellW = maxX - minX + 1;
    const cellH = maxY - minY + 1;

    // 裁剪到包围盒
    const out = document.createElement("canvas");
    out.width = cellW * scale;
    out.height = cellH * scale;
    const octx = out.getContext("2d")!;
    octx.imageSmoothingEnabled = false;
    octx.drawImage(canvas, minX * scale, minY * scale, cellW * scale, cellH * scale, 0, 0, cellW * scale, cellH * scale);

    // 估算该颜色的连通分量数（用于 bindNodeHint）
    const components = countComponents(data, W, H, ci);
    const defaultName = LAYER_NAME_MAP[ci] ?? `color_${ci}`;

    layers.push({
      id: uid(),
      name: ci === 1 ? `${defaultName} · 描边` : defaultName,
      pngDataUrl: out.toDataURL("image/png"),
      width: cellW,
      height: cellH,
      offsetX: minX,
      offsetY: minY,
      zIndex: z++,
      visible: true,
      sourceIds: [`pixel-${ci}`],
      bindNodeHint: guessNodeName(defaultName),
    });
    void components;
  }

  return layers;
};

const countComponents = (data: number[], W: number, H: number, ci: number) => {
  const visited = new Uint8Array(W * H);
  let count = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== ci || visited[i]) continue;
    count++;
    // 4 方向 flood fill
    const stack = [i];
    while (stack.length) {
      const j = stack.pop()!;
      if (visited[j]) continue;
      visited[j] = 1;
      const x = j % W;
      const y = Math.floor(j / W);
      if (x > 0 && data[j - 1] === ci && !visited[j - 1]) stack.push(j - 1);
      if (x < W - 1 && data[j + 1] === ci && !visited[j + 1]) stack.push(j + 1);
      if (y > 0 && data[j - W] === ci && !visited[j - W]) stack.push(j - W);
      if (y < H - 1 && data[j + W] === ci && !visited[j + W]) stack.push(j + W);
    }
  }
  return count;
};
