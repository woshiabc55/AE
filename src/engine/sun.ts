import type { Theme } from '@/themes/themes';

// 合成波日盘 - 中心径向渐变 + 水平扫描条
export class Sun {
  draw(
    ctx: CanvasRenderingContext2D,
    theme: Theme,
    w: number,
    h: number,
    t: number,
    beat: number,
    horizonY: number,
  ) {
    const cx = w / 2;
    const sunRadius = Math.min(w, h) * 0.22;
    const cy = horizonY - sunRadius * 0.05; // 太阳半沉入地平线
    const r = sunRadius * (1 + beat * 0.18);

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    // 1. 大气外晕
    const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2.4);
    halo.addColorStop(0, theme.sunMid + 'AA');
    halo.addColorStop(0.4, theme.sunBottom + '33');
    halo.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 2.4, 0, Math.PI * 2);
    ctx.fill();

    // 2. 主体渐变球
    const grad = ctx.createLinearGradient(cx, cy - r, cx, cy + r);
    grad.addColorStop(0, theme.sunTop);
    grad.addColorStop(0.55, theme.sunMid);
    grad.addColorStop(1, theme.sunBottom);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // 3. 水平扫描条 - 越多越靠下的条越粗（模拟日盘被地平线切分）
    ctx.fillStyle = theme.skyTop;
    const scanStart = cy + r * 0.05;
    const scanEnd = cy + r;
    const lineCount = 14;
    for (let i = 0; i < lineCount; i++) {
      const tt = i / lineCount;
      const y = scanStart + (scanEnd - scanStart) * Math.pow(tt, 1.6);
      const thickness = 1.2 + tt * 4.5;
      if (y > cy + r) break;
      ctx.fillRect(cx - r, y, r * 2, thickness);
    }

    // 4. 顶部高光
    ctx.globalCompositeOperation = 'screen';
    const sheen = ctx.createLinearGradient(cx, cy - r, cx, cy - r * 0.4);
    sheen.addColorStop(0, 'rgba(255,255,255,0.35)');
    sheen.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = sheen;
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, Math.PI * 2);
    ctx.fill();

    // 5. 太阳呼吸光晕（节拍放大）
    if (beat > 0.05) {
      ctx.globalCompositeOperation = 'lighter';
      const r2 = r * (1.4 + beat * 0.9);
      const pulse = ctx.createRadialGradient(cx, cy, r * 0.9, cx, cy, r2);
      pulse.addColorStop(0, theme.sunTop + '44');
      pulse.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = pulse;
      ctx.beginPath();
      ctx.arc(cx, cy, r2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
