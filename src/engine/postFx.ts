import type { Theme } from '@/themes/themes';

// 后期叠加：色差 + 扫描线 + 暗角 + 颗粒
// 直接在主画布上绘制
export class PostFx {
  // 时间稳定 hash (用于颗粒)
  private grainSeed = 0;

  draw(
    ctx: CanvasRenderingContext2D,
    theme: Theme,
    w: number,
    h: number,
    t: number,
    beat: number,
  ) {
    ctx.save();

    // 1. 扫描线（半透明横线）
    if (theme.scanline > 0.01) {
      ctx.fillStyle = `rgba(0,0,0,${theme.scanline * 0.6})`;
      const gap = 3;
      const offset = (t * 30) % gap;
      for (let y = offset; y < h; y += gap) {
        ctx.fillRect(0, y, w, 1);
      }
    }

    // 2. 暗角
    if (theme.vignette > 0.01) {
      const v = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.25, w / 2, h / 2, Math.max(w, h) * 0.75);
      v.addColorStop(0, 'rgba(0,0,0,0)');
      v.addColorStop(1, `rgba(0,0,0,${theme.vignette})`);
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, w, h);
    }

    // 3. 颗粒（稀疏随机点）
    if (theme.grain > 0.01) {
      this.grainSeed = (this.grainSeed + 1) % 1000;
      ctx.fillStyle = `rgba(255,255,255,${theme.grain * 0.4})`;
      const count = Math.floor((w * h) / 9000 * theme.grain);
      let s = this.grainSeed * 12.9898;
      for (let i = 0; i < count; i++) {
        s = (s * 9301 + 49297) % 233280;
        const x = (s / 233280) * w;
        s = (s * 9301 + 49297) % 233280;
        const y = (s / 233280) * h;
        ctx.fillRect(x, y, 1, 1);
      }
      // 暗点
      ctx.fillStyle = `rgba(0,0,0,${theme.grain * 0.4})`;
      for (let i = 0; i < count / 2; i++) {
        s = (s * 9301 + 49297) % 233280;
        const x = (s / 233280) * w;
        s = (s * 9301 + 49297) % 233280;
        const y = (s / 233280) * h;
        ctx.fillRect(x, y, 1, 1);
      }
    }

    // 4. 色差（边缘径向偏移）- 用彩边模拟
    if (theme.chromatic > 0.01) {
      const intensity = theme.chromatic * 2.4;
      const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.7);
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(0.7, `rgba(255,0,128,${intensity * 0.06})`);
      g.addColorStop(1, `rgba(0,255,255,${intensity * 0.12})`);
      ctx.fillStyle = g;
      ctx.globalCompositeOperation = 'screen';
      ctx.fillRect(0, 0, w, h);
    }

    // 5. 节拍闪光（很弱）
    if (beat > 0.5) {
      ctx.fillStyle = `rgba(255,255,255,${(beat - 0.5) * 0.12})`;
      ctx.fillRect(0, 0, w, h);
    }

    ctx.restore();
  }
}
