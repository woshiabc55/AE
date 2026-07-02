// 摄像机：跟随玩家 + 屏幕震动 + 世界边界裁剪

import { VIEW_W, VIEW_H, WORLD_LEFT, WORLD_RIGHT } from "@/config";

export class Camera {
  x = 0; // 摄像机左上角世界坐标
  y = 0;
  private shakeAmt = 0;
  private shakeX = 0;
  private shakeY = 0;
  private time = 0;

  /** 跟随目标中心 */
  follow(targetX: number, targetY: number, dt: number) {
    const desiredX = targetX - VIEW_W * 0.38; // 玩家位于画面左 1/3
    const desiredY = targetY - VIEW_H * 0.5;
    const lerp = Math.min(1, dt * 6);
    this.x += (desiredX - this.x) * lerp;
    this.y += (desiredY - this.y) * lerp * 0.5;
    // 限制
    this.x = Math.max(WORLD_LEFT, Math.min(WORLD_RIGHT - VIEW_W, this.x));
    this.y = Math.min(0, this.y);
  }

  addShake(amount: number) {
    this.shakeAmt = Math.min(16, this.shakeAmt + amount);
  }

  update(dt: number) {
    this.time += dt;
    this.shakeAmt *= Math.pow(0.001, dt); // 衰减
    if (this.shakeAmt < 0.05) this.shakeAmt = 0;
    this.shakeX = (Math.sin(this.time * 73) + Math.sin(this.time * 41)) * 0.5 * this.shakeAmt;
    this.shakeY = (Math.cos(this.time * 67) + Math.sin(this.time * 29)) * 0.5 * this.shakeAmt;
  }

  /** 世界坐标 → 屏幕坐标偏移（含震动） */
  ox() {
    return Math.round(-this.x + this.shakeX);
  }
  oy() {
    return Math.round(-this.y + this.shakeY);
  }
}
