import type { Bead, Joint } from "@/types";

export interface RenderOptions {
  cellSize: number;
  palette: string[];
  showGrid: boolean;
  showHalfDivider: boolean;
  gridSize: number;
  // 关节偏移（用于动画）：jointId -> {dx, dy}
  jointOffsets?: Record<string, { dx: number; dy: number }>;
  // 骨架影响：bead 受哪些 joint 影响
  beadInfluences?: Map<string, { joint: string; weight: number }[]>;
}

// 计算单颗豆在动画中的实际位置（受骨架影响）
export function getBeadPosition(
  bead: Bead,
  opts: RenderOptions,
): { x: number; y: number } {
  const key = `${bead.x},${bead.y}`;
  const influences = opts.beadInfluences?.get(key);
  if (!influences || influences.length === 0 || !opts.jointOffsets) {
    return { x: bead.x, y: bead.y };
  }
  let dx = 0;
  let dy = 0;
  for (const inf of influences) {
    const off = opts.jointOffsets[inf.joint];
    if (off) {
      dx += off.dx * inf.weight;
      dy += off.dy * inf.weight;
    }
  }
  return { x: bead.x + dx, y: bead.y + dy };
}

// 渲染拼豆网格到 canvas
export function renderBeads(
  ctx: CanvasRenderingContext2D,
  beads: Bead[],
  opts: RenderOptions,
) {
  const { cellSize, palette, showGrid, gridSize, showHalfDivider } = opts;
  const size = gridSize * cellSize;

  // 背景
  ctx.fillStyle = "#0f0f14";
  ctx.fillRect(0, 0, size, size);

  // 网格线
  if (showGrid) {
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
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
  }

  // 半面分隔线
  if (showHalfDivider) {
    const mid = Math.floor(gridSize / 2) * cellSize;
    ctx.strokeStyle = "rgba(255,210,63,0.4)";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(mid, 0);
    ctx.lineTo(mid, size);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // 拼豆
  for (const bead of beads) {
    const pos = getBeadPosition(bead, opts);
    const px = pos.x * cellSize;
    const py = pos.y * cellSize;
    const color = palette[bead.color] ?? "#f4f1de";
    drawBead(ctx, px, py, cellSize, color);
  }
}

// 绘制单颗立体拼豆
export function drawBead(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  cellSize: number,
  color: string,
) {
  const pad = Math.max(1, cellSize * 0.08);
  const r = (cellSize - pad * 2) / 2;
  const cx = px + cellSize / 2;
  const cy = py + cellSize / 2;

  // 阴影
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath();
  ctx.arc(cx + 1, cy + 2, r, 0, Math.PI * 2);
  ctx.fill();

  // 主体
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // 高光
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.beginPath();
  ctx.arc(cx - r * 0.35, cy - r * 0.35, r * 0.3, 0, Math.PI * 2);
  ctx.fill();
}

// 渲染骨架叠加层
export function renderSkeleton(
  ctx: CanvasRenderingContext2D,
  joints: Joint[],
  bones: Array<{ from: string; to: string; influence: number }>,
  cellSize: number,
  selectedJointId: string | null,
  poseOffsets?: Record<string, { x: number; y: number }>,
) {
  // 骨骼连线
  for (const bone of bones) {
    const from = joints.find((j) => j.id === bone.from);
    const to = joints.find((j) => j.id === bone.to);
    if (!from || !to) continue;
    const fx = (poseOffsets?.[from.id]?.x ?? from.x) * cellSize + cellSize / 2;
    const fy = (poseOffsets?.[from.id]?.y ?? from.y) * cellSize + cellSize / 2;
    const tx = (poseOffsets?.[to.id]?.x ?? to.x) * cellSize + cellSize / 2;
    const ty = (poseOffsets?.[to.id]?.y ?? to.y) * cellSize + cellSize / 2;

    // 影响区域
    ctx.strokeStyle = `rgba(57,233,145,${0.15 + bone.influence * 0.3})`;
    ctx.lineWidth = cellSize * 0.6 * bone.influence;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.lineTo(tx, ty);
    ctx.stroke();

    // 骨头主线
    ctx.strokeStyle = "#ffd23f";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.lineTo(tx, ty);
    ctx.stroke();
  }

  // 关节点
  for (const joint of joints) {
    const jx =
      (poseOffsets?.[joint.id]?.x ?? joint.x) * cellSize + cellSize / 2;
    const jy =
      (poseOffsets?.[joint.id]?.y ?? joint.y) * cellSize + cellSize / 2;
    const isSelected = joint.id === selectedJointId;
    const r = isSelected ? cellSize * 0.45 : cellSize * 0.35;

    // 外圈光晕
    if (isSelected) {
      ctx.fillStyle = "rgba(57,233,145,0.3)";
      ctx.beginPath();
      ctx.arc(jx, jy, r * 1.6, 0, Math.PI * 2);
      ctx.fill();
    }

    // 主体
    ctx.fillStyle = isSelected ? "#39e991" : "#ff5e5b";
    ctx.beginPath();
    ctx.arc(jx, jy, r, 0, Math.PI * 2);
    ctx.fill();

    // 内圈
    ctx.fillStyle = "#1a1a1f";
    ctx.beginPath();
    ctx.arc(jx, jy, r * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 渲染蒙版热力图（每个 joint 的影响权重）
export function renderMaskHeatmap(
  ctx: CanvasRenderingContext2D,
  gridSize: number,
  cellSize: number,
  influences: Map<string, { joint: string; weight: number }[]>,
  jointColors: Record<string, string>,
) {
  const size = gridSize * cellSize;
  ctx.fillStyle = "#0f0f14";
  ctx.fillRect(0, 0, size, size);

  for (const [key, infs] of influences) {
    const [x, y] = key.split(",").map(Number);
    if (Number.isNaN(x) || Number.isNaN(y)) continue;
    // 取权重最高的 joint
    const top = [...infs].sort((a, b) => b.weight - a.weight)[0];
    if (!top) continue;
    const color = jointColors[top.joint] ?? "#39e991";
    ctx.globalAlpha = 0.3 + top.weight * 0.7;
    ctx.fillStyle = color;
    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  }
  ctx.globalAlpha = 1;

  // 网格
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
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
}
