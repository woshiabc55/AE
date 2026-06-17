import type { Theme } from '@/themes/themes';

interface Star {
  x: number;
  y: number;
  z: number; // 0..1 视差深度
  r: number;
  tw: number; // twinkle phase
}

export class StarField {
  private stars: Star[] = [];

  setSize(w: number, h: number) {
    const count = Math.floor((w * h) / 4500);
    this.stars = new Array(count);
    for (let i = 0; i < count; i++) {
      this.stars[i] = {
        x: Math.random(),
        y: Math.random() * 0.75, // 集中在上半部分
        z: 0.3 + Math.random() * 0.7,
        r: 0.4 + Math.random() * 1.4,
        tw: Math.random() * Math.PI * 2,
      };
    }
  }

  draw(
    ctx: CanvasRenderingContext2D,
    theme: Theme,
    w: number,
    h: number,
    t: number,
    beat: number,
  ) {
    ctx.save();
    ctx.fillStyle = theme.star;
    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      const tw = 0.55 + 0.45 * Math.sin(t * 2.2 + s.tw);
      const a = tw * (0.4 + s.z * 0.6) * (0.7 + beat * 0.6);
      ctx.globalAlpha = a;
      const x = s.x * w + Math.sin(t * 0.15 + s.tw) * 4 * s.z;
      const y = s.y * h;
      ctx.beginPath();
      ctx.arc(x, y, s.r * (0.8 + beat * 0.8), 0, Math.PI * 2);
      ctx.fill();
      // 远星加十字光芒
      if (s.r > 1.1) {
        ctx.globalAlpha = a * 0.4;
        ctx.beginPath();
        ctx.moveTo(x - 4, y);
        ctx.lineTo(x + 4, y);
        ctx.moveTo(x, y - 4);
        ctx.lineTo(x, y + 4);
        ctx.strokeStyle = theme.star;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}
