import type { Particle, Vec2 } from './types';

// 粒子系统:预分配对象池,避免频繁 GC
const MAX_PARTICLES = 600;

export class ParticleSystem {
  private pool: Particle[] = [];
  private cursor = 0;

  constructor() {
    for (let i = 0; i < MAX_PARTICLES; i++) {
      this.pool.push({
        pos: { x: 0, y: 0 },
        vel: { x: 0, y: 0 },
        life: 0,
        maxLife: 0,
        size: 0,
        color: '#fff',
        type: 'spark',
      });
    }
  }

  spawn(opts: Omit<Particle, 'pos' | 'vel' | 'life' | 'maxLife'> & { pos: Vec2; vel?: Vec2; life: number }) {
    const p = this.pool[this.cursor];
    this.cursor = (this.cursor + 1) % MAX_PARTICLES;
    p.pos = { ...opts.pos };
    p.vel = opts.vel ? { ...opts.vel } : { x: 0, y: 0 };
    p.life = opts.life;
    p.maxLife = opts.life;
    p.size = opts.size;
    p.color = opts.color;
    p.type = opts.type;
  }

  // 尾迹:每帧调用,生成一组微小粒子附着在玩家身后
  trail(pos: Vec2, color: string, intensity: number) {
    const count = Math.max(1, Math.floor(intensity));
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 10 + Math.random() * 25;
      this.spawn({
        pos: { x: pos.x + (Math.random() - 0.5) * 4, y: pos.y + (Math.random() - 0.5) * 4 },
        vel: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
        life: 0.4 + Math.random() * 0.3,
        size: 2 + Math.random() * 2,
        color,
        type: 'trail',
      });
    }
  }

  // 爆炸:敌人被撞毁时调用
  burst(pos: Vec2, color: string, count = 28) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
      const speed = 60 + Math.random() * 180;
      this.spawn({
        pos: { ...pos },
        vel: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
        life: 0.6 + Math.random() * 0.6,
        size: 2 + Math.random() * 3,
        color,
        type: 'burst',
      });
    }
  }

  // 撞击墙:少量尖锐火花
  spark(pos: Vec2, normal: Vec2, color: string) {
    for (let i = 0; i < 12; i++) {
      // 沿法线方向扩散
      const spread = (Math.random() - 0.5) * 1.2;
      const baseAngle = Math.atan2(normal.y, normal.x);
      const angle = baseAngle + spread;
      const speed = 80 + Math.random() * 120;
      this.spawn({
        pos: { ...pos },
        vel: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
        life: 0.3 + Math.random() * 0.3,
        size: 1.5 + Math.random() * 1.5,
        color,
        type: 'spark',
      });
    }
  }

  update(dt: number) {
    for (let i = 0; i < this.pool.length; i++) {
      const p = this.pool[i];
      if (p.life <= 0) continue;
      p.life -= dt;
      p.pos.x += p.vel.x * dt;
      p.pos.y += p.vel.y * dt;
      // 阻力
      p.vel.x *= 0.94;
      p.vel.y *= 0.94;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < this.pool.length; i++) {
      const p = this.pool[i];
      if (p.life <= 0) continue;
      const t = p.life / p.maxLife;
      const alpha = Math.max(0, Math.min(1, t));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.pos.x, p.pos.y, p.size * (0.5 + alpha * 0.5), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}
