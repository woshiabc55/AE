import type { Theme } from '@/themes/themes';

// 中央悬浮能量球 - 多层内核 + 光线 + 节拍扩张环
export class Orb {
  draw(
    ctx: CanvasRenderingContext2D,
    theme: Theme,
    w: number,
    h: number,
    t: number,
    beat: number,
    rms: number,
    bands: { low: number; mid: number; high: number },
    horizonY: number,
  ) {
    const cx = w / 2;
    const cy = horizonY;
    const r = Math.min(w, h) * 0.075 * (1 + beat * 0.7 + rms * 0.4);

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    // 1. 极远场晕
    const far = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 6);
    far.addColorStop(0, theme.orbEdge + '40');
    far.addColorStop(0.4, theme.orbRay + '20');
    far.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = far;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 6, 0, Math.PI * 2);
    ctx.fill();

    // 2. 旋转光线
    const rayCount = 16;
    ctx.lineCap = 'round';
    for (let i = 0; i < rayCount; i++) {
      const a = (i / rayCount) * Math.PI * 2 + t * 0.6;
      const len = r * (3.2 + Math.sin(t * 1.8 + i) * 0.5) * (1 + beat * 0.4);
      const w0 = 1 + (i % 2) * 1.2 + beat * 2;
      const grad = ctx.createLinearGradient(
        cx + Math.cos(a) * r * 0.4,
        cy + Math.sin(a) * r * 0.4,
        cx + Math.cos(a) * len,
        cy + Math.sin(a) * len,
      );
      grad.addColorStop(0, theme.orbRay + 'AA');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = w0;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r * 0.4, cy + Math.sin(a) * r * 0.4);
      ctx.lineTo(cx + Math.cos(a) * len, cy + Math.sin(a) * len);
      ctx.stroke();
    }

    // 3. 外环（节拍扩张）
    if (beat > 0.05) {
      const ringR = r * (2.5 + beat * 6);
      ctx.strokeStyle = theme.orbEdge + Math.floor(beat * 110).toString(16).padStart(2, '0');
      ctx.lineWidth = 1.2 + beat * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
      ctx.stroke();
    }
    // 持续光环
    ctx.strokeStyle = theme.orbEdge + '55';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 6]);
    ctx.lineDashOffset = -t * 30;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 2.1, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. 中层光晕
    const mid = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r * 1.6);
    mid.addColorStop(0, theme.orbCore + 'CC');
    mid.addColorStop(0.5, theme.orbEdge + '66');
    mid.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = mid;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.6, 0, Math.PI * 2);
    ctx.fill();

    // 5. 内核（白热）
    const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    core.addColorStop(0, '#FFFFFF');
    core.addColorStop(0.4, theme.orbCore + 'EE');
    core.addColorStop(1, theme.orbEdge);
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // 6. 内核高光
    const hi = ctx.createRadialGradient(
      cx - r * 0.35, cy - r * 0.4, 0,
      cx - r * 0.35, cy - r * 0.4, r * 0.7,
    );
    hi.addColorStop(0, 'rgba(255,255,255,0.85)');
    hi.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = hi;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // 7. 节拍波环（多个扩张环）
    if (beat > 0.15) {
      for (let k = 0; k < 2; k++) {
        const ringR2 = r * (3.5 + k * 1.8 + beat * 4);
        const alpha = (1 - k * 0.4) * beat * 0.4;
        ctx.strokeStyle =
          theme.orbRay + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.lineWidth = 1 + beat * 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, ringR2, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // 8. 底部光柱（穿过地平线往下）
    const colH = h - cy;
    const colGrad = ctx.createLinearGradient(0, cy, 0, h);
    colGrad.addColorStop(0, theme.orbEdge + 'AA');
    colGrad.addColorStop(0.5, theme.orbEdge + '33');
    colGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = colGrad;
    const colW = r * (2 + beat * 4);
    ctx.fillRect(cx - colW / 2, cy, colW, colH * 0.85);

    ctx.restore();
  }
}
