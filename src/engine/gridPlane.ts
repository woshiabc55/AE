import type { Theme } from '@/themes/themes';

// 透视网格地平面 - 从地平线向后下方延伸
// 网格随低频能量"呼吸"
export class GridPlane {
  draw(
    ctx: CanvasRenderingContext2D,
    theme: Theme,
    w: number,
    h: number,
    t: number,
    low: number,
    beat: number,
    horizonY: number,
  ) {
    ctx.save();

    // 1. 远山剪影
    ctx.fillStyle = theme.mountain;
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    let x = 0;
    const seed = 7.3;
    while (x < w) {
      const peak =
        Math.sin(x * 0.0042 + seed) * 22 +
        Math.sin(x * 0.011 + seed * 2) * 9 +
        Math.sin(x * 0.027 + seed * 3) * 4;
      ctx.lineTo(x, horizonY - 6 - peak);
      x += 14;
    }
    ctx.lineTo(w, horizonY);
    ctx.closePath();
    ctx.fill();
    // 山顶高光
    ctx.strokeStyle = theme.horizon + '55';
    ctx.lineWidth = 1;
    ctx.beginPath();
    x = 0;
    let first = true;
    while (x < w) {
      const peak =
        Math.sin(x * 0.0042 + seed) * 22 +
        Math.sin(x * 0.011 + seed * 2) * 9 +
        Math.sin(x * 0.027 + seed * 3) * 4;
      if (first) {
        ctx.moveTo(x, horizonY - 6 - peak);
        first = false;
      } else {
        ctx.lineTo(x, horizonY - 6 - peak);
      }
      x += 14;
    }
    ctx.stroke();

    // 2. 地平线辉光条
    const hl = ctx.createLinearGradient(0, horizonY - 1, 0, horizonY + 6);
    hl.addColorStop(0, 'rgba(0,0,0,0)');
    hl.addColorStop(0.5, theme.gridGlow);
    hl.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = hl;
    ctx.fillRect(0, horizonY - 1, w, 8);

    // 3. 主体水平线
    ctx.strokeStyle = theme.horizon;
    ctx.lineWidth = 1.4;
    ctx.shadowColor = theme.horizon;
    ctx.shadowBlur = 14 + beat * 20;
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    ctx.lineTo(w, horizonY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 4. 透视地平面 - 水平横线（向远方会聚）
    const groundTop = horizonY;
    const groundBot = h;
    const maxLines = 22;
    const breath = 1 + low * 0.6 + beat * 0.25;
    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 1;
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 1; i <= maxLines; i++) {
      const tt = i / maxLines;
      // 透视非线性，越远越密
      const y = groundTop + (groundBot - groundTop) * Math.pow(tt, 2.2) * breath;
      if (y > groundBot) break;
      const a = 0.18 + (1 - tt) * 0.7 + beat * 0.4;
      ctx.globalAlpha = Math.min(1, a);
      const lw = 0.5 + (1 - tt) * 1.4 + beat * 1.2;
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // 5. 垂直透视放射线
    const cx = w / 2;
    const verticalCount = 28;
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 0.8;
    for (let i = -verticalCount / 2; i <= verticalCount / 2; i++) {
      const tt = i / (verticalCount / 2);
      // 越靠中心线越窄的"消失点"
      const topX = cx + tt * 6 * breath;
      const botX = cx + tt * (w * 1.2);
      const a = 0.18 + Math.abs(tt) * 0.45 + beat * 0.2;
      ctx.globalAlpha = Math.min(1, a);
      ctx.beginPath();
      ctx.moveTo(topX, groundTop);
      ctx.lineTo(botX, groundBot);
      ctx.stroke();
    }

    // 6. 反射：日盘的倒影（淡）
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.18;
    const sunR = Math.min(w, h) * 0.22;
    const cx2 = w / 2;
    const reflGrad = ctx.createLinearGradient(0, horizonY, 0, horizonY + sunR * 0.9);
    reflGrad.addColorStop(0, theme.sunMid + 'AA');
    reflGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = reflGrad;
    // 反射也加水平条
    ctx.beginPath();
    ctx.rect(cx2 - sunR, horizonY, sunR * 2, sunR * 0.9);
    ctx.fill();
    // 反射上的扫描条
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = theme.skyTop;
    for (let i = 0; i < 9; i++) {
      const ty = i / 9;
      const y = horizonY + sunR * 0.9 * Math.pow(ty, 1.6);
      const thickness = 1 + ty * 4;
      ctx.fillRect(cx2 - sunR, y, sunR * 2, thickness);
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}
