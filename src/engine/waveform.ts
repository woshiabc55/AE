import type { Theme } from '@/themes/themes';

// 屏幕中央横向波形带
export class Waveform {
  draw(
    ctx: CanvasRenderingContext2D,
    timeData: Uint8Array,
    theme: Theme,
    w: number,
    h: number,
    beat: number,
    rms: number,
  ) {
    const cy = h * 0.5;
    const amp = 60 + rms * 220 + beat * 80;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    // 外发光粗线
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = `${theme.wave}55`;
    ctx.beginPath();
    for (let i = 0; i < timeData.length; i++) {
      const x = (i / (timeData.length - 1)) * w;
      const v = (timeData[i] - 128) / 128;
      const y = cy + v * amp;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 核心细线
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = theme.wave;
    ctx.beginPath();
    for (let i = 0; i < timeData.length; i++) {
      const x = (i / (timeData.length - 1)) * w;
      const v = (timeData[i] - 128) / 128;
      const y = cy + v * amp;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 中线
    ctx.strokeStyle = `${theme.wave}22`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.stroke();

    ctx.restore();
  }
}
