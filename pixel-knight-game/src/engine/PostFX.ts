// 后处理：CRT 扫描线 + 暗角 + 轻微闪烁 + 冷色调

import { VIEW_W, VIEW_H } from "@/config";

type Ctx = CanvasRenderingContext2D;

export class PostFX {
  private scanlineCache: HTMLCanvasElement;

  constructor() {
    // 预渲染扫描线纹理
    this.scanlineCache = document.createElement("canvas");
    this.scanlineCache.width = VIEW_W;
    this.scanlineCache.height = VIEW_H;
    const sctx = this.scanlineCache.getContext("2d")!;
    for (let y = 0; y < VIEW_H; y += 3) {
      sctx.fillStyle = "rgba(0,0,0,0.22)";
      sctx.fillRect(0, y, VIEW_W, 1);
    }
  }

  draw(ctx: Ctx, time: number) {
    // 冷色调映射（轻微蓝染）
    ctx.globalCompositeOperation = "overlay";
    ctx.fillStyle = "rgba(40,70,120,0.18)";
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    ctx.globalCompositeOperation = "source-over";

    // 扫描线
    ctx.globalAlpha = 0.5;
    ctx.drawImage(this.scanlineCache, 0, 0);
    ctx.globalAlpha = 1;

    // 暗角
    const vg = ctx.createRadialGradient(
      VIEW_W / 2,
      VIEW_H / 2,
      VIEW_H * 0.35,
      VIEW_W / 2,
      VIEW_H / 2,
      VIEW_H * 0.85,
    );
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    // CRT 微闪烁
    const flick = 0.025 + Math.sin(time * 11) * 0.012;
    ctx.fillStyle = `rgba(0,0,0,${Math.max(0, flick)})`;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  }
}
