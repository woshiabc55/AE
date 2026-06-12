import type { GameEngine } from './engine';
import { WORLD_H, WORLD_W } from './level';

const GRID = 60;
const PADDING = 0;

export class Renderer {
  ctx: CanvasRenderingContext2D;
  bgCanvas: HTMLCanvasElement | null = null;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  // 预渲染静态背景网格(世界坐标 -> 离屏 canvas)
  private ensureBg(themeColor: string, gridColor: string) {
    if (this.bgCanvas) return;
    const bg = document.createElement('canvas');
    bg.width = WORLD_W;
    bg.height = WORLD_H;
    const c = bg.getContext('2d')!;
    // 背景
    c.fillStyle = themeColor;
    c.fillRect(0, 0, WORLD_W, WORLD_H);

    // 径向渐变
    const grad = c.createRadialGradient(WORLD_W / 2, WORLD_H / 2, 100, WORLD_W / 2, WORLD_H / 2, 700);
    grad.addColorStop(0, 'rgba(255,255,255,0.04)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = grad;
    c.fillRect(0, 0, WORLD_W, WORLD_H);

    // 网格
    c.strokeStyle = gridColor;
    c.lineWidth = 1;
    c.beginPath();
    for (let x = 0; x <= WORLD_W; x += GRID) {
      c.moveTo(x, 0);
      c.lineTo(x, WORLD_H);
    }
    for (let y = 0; y <= WORLD_H; y += GRID) {
      c.moveTo(0, y);
      c.lineTo(WORLD_W, y);
    }
    c.stroke();

    this.bgCanvas = bg;
  }

  render(engine: GameEngine, timeMs: number) {
    const { ctx } = this;
    const w = engine.viewport.w;
    const h = engine.viewport.h;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);
    this.ensureBg(engine.theme.background, engine.theme.grid);

    // 摄像机偏移
    const camX = engine.camera.x;
    const camY = engine.camera.y;
    const scale = Math.min(w / WORLD_W, h / WORLD_H);
    const offsetX = w / 2 - camX * scale;
    const offsetY = h / 2 - camY * scale;

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    // 背景
    if (this.bgCanvas) {
      ctx.drawImage(this.bgCanvas, 0, 0);
    }

    // 墙
    for (const wall of engine.walls) {
      // 主体
      ctx.fillStyle = '#0E0E1F';
      ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
      // 描边
      ctx.strokeStyle = engine.theme.primary;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = engine.theme.glow;
      ctx.shadowBlur = 12;
      ctx.strokeRect(wall.x + 0.5, wall.y + 0.5, wall.w - 1, wall.h - 1);
      ctx.shadowBlur = 0;

      // 装饰横纹
      ctx.fillStyle = `${engine.theme.primary}22`;
      const step = 12;
      for (let y = wall.y; y < wall.y + wall.h; y += step) {
        ctx.fillRect(wall.x, y, wall.w, 1);
      }
      for (let x = wall.x; x < wall.x + wall.w; x += step) {
        ctx.fillRect(x, wall.y, 1, wall.h);
      }
    }

    // 敌人
    for (const e of engine.enemies) {
      if (!e.alive) continue;
      const flashing = timeMs < e.hitFlashUntilMs;
      ctx.save();
      ctx.shadowColor = e.color;
      ctx.shadowBlur = flashing ? 30 : 18;
      // 多边形 (六角) 提升辨识度
      const r = e.radius;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + timeMs * 0.0008;
        const x = e.pos.x + Math.cos(a) * r;
        const y = e.pos.y + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = flashing ? '#FFFFFF' : e.color;
      ctx.fill();
      // 内核
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.beginPath();
      ctx.arc(e.pos.x, e.pos.y, r * 0.4, 0, Math.PI * 2);
      ctx.fill();
      // HP 提示条
      if (e.hp < e.maxHp) {
        ctx.fillStyle = '#F43F5E';
        ctx.fillRect(e.pos.x - r, e.pos.y - r - 8, r * 2 * (e.hp / e.maxHp), 3);
      }
      ctx.restore();
    }

    // 玩家
    const p = engine.player;
    if (p.alive) {
      const blink = timeMs < p.invulnUntilMs && Math.floor(timeMs / 80) % 2 === 0;
      if (!blink) {
        ctx.save();
        // 外发光
        ctx.shadowColor = engine.theme.glow;
        ctx.shadowBlur = 28;
        // 主体
        const grad = ctx.createRadialGradient(p.pos.x - p.radius * 0.3, p.pos.y - p.radius * 0.3, 2, p.pos.x, p.pos.y, p.radius);
        grad.addColorStop(0, '#FFFFFF');
        grad.addColorStop(0.4, engine.theme.primary);
        grad.addColorStop(1, engine.theme.accent);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.pos.x, p.pos.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 冲刺时的拉伸描边
        if (timeMs < p.dashUntilMs) {
          ctx.save();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          ctx.shadowColor = engine.theme.glow;
          ctx.shadowBlur = 16;
          ctx.beginPath();
          ctx.arc(p.pos.x, p.pos.y, p.radius + 4, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }
    } else {
      // 死亡爆炸
      ctx.save();
      ctx.shadowColor = '#F43F5E';
      ctx.shadowBlur = 40;
      ctx.fillStyle = '#F43F5E';
      ctx.beginPath();
      ctx.arc(p.pos.x, p.pos.y, p.radius * 1.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 粒子
    engine.particles.draw(ctx);

    ctx.restore();

    // 视口边框(显示世界边界)
    const vbX = offsetX;
    const vbY = offsetY;
    const vbW = WORLD_W * scale;
    const vbH = WORLD_H * scale;
    ctx.save();
    ctx.strokeStyle = `${engine.theme.primary}66`;
    ctx.lineWidth = 2;
    ctx.shadowColor = engine.theme.glow;
    ctx.shadowBlur = 10;
    ctx.strokeRect(vbX - 1, vbY - 1, vbW + 2, vbH + 2);
    ctx.restore();

    // 边角 HUD 装饰
    this.drawCornerBrackets(w, h, engine.theme.primary);
  }

  private drawCornerBrackets(w: number, h: number, color: string) {
    const ctx = this.ctx;
    const m = 24;
    const len = 24;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    // 四个角
    const corners = [
      [m, m, 1, 1],
      [w - m, m, -1, 1],
      [m, h - m, 1, -1],
      [w - m, h - m, -1, -1],
    ] as const;
    for (const [x, y, sx, sy] of corners) {
      ctx.beginPath();
      ctx.moveTo(x + sx * len, y);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y + sy * len);
      ctx.stroke();
    }
    ctx.restore();
  }
}
