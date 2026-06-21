import type { Joint, Bead } from "@/types";
import { computeBeadInfluences, jointColorPalette } from "./skeletonEngine";

export interface UnfoldedMask {
  // 每颗豆的展开信息
  cells: Array<{
    x: number;
    y: number;
    jointId: string;
    weight: number;
    color: string;
  }>;
  // 每个关节的统计
  jointStats: Array<{
    jointId: string;
    color: string;
    beadCount: number;
    avgWeight: number;
  }>;
}

// 展开蒙版：将骨架影响区域展开为 2D 热力图数据
export function unfoldMask(
  beads: Bead[],
  joints: Joint[],
): UnfoldedMask {
  const influences = computeBeadInfluences(beads, joints);
  const colors = jointColorPalette(joints.map((j) => j.id));

  const cells: UnfoldedMask["cells"] = [];
  const stats = new Map<string, { count: number; totalWeight: number }>();
  for (const j of joints) {
    stats.set(j.id, { count: 0, totalWeight: 0 });
  }

  for (const [key, infs] of influences) {
    const [x, y] = key.split(",").map(Number);
    if (Number.isNaN(x) || Number.isNaN(y)) continue;
    // 取权重最高的关节
    const top = [...infs].sort((a, b) => b.weight - a.weight)[0];
    if (!top) continue;
    cells.push({
      x,
      y,
      jointId: top.joint,
      weight: top.weight,
      color: colors[top.joint] ?? "#39e991",
    });
    const s = stats.get(top.joint);
    if (s) {
      s.count += 1;
      s.totalWeight += top.weight;
    }
  }

  const jointStats = joints.map((j) => {
    const s = stats.get(j.id) ?? { count: 0, totalWeight: 0 };
    return {
      jointId: j.id,
      color: colors[j.id] ?? "#39e991",
      beadCount: s.count,
      avgWeight: s.count > 0 ? s.totalWeight / s.count : 0,
    };
  });

  return { cells, jointStats };
}

// 将蒙版数据渲染到 canvas
export function renderUnfoldedMask(
  ctx: CanvasRenderingContext2D,
  mask: UnfoldedMask,
  cellSize: number,
  gridSize: number,
) {
  const size = gridSize * cellSize;
  ctx.fillStyle = "#0f0f14";
  ctx.fillRect(0, 0, size, size);

  // 渲染每个 cell
  for (const cell of mask.cells) {
    ctx.globalAlpha = 0.3 + cell.weight * 0.7;
    ctx.fillStyle = cell.color;
    ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
  }
  ctx.globalAlpha = 1;

  // 网格
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= gridSize; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(size, i * cellSize);
    ctx.stroke();
  }

  // 关节标注
  ctx.font = `${Math.max(8, cellSize * 0.5)}px "JetBrains Mono", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  // 这里不画关节点，由调用方叠加
}
