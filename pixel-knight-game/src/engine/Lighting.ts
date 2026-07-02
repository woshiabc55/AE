// 光照层：环境暗化 + 加法点光源（火把、月光、剑光、命中爆光）

import { VIEW_W, VIEW_H } from "@/config";

type Ctx = CanvasRenderingContext2D;

export interface Light {
  x: number;
  y: number;
  r: number;
  color: [number, number, number]; // rgb
  intensity: number; // 0..1
}

export class Lighting {
  /** 绘制夜间环境暗化 + 加法光照 */
  draw(ctx: Ctx, lights: Light[], ambient = 0.58) {
    // 1. 环境暗化（夜间底色）
    ctx.fillStyle = `rgba(6,8,20,${ambient})`;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    // 2. 加法点光源
    ctx.globalCompositeOperation = "lighter";
    for (const l of lights) {
      const g = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r);
      const [r, gr, b] = l.color;
      const a = l.intensity;
      g.addColorStop(0, `rgba(${r},${gr},${b},${a})`);
      g.addColorStop(0.5, `rgba(${r},${gr},${b},${a * 0.35})`);
      g.addColorStop(1, `rgba(${r},${gr},${b},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(l.x - l.r, l.y - l.r, l.r * 2, l.r * 2);
    }
    ctx.globalCompositeOperation = "source-over";
  }
}
