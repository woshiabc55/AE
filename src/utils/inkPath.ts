// 生成墨线贝塞尔路径
export function inkBezier(
  x1: number, y1: number, x2: number, y2: number, bow = 24
): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  // 垂直方向的偏移
  const nx = -dy / len;
  const ny = dx / len;
  const c1x = mx + nx * bow;
  const c1y = my + ny * bow;
  return `M ${x1} ${y1} Q ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${x2} ${y2}`;
}

// 简化的不规则虫蛀孔 path（用贝塞尔绘制带"咬痕"的圆）
export function nibbleCircle(cx: number, cy: number, r: number, points = 14): string {
  const segs: string[] = [];
  for (let i = 0; i < points; i++) {
    const a1 = (i / points) * Math.PI * 2;
    const a2 = ((i + 1) / points) * Math.PI * 2;
    const rr = r * (0.82 + (Math.sin(i * 17.13) + 1) * 0.1);
    const x1 = cx + Math.cos(a1) * rr;
    const y1 = cy + Math.sin(a1) * rr;
    const x2 = cx + Math.cos(a2) * rr;
    const y2 = cy + Math.sin(a2) * rr;
    const tx = cx + Math.cos((a1 + a2) / 2) * rr * 0.86;
    const ty = cy + Math.sin((a1 + a2) / 2) * rr * 0.86;
    if (i === 0) segs.push(`M ${x1.toFixed(1)} ${y1.toFixed(1)}`);
    segs.push(`Q ${tx.toFixed(1)} ${ty.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`);
  }
  segs.push('Z');
  return segs.join(' ');
}
