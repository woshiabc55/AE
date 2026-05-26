export interface BelizeConfig {
  intensity: number;
  colorShift: number;
  distortion: number;
}

export class BelizeEffect {
  private config: BelizeConfig;
  private time: number = 0;

  constructor(config: BelizeConfig) {
    this.config = config;
  }

  updateConfig(config: BelizeConfig) {
    this.config = config;
  }

  update(dt: number) {
    this.time += dt;
  }

  render(ctx: CanvasRenderingContext2D, width: number, height: number) {
    if (this.config.intensity <= 0) return;

    const alpha = this.config.intensity * 0.15;
    ctx.save();
    ctx.globalAlpha = alpha;

    this.drawBlueBackground(ctx, width, height);
    this.drawRedStripes(ctx, width, height);
    this.drawWhiteCircle(ctx, width, height);
    this.drawWaveDistortion(ctx, width, height);

    ctx.restore();
  }

  private drawBlueBackground(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const shift = Math.sin(this.time * 0.3 + this.config.colorShift) * 20;
    const r = Math.max(0, Math.min(255, 0 + shift));
    const g = Math.max(0, Math.min(255, 63 + shift * 0.5));
    const b = Math.max(0, Math.min(255, 135 + shift * 0.3));
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(0, 0, width, height);
  }

  private drawRedStripes(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const stripeWidth = Math.max(2, Math.floor(width / 20));
    const offset = Math.sin(this.time * 0.5) * this.config.distortion * 3;

    ctx.fillStyle = '#CE1126';
    for (let i = -2; i < width / stripeWidth + 2; i++) {
      const x = i * stripeWidth * 2 + offset;
      const waveOffset = Math.sin(i * 0.5 + this.time * 0.8) * this.config.distortion * 2;
      ctx.fillRect(x + waveOffset, 0, stripeWidth, height);
    }
  }

  private drawWhiteCircle(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const cx = width / 2 + Math.sin(this.time * 0.4) * this.config.distortion * 5;
    const cy = height / 2 + Math.cos(this.time * 0.3) * this.config.distortion * 3;
    const radius = Math.max(1, Math.min(width, height) * 0.15);

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    const innerRadius = Math.max(1, radius * 0.6);
    const greenShift = Math.sin(this.time * 0.6 + this.config.colorShift) * 30;
    const gr = Math.max(0, Math.min(255, 0 + greenShift));
    const gg = Math.max(0, Math.min(255, 180 + greenShift));
    const gb = Math.max(0, Math.min(255, 50 + greenShift * 0.5));
    ctx.fillStyle = `rgb(${gr},${gg},${gb})`;
    ctx.beginPath();
    ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawWaveDistortion(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.globalAlpha = this.config.distortion * 0.1;
    ctx.strokeStyle = '#FFD100';
    ctx.lineWidth = 1;

    for (let y = 0; y < height; y += 4) {
      ctx.beginPath();
      for (let x = 0; x <= width; x += 2) {
        const dy = Math.sin(x * 0.1 + this.time * 2 + y * 0.05) * this.config.distortion * 3;
        if (x === 0) {
          ctx.moveTo(x, y + dy);
        } else {
          ctx.lineTo(x, y + dy);
        }
      }
      ctx.stroke();
    }
  }
}
