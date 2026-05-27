export class AnimationLoop {
  private running = false;
  private rafId: number | null = null;
  private callback: (dt: number, elapsed: number) => void;
  private startTime = 0;
  private lastTime = 0;

  constructor(callback: (dt: number, elapsed: number) => void) {
    this.callback = callback;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.startTime = performance.now();
    this.lastTime = this.startTime;
    this.tick(this.startTime);
  }

  private tick = (now: number): void => {
    if (!this.running) return;
    const dt = (now - this.lastTime) / 1000;
    const elapsed = (now - this.startTime) / 1000;
    this.lastTime = now;
    this.callback(dt, elapsed);
    this.rafId = requestAnimationFrame(this.tick);
  };

  stop(): void {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  isRunning(): boolean {
    return this.running;
  }
}
