import type { Theme } from '@/themes/themes';
import { NoiseField } from './noise';

type Band = 0 | 1 | 2;

interface Particle {
  // 极坐标参数
  angle: number; // 弧度
  radius: number; // 距中心的"基础"距离（会随低频呼吸）
  radiusBase: number;
  radialOsc: number; // 径向摆动相位
  band: Band;
  size: number;
  alpha: number;
  spin: number; // 角速度
  // 屏幕位置缓存
  x: number;
  y: number;
  prevX: number;
  prevY: number;
}

// 粒子环绕中央能量球做轨道运动 + 噪声扰动 + 节拍爆发
export class ParticleField {
  private list: Particle[] = [];
  private count = 0;
  private noise = new NoiseField(42);
  private t = 0;
  private width = 0;
  private height = 0;
  private cx = 0;
  private cy = 0;
  private maxR = 0;
  // 鼠标（归一化 -1..1）
  private mx = 0;
  private my = 0;

  setSize(w: number, h: number) {
    this.width = w;
    this.height = h;
    this.cx = w / 2;
    this.cy = h / 2;
    this.maxR = Math.hypot(w, h) * 0.6;
    if (this.list.length !== this.count) this.resize(this.count || 700);
  }

  setPointer(x: number, y: number) {
    const dx = x - this.cx;
    const dy = y - this.cy;
    this.mx = dx / this.maxR;
    this.my = dy / this.maxR;
  }

  setCount(n: number) {
    n = Math.max(100, Math.min(1400, Math.floor(n)));
    if (n !== this.count) this.resize(n);
  }

  private resize(n: number) {
    this.count = n;
    this.list = new Array(n);
    for (let i = 0; i < n; i++) {
      const band = (i % 3) as Band;
      const radiusBase =
        0.08 + Math.pow(Math.random(), 0.7) * 0.85; // 0.08..0.93
      const angle = Math.random() * Math.PI * 2;
      this.list[i] = {
        angle,
        radius: radiusBase,
        radiusBase,
        radialOsc: Math.random() * Math.PI * 2,
        band,
        size:
          0.5 +
          Math.random() * 1.4 +
          (band === 0 ? 0.5 : band === 2 ? -0.1 : 0.1),
        alpha: 0.45 + Math.random() * 0.5,
        spin: (Math.random() - 0.5) * 0.4 + (band === 0 ? 0.05 : band === 2 ? -0.08 : 0),
        x: 0,
        y: 0,
        prevX: 0,
        prevY: 0,
      };
    }
  }

  update(
    bands: { low: number; mid: number; high: number },
    beat: number,
    dt: number,
    sensitivity: number,
    speed: number,
    horizonY: number,
  ) {
    this.t += dt * speed;
    const cx = this.cx;
    const cy = horizonY; // 粒子围绕地平线中央聚集
    const maxR = this.maxR;

    for (let i = 0; i < this.list.length; i++) {
      const p = this.list[i];
      p.prevX = p.x;
      p.prevY = p.y;

      // 角速度：低频顺时针，中频反向，高频摆动
      const baseSpin = p.spin * (0.7 + 0.3 * speed);
      p.angle +=
        (baseSpin +
          (p.band === 0 ? bands.low * 0.6 : p.band === 1 ? -bands.mid * 0.4 : Math.sin(this.t * 3 + p.radialOsc) * bands.high * 0.5)) *
        dt *
        (0.6 + speed * 0.4);

      // 径向呼吸：低频拉伸 + 噪声扰动
      const noise =
        this.noise.noise2D(p.angle * 60, p.radiusBase * 30, this.t * 0.8) * 0.06;
      const beatBurst = beat > 0.2 ? (beat - 0.2) * 0.55 * p.radiusBase : 0;
      const bandRad = (p.band === 0 ? bands.low : p.band === 1 ? bands.mid : bands.high) * 0.18;
      p.radius =
        p.radiusBase +
        Math.sin(this.t * 1.4 + p.radialOsc) * 0.025 +
        noise +
        bandRad * sensitivity +
        beatBurst * sensitivity;

      const r = Math.max(0.05, p.radius) * maxR;

      // 位置
      const cos = Math.cos(p.angle);
      const sin = Math.sin(p.angle);
      p.x = cx + cos * r;
      // 椭圆形分布：垂直方向压缩（模拟地平线视角）
      p.y = cy + sin * r * 0.55;

      // 鼠标扰动（局部排斥）
      if (this.mx !== 0 || this.my !== 0) {
        const pmx = cx + this.mx * maxR;
        const pmy = cy + this.my * maxR * 0.55;
        const dx = p.x - pmx;
        const dy = p.y - pmy;
        const d2 = dx * dx + dy * dy;
        if (d2 < 140 * 140) {
          const d = Math.sqrt(d2) + 0.001;
          const push = (1 - d / 140) * 22;
          p.x += (dx / d) * push;
          p.y += (dy / d) * push;
        }
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, theme: Theme, beat: number, glow: number, ripple: boolean) {
    const colors = [theme.particleLow, theme.particleMid, theme.particleHigh];
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    // 1. 拖尾层 - 画从 prev 到 curr 的细线
    ctx.lineCap = 'round';
    for (let i = 0; i < this.list.length; i++) {
      const p = this.list[i];
      const base = colors[p.band];
      const dx = p.x - p.prevX;
      const dy = p.y - p.prevY;
      const move = Math.hypot(dx, dy);
      if (move < 0.3) continue;
      ctx.strokeStyle = base + '55';
      ctx.lineWidth = p.size * 0.9;
      ctx.beginPath();
      ctx.moveTo(p.prevX, p.prevY);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }

    // 2. 节点 + 外晕
    for (let i = 0; i < this.list.length; i++) {
      const p = this.list[i];
      const base = colors[p.band];
      const r = p.size * (1 + beat * 0.5);
      const a = p.alpha * (0.65 + 0.35 * (p.band === 0 ? beat : 1));
      ctx.fillStyle = base;
      ctx.globalAlpha = a;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
      if (glow > 0.05) {
        ctx.globalAlpha = a * 0.32 * glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * (3.5 + glow * 1.8), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. 轨道辅助线（仅低频段，且节拍时显著）
    if (ripple) {
      ctx.globalAlpha = 0.05 + beat * 0.18;
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 4; i++) {
        const r = (0.2 + i * 0.18) * this.maxR;
        ctx.strokeStyle = colors[i % 3] + '44';
        ctx.beginPath();
        ctx.arc(this.cx, this.cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    ctx.globalAlpha = 1;
    ctx.restore();
  }
}
