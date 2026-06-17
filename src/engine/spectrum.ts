import type { Theme } from '@/themes/themes';

// 屏幕底部频谱柱
export class Spectrum {
  draw(
    ctx: CanvasRenderingContext2D,
    freqData: Uint8Array,
    theme: Theme,
    w: number,
    h: number,
    beat: number,
    sensitivity: number,
  ) {
    const barCount = 64;
    const gap = 2;
    const totalGap = gap * (barCount - 1);
    const barW = (w - totalGap) / barCount;
    const baseY = h - 24;
    const maxH = h * 0.42;

    ctx.save();
    // 底基线
    ctx.strokeStyle = theme.grid.replace(/[\d.]+\)$/, '0.25)');
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, baseY);
    ctx.lineTo(w, baseY);
    ctx.stroke();

    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < barCount; i++) {
      // 取对数分布的频率让低频更明显
      const idx = Math.floor(Math.pow(i / barCount, 1.6) * freqData.length * 0.85);
      const v = (freqData[idx] ?? 0) / 255;
      const barH = Math.max(2, v * maxH * sensitivity + beat * 8);
      const x = i * (barW + gap);
      // 渐变：底部 spectrumBottom -> 顶部 spectrumTop
      const grad = ctx.createLinearGradient(0, baseY - barH, 0, baseY);
      grad.addColorStop(0, theme.spectrumTop);
      grad.addColorStop(1, theme.spectrumBottom);
      ctx.fillStyle = grad;
      ctx.fillRect(x, baseY - barH, barW, barH);
      // 顶部亮点
      ctx.fillStyle = `${theme.spectrumTop}FF`;
      ctx.fillRect(x, baseY - barH - 2, barW, 1.2);
    }
    ctx.restore();
  }
}
