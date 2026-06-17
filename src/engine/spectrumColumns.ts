import type { Theme } from '@/themes/themes';

// 全息透视频谱柱 - 从地平线向上"拔起"，形成城市天际线
export class SpectrumColumns {
  draw(
    ctx: CanvasRenderingContext2D,
    freqData: Uint8Array,
    theme: Theme,
    w: number,
    h: number,
    beat: number,
    sensitivity: number,
    horizonY: number,
  ) {
    const cols = 80;
    const colW = w / cols;
    const gap = Math.max(1, colW * 0.22);
    const baseWidth = colW - gap;
    const maxH = h * 0.32;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < cols; i++) {
      // 对数分布的频率采样
      const tt = i / cols;
      const idx = Math.floor(Math.pow(tt, 1.55) * freqData.length * 0.9);
      const v = (freqData[idx] ?? 0) / 255;
      // 越靠中心越高
      const centerBoost = 1 - Math.abs(tt - 0.5) * 1.4;
      const barH = Math.max(2, v * maxH * (0.4 + centerBoost) * sensitivity + beat * 16);

      const x = i * colW + gap / 2;
      const top = horizonY - barH;

      // 渐变填充
      const grad = ctx.createLinearGradient(0, top, 0, horizonY);
      grad.addColorStop(0, theme.spectrumTop);
      grad.addColorStop(1, theme.spectrumBottom);
      ctx.fillStyle = grad;
      ctx.fillRect(x, top, baseWidth, barH);

      // 顶端 1px 高亮 + 横向辉光线
      ctx.fillStyle = theme.spectrumTop;
      ctx.fillRect(x, top - 1.5, baseWidth, 1.2);
      ctx.fillStyle = theme.spectrumTop + '44';
      ctx.fillRect(x - 1, top - 4, baseWidth + 2, 0.8);

      // 顶端 1px 描边
      ctx.strokeStyle = '#FFFFFF' + 'AA';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x + baseWidth, top);
      ctx.stroke();

      // 侧面高光（柱左侧 1px）
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.fillRect(x, top + 1, 1, barH - 1);
    }
    ctx.restore();
  }
}
