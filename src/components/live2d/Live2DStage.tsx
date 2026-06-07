import { useEffect, useRef } from 'react';
import type { Live2DPart, Live2DProjectData, Live2DParameter } from '@/types';
import { evalExpression, buildMeshPath } from '@/engine/live2d';
import { sampleKeyframes } from '@/engine/easing';

interface Props {
  data: Live2DProjectData;
  paramValues: Record<string, number>;
  showMesh?: boolean;
  width?: number;
  height?: number;
  className?: string;
  time?: number;
}

export default function Live2DStage({
  data,
  paramValues,
  showMesh = false,
  width,
  height,
  className,
  time = 0,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = width || data.canvas.width;
    const H = height || data.canvas.height;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    // 背景
    if (data.background.startsWith('radial-gradient')) {
      const grad = ctx.createRadialGradient(W / 2, H * 0.35, 20, W / 2, H / 2, Math.max(W, H) * 0.7);
      grad.addColorStop(0, '#1F1F2A');
      grad.addColorStop(1, '#0B0B12');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    } else {
      ctx.fillStyle = data.background;
      ctx.fillRect(0, 0, W, H);
    }

    // 排序按 z
    const sorted = [...data.parts].filter((p) => p.visible).sort((a, b) => a.z - b.z);

    sorted.forEach((p) => {
      const transformed = transformPart(p, data.parameters, paramValues, time);
      drawPart(ctx, p, transformed, showMesh, time);
    });
  }, [data, paramValues, showMesh, width, height, time]);

  return (
    <div className={className} style={{ width, height }}>
      <canvas ref={canvasRef} className="block rounded-2xl" />
    </div>
  );
}

interface TransformedPart {
  vertices: number[];
  fill: string;
  stroke: string;
  anchorX: number;
  anchorY: number;
}

function transformPart(
  part: Live2DPart,
  parameters: Live2DParameter[],
  values: Record<string, number>,
  time: number,
): TransformedPart {
  // 计算每帧各参数值(支持表达式)
  const resolved: Record<string, number> = {};
  for (const p of parameters) {
    if (p.expression) {
      resolved[p.id] = evalExpression(p.expression, { ...values, ...resolved }, parameters);
    } else {
      resolved[p.id] = values[p.id] ?? p.default;
    }
  }

  // 累积变换
  const totalRot = (resolved.par_angle_x ?? 0) * 0.4;
  const totalTrans = {
    x: (resolved.par_angle_y ?? 0) * 1.2 + (part.anchor.x - part.anchor.x),
    y: (resolved.par_angle_y ?? 0) * 0.2,
  };

  // 拷贝顶点
  const verts = [...part.vertices];
  // 应用绑定
  for (const b of part.bindings) {
    const v = resolved[b.parameterId] ?? 0;
    const w = b.weight;
    const rows = part.meshRows;
    const cols = part.meshCols;
    if (b.mode === 'translate') {
      for (let i = 0; i < verts.length; i += 2) {
        verts[i] += v * w;
        verts[i + 1] += 0; // 仅 x
      }
    } else if (b.mode === 'scale') {
      const sx = 1 + v * w * 0.5;
      const sy = 1 + v * w * 0.5;
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const idx = (r * (cols + 1) + c) * 2;
          const ox = part.vertices[idx] - part.anchor.x;
          const oy = part.vertices[idx + 1] - part.anchor.y;
          verts[idx] = part.anchor.x + ox * sx;
          verts[idx + 1] = part.anchor.y + oy * sy;
        }
      }
    } else if (b.mode === 'rotate') {
      for (let i = 0; i < verts.length; i += 2) {
        const ox = part.vertices[i] - part.anchor.x;
        const oy = part.vertices[i + 1] - part.anchor.y;
        const cs = Math.cos((v * w * Math.PI) / 180);
        const sn = Math.sin((v * w * Math.PI) / 180);
        verts[i] = part.anchor.x + ox * cs - oy * sn;
        verts[i + 1] = part.anchor.y + ox * sn + oy * cs;
      }
    }
  }

  // 全局旋转(头部/前发)
  if (Math.abs(totalRot) > 0.01) {
    for (let i = 0; i < verts.length; i += 2) {
      const ox = verts[i] - part.anchor.x;
      const oy = verts[i + 1] - part.anchor.y;
      const cs = Math.cos((totalRot * Math.PI) / 180);
      const sn = Math.sin((totalRot * Math.PI) / 180);
      verts[i] = part.anchor.x + ox * cs - oy * sn;
      verts[i + 1] = part.anchor.y + ox * sn + oy * cs;
    }
  }
  if (totalTrans.x !== 0 || totalTrans.y !== 0) {
    for (let i = 0; i < verts.length; i += 2) {
      verts[i] += totalTrans.x;
      verts[i + 1] += totalTrans.y;
    }
  }

  return { vertices: verts, fill: part.fill, stroke: part.stroke, anchorX: part.anchor.x, anchorY: part.anchor.y };
}

