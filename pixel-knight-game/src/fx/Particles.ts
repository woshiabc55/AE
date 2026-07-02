// 粒子系统：血、火花、尘、余烬

import { PAL } from "@/config";
import type { Particle } from "@/types";

const MAX = 240;

export class Particles {
  list: Particle[] = [];

  private add(p: Particle) {
    if (this.list.length >= MAX) this.list.shift();
    this.list.push(p);
  }

  blood(x: number, y: number, dir: number, count = 8) {
    for (let i = 0; i < count; i++) {
      const a = (Math.random() - 0.5) * 1.2 + dir;
      const sp = 120 + Math.random() * 260;
      this.add({
        x, y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 120,
        life: 0.5 + Math.random() * 0.4,
        maxLife: 0.9,
        size: 2 + Math.random() * 2,
        color: Math.random() < 0.7 ? PAL.blood : "#7a0e1a",
        gravity: 1600,
        kind: "blood",
      });
    }
  }

  spark(x: number, y: number, count = 6) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 80 + Math.random() * 220;
      this.add({
        x, y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: 0.25 + Math.random() * 0.25,
        maxLife: 0.5,
        size: 1 + Math.random() * 2,
        color: Math.random() < 0.5 ? PAL.spark : PAL.torchFire,
        gravity: 400,
        kind: "spark",
      });
    }
  }

  dust(x: number, y: number, count = 6) {
    for (let i = 0; i < count; i++) {
      this.add({
        x: x + (Math.random() - 0.5) * 20,
        y,
        vx: (Math.random() - 0.5) * 80,
        vy: -Math.random() * 80,
        life: 0.4 + Math.random() * 0.4,
        maxLife: 0.8,
        size: 2 + Math.random() * 3,
        color: PAL.dust,
        gravity: 200,
        kind: "dust",
      });
    }
  }

  ember(x: number, y: number) {
    this.add({
      x: x + (Math.random() - 0.5) * 6,
      y,
      vx: (Math.random() - 0.5) * 30,
      vy: -30 - Math.random() * 50,
      life: 0.8 + Math.random() * 0.6,
      maxLife: 1.4,
      size: 1 + Math.random() * 1.5,
      color: Math.random() < 0.5 ? PAL.torchFire : PAL.torchCore,
      gravity: -80,
      kind: "ember",
    });
  }

  update(dt: number) {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const p = this.list[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.list.splice(i, 1);
        continue;
      }
      p.vy += p.gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.98;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const p of this.list) {
      const a = Math.max(0, Math.min(1, p.life / p.maxLife));
      ctx.globalAlpha = a;
      ctx.fillStyle = p.color;
      const s = p.size;
      ctx.fillRect(Math.round(p.x - s / 2), Math.round(p.y - s / 2), s, s);
    }
    ctx.globalAlpha = 1;
  }

  clear() {
    this.list.length = 0;
  }
}
