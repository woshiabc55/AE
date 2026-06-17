import type { Theme } from '@/themes/themes';
import { NoiseField } from './noise';

type Band = 0 | 1 | 2; // 0 low / 1 mid / 2 high

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  band: Band;
  seed: number;
  hueOffset: number;
  alpha: number;
}

const COLOR_KEY: Record<Band, keyof Pick<Theme, 'particleLow' | 'particleMid' | 'particleHigh'>> = {
  0: 'particleLow',
  1: 'particleMid',
  2: 'particleHigh',
};

export class ParticleField {
  private particles: Particle[] = [];
  private count = 0;
  private noise = new NoiseField();
  private t = 0;
  // 鼠标位置 (归一化 -1..1)
  private mx = 0;
  private my = 0;
  private width = 0;
  private height = 0;
  private dpr = 1;

  setSize(w: number, h: number, dpr: number) {
    this.width = w;
    this.height = h;
    this.dpr = dpr;
    // 根据 density 重建
    const target = Math.floor(900 * 0.6); // 800
    if (this.particles.length !== target) {
      this.resize(target);
    }
  }

  setPointer(x: number, y: number) {
    // 输入为 canvas 像素坐标
    this.mx = (x / this.width) * 2 - 1;
    this.my = (y / this.height) * 2 - 1;
  }

  setCount(n: number) {
    n = Math.max(80, Math.min(1200, Math.floor(n)));
    if (n !== this.count) this.resize(n);
  }

  private resize(n: number) {
    this.count = n;
    this.particles = new Array(n);
    for (let i = 0; i < n; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const band = (i % 3) as Band;
      this.particles[i] = {
        x,
        y,
        baseX: x,
        baseY: y,
        vx: 0,
        vy: 0,
        size: 0.6 + Math.random() * 1.6 + (band === 0 ? 0.4 : band === 2 ? -0.2 : 0),
        band,
        seed: Math.random() * 1000,
        hueOffset: Math.random() * 30 - 15,
        alpha: 0.55 + Math.random() * 0.4,
      };
    }
  }

  /**
   * 更新粒子位置
   * @param bands low/mid/high 0..1
   * @param beat 0..1 节拍脉冲
   * @param dt 秒
   * @param sensitivity 用户灵敏度
   * @param speed 速度倍率
   */
  update(
    bands: { low: number; mid: number; high: number },
    beat: number,
    dt: number,
    sensitivity: number,
    speed: number,
  ) {
    this.t += dt * speed;
    const w = this.width;
    const h = this.height;
    const cx = w / 2;
    const cy = h / 2;
    const bandAmp = [
      40 + bands.low * 320 * sensitivity,
      30 + bands.mid * 220 * sensitivity,
      20 + bands.high * 180 * sensitivity,
    ];
    const beatPush = beat * 60 * sensitivity;
    const mx = this.mx;
    const my = this.my;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      const n1 = this.noise.noise2D(p.baseX * 0.4, p.baseY * 0.4, this.t * 0.6);
      const n2 = this.noise.noise2D(p.baseX * 0.9, p.baseY * 0.9, this.t * 1.2);
      const amp = bandAmp[p.band];
      const dx = n1 * amp;
      const dy = n2 * amp;

      // 节拍时向中心推
      const toCx = cx - p.baseX;
      const toCy = cy - p.baseY;
      const dist = Math.hypot(toCx, toCy) + 0.001;
      const beatX = (toCx / dist) * beatPush;
      const beatY = (toCy / dist) * beatPush;

      // 鼠标吸引
      const pmx = (cx + mx * w * 0.4) - p.baseX;
      const pmy = (cy + my * h * 0.4) - p.baseY;
      const pmd = Math.hypot(pmx, pmy) + 0.001;
      const mouseForce = 22 * sensitivity;
      const mfx = (pmx / pmd) * mouseForce;
      const mfy = (pmy / pmd) * mouseForce;

      const targetX = p.baseX + dx + beatX + mfx;
      const targetY = p.baseY + dy + beatY + mfy;
      // 弹性插值
      p.vx += (targetX - p.x) * 0.12;
      p.vy += (targetY - p.y) * 0.12;
      p.vx *= 0.82;
      p.vy *= 0.82;
      p.x += p.vx * (dt * 60);
      p.y += p.vy * (dt * 60);

      // 漂移基点（让粒子持续缓慢漂移）
      p.baseX += Math.sin(this.t * 0.3 + p.seed) * 0.12 * speed;
      p.baseY += Math.cos(this.t * 0.27 + p.seed * 1.3) * 0.12 * speed;
      // 边界回绕
      if (p.baseX < -50) p.baseX = w + 50;
      if (p.baseX > w + 50) p.baseX = -50;
      if (p.baseY < -50) p.baseY = h + 50;
      if (p.baseY > h + 50) p.baseY = -50;
    }
  }

  draw(
    ctx: CanvasRenderingContext2D,
    theme: Theme,
    beat: number,
    glow: number,
    ripple: boolean,
  ) {
    const low = COLOR_KEY[0];
    const mid = COLOR_KEY[1];
    const high = COLOR_KEY[2];
    const colors = [theme[low], theme[mid], theme[high]];

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const beatSize = 1 + beat * 0.6;

    // 连线层（仅绘制部分以控制性能）
    if (this.count <= 600) {
      ctx.lineWidth = 0.6;
      for (let i = 0; i < this.particles.length; i++) {
        const a = this.particles[i];
        if (a.band !== 0) continue;
        for (let j = i + 1; j < this.particles.length; j++) {
          const b = this.particles[j];
          if (b.band - a.band !== 1) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > 110 * 110) continue;
          const t = 1 - Math.sqrt(d2) / 110;
          ctx.strokeStyle = `${colors[b.band]}${Math.floor(t * 38).toString(16).padStart(2, '0')}`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // 粒子点层
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      const base = colors[p.band];
      const r = p.size * beatSize * (p.band === 0 ? 1.4 : p.band === 2 ? 0.7 : 1.0);
      const a = p.alpha * (0.7 + 0.3 * (p.band === 0 ? beat : 1));
      // 内核
      ctx.fillStyle = base;
      ctx.globalAlpha = a;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
      // 外晕
      if (glow > 0.1) {
        ctx.globalAlpha = a * 0.35 * glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * (3.5 + glow * 1.5), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    ctx.restore();

    // 涟漪圈
    if (ripple && beat > 0.15) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const r = 40 + beat * 360;
      ctx.strokeStyle = `${theme.particleHigh}55`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(this.width / 2, this.height / 2, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = `${theme.particleLow}33`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(this.width / 2, this.height / 2, r * 1.4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }
}
