export class FrameRateController {
  private targetFps: number;
  private frameInterval: number;
  private lastFrameTime: number = 0;
  private frameCount: number = 0;
  private fpsAccumulator: number = 0;
  private currentFps: number = 0;
  private fpsUpdateInterval: number = 500;
  private lastFpsUpdate: number = 0;

  constructor(targetFps: number = 60) {
    this.targetFps = targetFps;
    this.frameInterval = 1000 / targetFps;
  }

  setTargetFps(fps: number) {
    this.targetFps = Math.max(1, Math.min(60, fps));
    this.frameInterval = 1000 / this.targetFps;
  }

  getTargetFps(): number {
    return this.targetFps;
  }

  getCurrentFps(): number {
    return this.currentFps;
  }

  shouldRender(timestamp: number): boolean {
    const elapsed = timestamp - this.lastFrameTime;

    if (elapsed >= this.frameInterval) {
      this.lastFrameTime = timestamp - (elapsed % this.frameInterval);
      this.frameCount++;
      this.fpsAccumulator++;

      if (timestamp - this.lastFpsUpdate >= this.fpsUpdateInterval) {
        this.currentFps = Math.round(
          (this.fpsAccumulator * 1000) / (timestamp - this.lastFpsUpdate)
        );
        this.fpsAccumulator = 0;
        this.lastFpsUpdate = timestamp;
      }

      return true;
    }

    return false;
  }

  getFrameTime(): number {
    return this.frameInterval;
  }

  reset() {
    this.lastFrameTime = 0;
    this.frameCount = 0;
    this.fpsAccumulator = 0;
    this.currentFps = 0;
    this.lastFpsUpdate = 0;
  }
}
