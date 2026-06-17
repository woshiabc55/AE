import type { Theme } from '@/themes/themes';

// 节拍冲击波 - 多圈扩张环
export class Shockwave {
  // 当前正在播放的冲击波（最多 4 个）
  private waves: Array<{ life: number; maxLife: number; x: number; y: number; hue: 'low' | 'mid' | 'high' }> = [];
  private lastBeat = 0;

  trigger(x: number, y: number, beat: number) {
    if (beat > 0.45 && performance.now() - this.lastBeat > 180) {
      this.lastBeat = performance.now();
      this.waves.push({
        life: 0,
        maxLife: 0.9,
        x,
        y,
        hue: 'low',
      });
      this.waves.push({
        life: 0.08,
        maxLife: 1.0,
        x,
        y,
        hue: 'mid',
      });
      this.waves.push({
        life: 0.16,
        maxLife: 1.1,
        x,
        y,
        hue: 'high',
      });
      if (this.waves.length > 12) this.waves.splice(0, this.waves.length - 12);
    }
  }

  update(dt: number) {
    for (let i = this.waves.length - 1; i >= 0; i--) {
      this.waves[i].life += dt;
      if (this.waves[i].life > this.waves[i].maxLife) this.waves.splice(i, 1);
    }
  }

  draw(ctx: CanvasRenderingContext2D, theme: Theme, w: number, h: number, maxR: number) {
    if (this.waves.length === 0) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const w0 of this.waves) {
      const t = w0.life / w0.maxLife;
      const r = t * maxR * 0.8;
      const a = (1 - t) * 0.6;
      const colorKey = w0.hue === 'low' ? theme.particleLow : w0.hue === 'mid' ? theme.particleMid : theme.particleHigh;
      ctx.strokeStyle = colorKey + Math.floor(a * 255).toString(16).padStart(2, '0');
      ctx.lineWidth = 1.5 + (1 - t) * 3;
      ctx.beginPath();
      ctx.arc(w0.x, w0.y, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }
}
