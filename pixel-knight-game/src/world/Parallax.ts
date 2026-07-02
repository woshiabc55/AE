// 视差背景：按不同系数随摄像机滚动绘制各层

import { Camera } from "@/engine/Camera";
import {
  drawSky, drawMoon, drawFarCastle, drawMidPillars, drawGround, drawForegroundFog,
} from "@/sprites/tiles";

type Ctx = CanvasRenderingContext2D;

export class Parallax {
  /** 远景层（视差 < 1，在摄像机变换前绘制） */
  drawBackground(ctx: Ctx, cam: Camera, time: number) {
    drawSky(ctx);
    drawMoon(ctx, cam.x * 0.15);
    drawFarCastle(ctx, cam.x * 0.3);
    drawMidPillars(ctx, cam.x * 0.6);
  }

  /** 地面层（视差 = 1，在摄像机变换内绘制，需手动偏移） */
  drawGround(ctx: Ctx, cam: Camera) {
    drawGround(ctx, cam.x);
  }

  /** 前景雾（视差 > 1，在摄像机变换后绘制） */
  drawForeground(ctx: Ctx, cam: Camera, time: number) {
    drawForegroundFog(ctx, cam.x * 1.1 + time * 6, time);
  }
}
