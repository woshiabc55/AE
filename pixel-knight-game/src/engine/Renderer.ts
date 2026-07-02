// 渲染器：多层 Canvas 合成（背景视差 → 世界 → 光照 → 前景 → 后处理）

import { VIEW_W, VIEW_H, GROUND_Y, PAL } from "@/config";
import { Camera } from "@/engine/Camera";
import { Lighting, type Light } from "@/engine/Lighting";
import { PostFX } from "@/engine/PostFX";
import { Parallax } from "@/world/Parallax";
import { TORCHES } from "@/world/Level";
import { Particles } from "@/fx/Particles";
import { Player } from "@/entities/Player";
import { Enemy } from "@/entities/Enemy";
import { drawKnight } from "@/sprites/knight";
import { drawSkeleton } from "@/sprites/skeleton";
import { drawTorch } from "@/sprites/tiles";
import { PIXEL } from "@/config";

const SPRITE_HALF_W = 7 * PIXEL; // 骑士半宽
const SPRITE_H = 26 * PIXEL;
const E_HALF_W = 6 * PIXEL;
const E_H = 24 * PIXEL;

export class Renderer {
  private parallax = new Parallax();
  lighting = new Lighting();
  postfx = new PostFX();

  draw(
    ctx: CanvasRenderingContext2D,
    data: {
      player: Player;
      enemies: Enemy[];
      particles: Particles;
      camera: Camera;
      time: number;
      flashRed: number;
      paused: boolean;
    },
  ) {
    const { player, enemies, particles, camera, time, flashRed, paused } = data;
    // 清屏
    ctx.fillStyle = PAL.skyTop;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    ctx.imageSmoothingEnabled = false;

    // 1. 远景视差（屏幕空间）
    this.parallax.drawBackground(ctx, camera, time);

    // 2. 世界空间
    ctx.save();
    ctx.translate(camera.ox(), camera.oy());
    // 地面
    this.parallax.drawGround(ctx, camera);
    // 火把
    for (const t of TORCHES) {
      if (t.x < camera.x - 60 || t.x > camera.x + VIEW_W + 60) continue;
      drawTorch(ctx, t.x, t.y - GROUND_Y, time);
    }
    // 实体阴影
    this.drawShadow(ctx, player.x, player.y, 36);
    for (const e of enemies) this.drawShadow(ctx, e.x, e.y, 30);
    // 实体
    this.drawPlayer(ctx, player);
    // 排序按 y 绘制（简单的远近）
    const sorted = [...enemies].sort((a, b) => a.y - b.y);
    for (const e of sorted) this.drawEnemy(ctx, e);
    // 粒子
    particles.draw(ctx);
    ctx.restore();

    // 3. 前景雾（屏幕空间）
    this.parallax.drawForeground(ctx, camera, time);

    // 4. 光照
    const lights = this.collectLights(player, camera, time);
    this.lighting.draw(ctx, lights);

    // 5. 后处理
    this.postfx.draw(ctx, time);

    // 6. 受击红屏
    if (flashRed > 0) {
      ctx.fillStyle = `rgba(180,20,30,${Math.min(0.4, flashRed * 0.4)})`;
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    }

    // 7. 暂停遮罩
    if (paused) {
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    }
  }

  private drawPlayer(ctx: CanvasRenderingContext2D, p: Player) {
    ctx.save();
    ctx.translate(Math.round(p.x), Math.round(p.y));
    ctx.scale(p.facing, 1);
    ctx.translate(-SPRITE_HALF_W, -SPRITE_H);
    drawKnight(ctx, p.getDrawOpts());
    ctx.restore();
  }

  private drawEnemy(ctx: CanvasRenderingContext2D, e: Enemy) {
    ctx.save();
    if (e.dead && e.deadTime > 0.8) ctx.globalAlpha = Math.max(0, 1 - (e.deadTime - 0.8) / 0.6);
    ctx.translate(Math.round(e.x), Math.round(e.y));
    ctx.scale(e.facing, 1);
    ctx.translate(-E_HALF_W, -E_H);
    drawSkeleton(ctx, e.getDrawOpts());
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  private drawShadow(ctx: CanvasRenderingContext2D, x: number, feetY: number, w: number) {
    const air = Math.max(0, GROUND_Y - feetY);
    const scale = Math.max(0.35, 1 - air / 700);
    ctx.fillStyle = `rgba(0,0,0,${0.45 * scale})`;
    ctx.beginPath();
    ctx.ellipse(x, GROUND_Y + 3, w * scale, 7 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  private collectLights(player: Player, camera: Camera, time: number): Light[] {
    const lights: Light[] = [];
    const sx = (wx: number) => wx + camera.ox();
    const sy = (wy: number) => wy + camera.oy();

    // 月光（冷）
    const moonX = 980 - camera.x * 0.15;
    lights.push({
      x: moonX, y: 150, r: 260,
      color: [138, 180, 196], intensity: 0.18,
    });

    // 火把（暖）
    const flick = 0.85 + Math.sin(time * 18) * 0.1 + Math.sin(time * 31) * 0.05;
    for (const t of TORCHES) {
      const x = sx(t.x);
      if (x < -200 || x > VIEW_W + 200) continue;
      lights.push({
        x, y: sy(t.y) - 10, r: 150 * flick,
        color: [255, 138, 60], intensity: 0.55 * flick,
      });
    }

    // 玩家微光（便于看清角色）
    lights.push({
      x: sx(player.x), y: sy(player.y) - 30, r: 90,
      color: [120, 150, 200], intensity: 0.12,
    });

    // 剑光（攻击时强烈白蓝）
    if (
      player.state === "attack1" ||
      player.state === "attack2" ||
      player.state === "attack3"
    ) {
      const reach = 60;
      const lx = sx(player.x + player.facing * reach);
      const ly = sy(player.y) - 45;
      lights.push({
        x: lx, y: ly, r: 170,
        color: [200, 220, 255], intensity: 0.5,
      });
    }
    return lights;
  }
}