function drawPart(
  ctx: CanvasRenderingContext2D,
  part: Live2DPart,
  t: TransformedPart,
  showMesh: boolean,
  time: number,
) {
  // 我们使用 mesh 形变,绘制时根据 part 类型选择不同的「基础形状」
  // 简化:对于所有部件使用贝塞尔风格「身体块」,但根据 kind 调整宽高
  const rows = part.meshRows;
  const cols = part.meshCols;
  // 重新构建网格形变后的形状
  ctx.save();
  ctx.beginPath();
  // 上半弧
  for (let c = 0; c <= cols; c++) {
    const i = c * 2;
    if (c === 0) ctx.moveTo(t.vertices[i], t.vertices[i + 1]);
    else ctx.lineTo(t.vertices[i], t.vertices[i + 1]);
  }
  // 右半
  for (let r = 1; r <= rows; r++) {
    const i = (r * (cols + 1) + cols) * 2;
    ctx.lineTo(t.vertices[i], t.vertices[i + 1]);
  }
  // 下半
  for (let c = cols - 1; c >= 0; c--) {
    const i = (rows * (cols + 1) + c) * 2;
    ctx.lineTo(t.vertices[i], t.vertices[i + 1]);
  }
  // 左半
  for (let r = rows - 1; r >= 1; r--) {
    const i = r * 2;
    ctx.lineTo(t.vertices[i], t.vertices[i + 1]);
  }
  ctx.closePath();

  // 填充
  ctx.fillStyle = t.fill;
  ctx.globalAlpha = 1;
  ctx.fill();

  // 描边
  if (t.stroke && t.stroke !== 'none') {
    ctx.strokeStyle = t.stroke;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // 局部装饰
  if (part.kind === 'eye') {
    drawEye(ctx, t, part, time);
  }
  if (part.kind === 'mouth') {
    drawMouth(ctx, t, part, time);
  }

  if (showMesh) {
    ctx.strokeStyle = '#FF6A3D';
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.7;
    // 横线
    for (let r = 0; r <= rows; r++) {
      ctx.beginPath();
      for (let c = 0; c <= cols; c++) {
        const i = (r * (cols + 1) + c) * 2;
        if (c === 0) ctx.moveTo(t.vertices[i], t.vertices[i + 1]);
        else ctx.lineTo(t.vertices[i], t.vertices[i + 1]);
      }
      ctx.stroke();
    }
    // 竖线
    for (let c = 0; c <= cols; c++) {
      ctx.beginPath();
      for (let r = 0; r <= rows; r++) {
        const i = (r * (cols + 1) + c) * 2;
        if (r === 0) ctx.moveTo(t.vertices[i], t.vertices[i + 1]);
        else ctx.lineTo(t.vertices[i], t.vertices[i + 1]);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

function drawEye(ctx: CanvasRenderingContext2D, t: TransformedPart, part: Live2DPart, _time: number) {
  // 瞳孔(在 anchor 中心)
  const cx = t.anchorX;
  const cy = t.anchorY;
  // 眼球白
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(cx, cy, 14, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  // 瞳孔
  ctx.fillStyle = '#0B0B12';
  ctx.beginPath();
  ctx.arc(cx + (part.id === 'p_eye_r' ? 3 : -3), cy, 7, 0, Math.PI * 2);
  ctx.fill();
  // 高光
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx + (part.id === 'p_eye_r' ? 1 : -5), cy - 4, 2.4, 0, Math.PI * 2);
  ctx.fill();
}

function drawMouth(ctx: CanvasRenderingContext2D, t: TransformedPart, _part: Live2DPart, time: number) {
  // 嘴:在 anchor 中心画一个略张开的小椭圆
  const cx = t.anchorX;
  const cy = t.anchorY + 2;
  const open = 0.3 + Math.sin(time * 1.4) * 0.05;
  ctx.fillStyle = '#3A0A0A';
  ctx.beginPath();
  ctx.ellipse(cx, cy, 10, 6 * open, 0, 0, Math.PI * 2);
  ctx.fill();
  // 牙齿
  ctx.fillStyle = '#FFE8E8';
  ctx.fillRect(cx - 7, cy - 6 * open, 14, 2 * open);
  // 上唇高光
  ctx.fillStyle = '#FFB4A0';
  ctx.beginPath();
  ctx.moveTo(cx - 12, cy - 1);
  ctx.quadraticCurveTo(cx, cy - 4, cx + 12, cy - 1);
  ctx.lineTo(cx + 12, cy + 1);
  ctx.quadraticCurveTo(cx, cy - 1, cx - 12, cy + 1);
  ctx.closePath();
  ctx.fill();
}

// 评估动作叠加 (给一个混合后的参数值)
export function applyMotions(
  motions: Live2DProjectData['motions'],
  time: number,
  current: Record<string, number>,
): Record<string, number> {
  const out = { ...current };
  for (const m of motions) {
    if (m.trigger !== 'idle' || !m.loop) continue;
    const period = m.tracks.reduce((max, t) => {
      const last = t.keyframes[t.keyframes.length - 1]?.time ?? 0;
      return Math.max(max, last);
    }, 0);
    if (period <= 0) continue;
    const local = time % period;
    for (const tr of m.tracks) {
      const v = sampleKeyframes(tr.keyframes, local);
      if (typeof v === 'number') {
        // 混合:对 idle 动作,使用最高优先级覆盖
        out[tr.parameterId] = v;
      }
    }
  }
  return out;
}
